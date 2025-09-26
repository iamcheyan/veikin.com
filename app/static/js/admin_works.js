(function () {
  const config = window.ADMIN_CONFIG || {};
  const root = document.querySelector('[data-admin-root]');
  const grid = root ? root.querySelector('[data-work-grid]') : null;
  const addBtn = root ? root.querySelector('[data-add-work]') : null;
  const statusContainer = root ? root.querySelector('[data-save-status]') : null;
  const statusDot = statusContainer ? statusContainer.querySelector('.status-dot') : null;
  const statusLabel = statusContainer ? statusContainer.querySelector('.status-label') : null;
  const langButtons = Array.from(document.querySelectorAll('[data-lang]'));
  const exportBtn = document.querySelector('[data-export-json]');
  const deployBtn = document.querySelector('[data-deploy]');
  const workTemplate = document.getElementById('work-card-template');

  if (!root || !grid || !addBtn || !workTemplate || !Array.isArray(config.langs) || !config.langs.length) {
    return;
  }

  const store = new Map();
  let currentLang = config.langs[0];
  const state = {
    dirty: false,
    saveTimer: null,
    isSaving: false,
    resave: false,
    toastTimer: null,
    currentSavePromise: null,
    pendingLang: null,
    nextSaveLang: null,
  };

  const STATUS_TEXT = {
    idle: 'Idle',
    loading: 'Loading…',
    pending: 'Pending save…',
    saving: 'Saving…',
    success: 'Saved',
    error: 'Save failed',
    generating: 'Generating…',
  };

  function setStatus(mode, text) {
    if (!statusDot || !statusLabel) {
      return;
    }
    statusDot.classList.remove('is-saving', 'is-success', 'is-error', 'is-pending');
    switch (mode) {
      case 'saving':
        statusDot.classList.add('is-saving');
        break;
      case 'success':
        statusDot.classList.add('is-success');
        break;
      case 'error':
        statusDot.classList.add('is-error');
        break;
      case 'pending':
        statusDot.classList.add('is-pending');
        break;
      default:
        break;
    }
    statusLabel.textContent = text || STATUS_TEXT[mode] || STATUS_TEXT.idle;
  }

  function deploySite() {
    if (!deployBtn) {
      return;
    }
    
    setStatus('generating');
    deployBtn.hidden = true;
    
    fetch('/admin/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Deploy failed');
      }
      return response.json();
    })
    .then(data => {
      setStatus('success');
      showDeployButton(true, 'success');
      setTimeout(() => {
        showDeployButton(false);
        setStatus('idle');
      }, 2000);
    })
    .catch(error => {
      console.error('Deploy error:', error);
      setStatus('error');
      showDeployButton(true, 'error');
      setTimeout(() => {
        showDeployButton(false);
        setStatus('idle');
      }, 3000);
    });
  }
  
  function showDeployButton(show, status = '') {
    if (!deployBtn) return;
    deployBtn.hidden = !show;
    
    if (show) {
      deployBtn.classList.remove('is-success', 'is-error');
      if (status === 'success') {
        deployBtn.classList.add('is-success');
      } else if (status === 'error') {
        deployBtn.classList.add('is-error');
      }
    }
  }

  // toast 替代函数
  function showToast(message, tone = 'info') {
    if (tone === 'success') {
      showDeployButton(true, 'success');
    } else if (tone === 'error') {
      showDeployButton(true, 'error');
    }
    console.log(message);
  }

  // 导出JSON备份
  function exportJsonBackup() {
    if (!exportBtn) {
      return;
    }
    
    try {
      const backupData = {};
      
      // 导出所有语言的数据
      config.langs.forEach(lang => {
        const entry = ensureEntry(lang);
        if (entry && (entry.content !== null || entry.works.length > 0)) {
          backupData[lang] = {
            content: entry.content,
            works: entry.works,
            timestamp: new Date().toISOString()
          };
        }
      });
      
      // 创建并下载JSON文件
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `veikin-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setStatus('success');
      showToast('备份导出成功！', 'success');
      setTimeout(() => {
        setStatus('idle');
      }, 1500);
      
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('error');
      showToast('导出失败，请重试', 'error');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  }

  function normalizeWork(raw) {
    return {
      title: raw?.title || '',
      description: raw?.description || '',
      url: raw?.url || '',
      image: raw?.image || '',
      date: raw?.date || '',
      tags: Array.isArray(raw?.tags)
        ? raw.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : typeof raw?.tags === 'string'
        ? raw.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    };
  }

  function ensureEntry(lang) {
    if (!store.has(lang)) {
      store.set(lang, { content: null, works: [] });
    }
    return store.get(lang);
  }

  function resolveImageSrc(path) {
    const trimmed = (path || '').trim();
    if (!trimmed) {
      return config.placeholderImage;
    }
    if (trimmed.startsWith('http')) {
      return trimmed;
    }
    if (trimmed.startsWith('/static/')) {
      return trimmed;
    }
    if (trimmed.startsWith('../')) {
      return trimmed.replace(/^\.\./, '');
    }
    return trimmed;
  }

  function renderWorks(works) {
    grid.innerHTML = '';
    if (!works.length) {
      const empty = document.createElement('div');
      empty.className = 'work-empty';
      empty.textContent = 'No projects yet. Add a new project to get started.';
      grid.appendChild(empty);
      return;
    }

    works.forEach((work, index) => {
      const fragment = workTemplate.content.cloneNode(true);
      const card = fragment.querySelector('[data-work-card]');
      const indexLabel = fragment.querySelector('[data-index]');
      const previewImg = fragment.querySelector('[data-preview-img]');
      const previewContainer = fragment.querySelector('[data-preview]');
      const previewPlaceholder = fragment.querySelector('[data-preview-placeholder]');
      const dateInput = fragment.querySelector('input[name="date"]');
      const titleInput = fragment.querySelector('input[name="title"]');
      const descriptionInput = fragment.querySelector('textarea[name="description"]');
      const urlInput = fragment.querySelector('input[name="url"]');
      const imageInput = fragment.querySelector('input[name="image"]');
      const tagsInput = fragment.querySelector('input[name="tags"]');
      const removeBtn = fragment.querySelector('[data-remove]');
      const moveButtons = fragment.querySelectorAll('[data-move]');
      const uploadBtn = fragment.querySelector('[data-upload-image]');
      const uploadInput = fragment.querySelector('[data-upload-input]');
      const openImageLink = fragment.querySelector('[data-open-image]');

      indexLabel.textContent = `#${String(index + 1).padStart(2, '0')}`;

      const refreshPreview = (value) => {
        const hasImage = Boolean(value && value.trim());
        const src = hasImage ? resolveImageSrc(value) : config.placeholderImage;
        previewImg.src = src;
        previewImg.alt = work.title || 'Preview';
        previewImg.hidden = !hasImage;
        if (previewPlaceholder) {
          previewPlaceholder.hidden = hasImage;
        }
        if (previewContainer) {
          previewContainer.classList.toggle('is-empty', !hasImage);
        }
        if (openImageLink) {
          if (hasImage) {
            openImageLink.href = src;
            openImageLink.hidden = false;
          } else {
            openImageLink.hidden = true;
            openImageLink.removeAttribute('href');
          }
        }
      };

      refreshPreview(work.image);

      dateInput.value = work.date || '';
      titleInput.value = work.title;
      descriptionInput.value = work.description;
      urlInput.value = work.url;
      imageInput.value = work.image;
      tagsInput.value = work.tags.join(', ');

      dateInput.addEventListener('input', (event) => {
        updateWork(index, 'date', event.target.value);
      });
      titleInput.addEventListener('input', (event) => {
        updateWork(index, 'title', event.target.value);
        previewImg.alt = event.target.value || 'Preview';
      });
      descriptionInput.addEventListener('input', (event) => {
        updateWork(index, 'description', event.target.value);
      });
      urlInput.addEventListener('input', (event) => {
        updateWork(index, 'url', event.target.value);
      });
      imageInput.addEventListener('input', (event) => {
        const value = event.target.value;
        updateWork(index, 'image', value);
        refreshPreview(value);
      });
      tagsInput.addEventListener('input', (event) => {
        updateTags(index, event.target.value);
      });

      removeBtn.addEventListener('click', () => {
        removeWork(index);
      });

      moveButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const direction = button.getAttribute('data-move');
          moveWork(index, direction === 'up' ? -1 : 1);
        });
      });

      if (uploadBtn && uploadInput) {
        uploadBtn.addEventListener('click', () => {
          uploadInput.click();
        });

        uploadInput.addEventListener('change', () => {
          const file = uploadInput.files && uploadInput.files[0];
          if (file) {
            handleImageUpload({
              index,
              file,
              previewContainer,
              previewImg,
              previewPlaceholder,
              imageInput,
              uploadBtn,
              openImageLink,
              refreshPreview,
            });
          }
          uploadInput.value = '';
        });
      }

      grid.appendChild(fragment);
    });
  }

  function updateWork(index, field, value) {
    const entry = ensureEntry(currentLang);
    const works = entry.works;
    if (!works[index]) {
      return;
    }
    works[index][field] = value;
    scheduleSave();
  }

  function updateTags(index, text) {
    const entry = ensureEntry(currentLang);
    const works = entry.works;
    if (!works[index]) {
      return;
    }
    works[index].tags = text
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    scheduleSave();
  }

  function addWork() {
    const entry = ensureEntry(currentLang);
    const today = new Date().toISOString().slice(0, 10);
    entry.works.unshift({
      title: 'New project',
      description: '',
      url: '',
      image: '',
      date: today,
      tags: [],
    });
    renderWorks(entry.works);
    scheduleSave();
  }

  function removeWork(index) {
    const entry = ensureEntry(currentLang);
    const works = entry.works;
    if (!works[index]) {
      return;
    }
    const confirmed = window.confirm('Remove this project?');
    if (!confirmed) {
      return;
    }
    works.splice(index, 1);
    renderWorks(works);
    scheduleSave();
  }

  function moveWork(index, offset) {
    if (offset === 0) {
      return;
    }
    const entry = ensureEntry(currentLang);
    const works = entry.works;
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= works.length) {
      return;
    }
    const [item] = works.splice(index, 1);
    works.splice(targetIndex, 0, item);
    renderWorks(works);
    scheduleSave();
  }

  function scheduleSave() {
    state.dirty = true;
    state.pendingLang = currentLang;
    if (state.isSaving) {
      state.resave = true;
      state.nextSaveLang = currentLang;
      return;
    }
    setStatus('pending', STATUS_TEXT.pending);
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => {
      saveWorks(state.pendingLang || currentLang).catch((error) => {
        console.error(error);
      });
    }, 800);
  }

  async function saveWorks(lang = currentLang, options = {}) {
    const force = Boolean(options.force);
    if (state.isSaving) {
      state.resave = true;
      state.nextSaveLang = lang;
      return state.currentSavePromise;
    }
    clearTimeout(state.saveTimer);
    state.saveTimer = null;

    if (!state.dirty && !force) {
      setStatus('idle', STATUS_TEXT.idle);
      return Promise.resolve();
    }

    const targetLang = lang;
    const entry = ensureEntry(targetLang);
    if (!entry.content) {
      return Promise.resolve();
    }

    entry.content.works = entry.works.map((work) => ({
      title: work.title || '',
      description: work.description || '',
      url: work.url || '',
      image: work.image || '',
      date: work.date || '',
      tags: Array.isArray(work.tags) ? work.tags : [],
    }));

    state.isSaving = true;
    state.pendingLang = null;
    state.dirty = false;
    setStatus('saving', STATUS_TEXT.saving);

    const savePromise = (async () => {
      try {
        const response = await fetch(config.contentApi(targetLang), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry.content),
        });
        if (!response.ok) {
          throw new Error(`Save failed (${response.status})`);
        }
        setStatus('success', STATUS_TEXT.success);
        showToast(`Saved ${targetLang.toUpperCase()} works`, 'success');
        setTimeout(() => {
          setStatus('idle', STATUS_TEXT.idle);
        }, 1600);
      } catch (error) {
        console.error(error);
        state.dirty = true;
        setStatus('error', STATUS_TEXT.error);
        showToast('Save failed. Please retry.', 'error');
        throw error;
      } finally {
        state.isSaving = false;
        state.currentSavePromise = null;
        const needsResave = state.resave;
        const nextLang = state.nextSaveLang || currentLang;
        state.resave = false;
        state.nextSaveLang = null;
        if (needsResave) {
          saveWorks(nextLang, { force: true }).catch((err) => console.error(err));
        }
      }
    })();

    state.currentSavePromise = savePromise;
    return savePromise;
  }

  async function loadLanguage(lang) {
    const entry = ensureEntry(lang);
    if (entry.content) {
      currentLang = lang;
      renderWorks(entry.works);
      setStatus('idle', STATUS_TEXT.idle);
      return;
    }

    setStatus('loading', `Loading ${lang.toUpperCase()}…`);
    try {
      const response = await fetch(config.contentApi(lang));
      if (!response.ok) {
        throw new Error(`Failed to load content (${response.status})`);
      }
      const data = await response.json();
      entry.content = data;
      entry.works = Array.isArray(data.works) ? data.works.map(normalizeWork) : [];
      currentLang = lang;
      renderWorks(entry.works);
      setStatus('idle', STATUS_TEXT.idle);
    } catch (error) {
      console.error(error);
      setStatus('error', 'Load failed');
      showToast('Unable to load content. Please refresh.', 'error');
    }
  }

  async function switchLanguage(lang, button) {
    if (lang === currentLang) {
      return;
    }
    if (state.saveTimer) {
      clearTimeout(state.saveTimer);
      state.saveTimer = null;
    }
    if (state.isSaving) {
      await state.currentSavePromise;
    }
    if (state.dirty) {
      await saveWorks(currentLang, { force: true });
    }
    langButtons.forEach((btn) => btn.classList.toggle('is-active', btn === button));
    await loadLanguage(lang);
  }


  async function handleImageUpload({
    index,
    file,
    previewContainer,
    previewImg,
    previewPlaceholder,
    imageInput,
    uploadBtn,
    openImageLink,
    refreshPreview,
  }) {
    if (!config.uploadApi) {
      showToast('Upload endpoint missing.', 'error');
      return;
    }

    const entry = ensureEntry(currentLang);
    const works = entry.works;
    if (!works[index]) {
      return;
    }

    const previousValue = works[index].image || '';
    const tempUrl = URL.createObjectURL(file);
    previewImg.hidden = false;
    previewImg.src = tempUrl;
    if (previewPlaceholder) {
      previewPlaceholder.hidden = true;
    }
    if (previewContainer) {
      previewContainer.classList.add('is-uploading');
    }
    if (uploadBtn) {
      const previousLabel = uploadBtn.textContent;
      uploadBtn.disabled = true;
      uploadBtn.dataset.prevLabel = previousLabel || '';
      uploadBtn.textContent = 'Uploading…';
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(config.uploadApi, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      const imagePath = result.path;
      imageInput.value = imagePath;
      updateWork(index, 'image', imagePath);
      refreshPreview(imagePath);
      showToast('Image uploaded.', 'success');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Upload failed.', 'error');
      refreshPreview(previousValue);
    } finally {
      if (uploadBtn) {
        uploadBtn.disabled = false;
        const label = uploadBtn.dataset.prevLabel || 'Upload image';
        uploadBtn.textContent = label;
        delete uploadBtn.dataset.prevLabel;
      }
      if (previewContainer) {
        previewContainer.classList.remove('is-uploading');
      }
      URL.revokeObjectURL(tempUrl);
    }
  }

  addBtn.addEventListener('click', addWork);

  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      switchLanguage(button.getAttribute('data-lang'), button);
    });
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportJsonBackup();
    });
  }

  if (deployBtn) {
    deployBtn.addEventListener('click', () => {
      deploySite();
    });
  }

  window.addEventListener('beforeunload', (event) => {
    if (state.dirty || state.isSaving) {
      event.preventDefault();
      event.returnValue = '';
    }
  });

  // Initial load
  loadLanguage(currentLang);
})();
