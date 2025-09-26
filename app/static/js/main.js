document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', 'light');

  // 检查是否在works页面（使用data-works-grid）
  const worksGrid = document.querySelector('[data-works-grid]');
  const worksFilterChips = document.querySelectorAll('[data-filter-tag]');

  // 检查是否在首页（使用.works-filter）
  const indexFilterChips = document.querySelectorAll('.filter-chip');
  const indexCards = document.querySelectorAll('.work-card');

  if (worksGrid && worksFilterChips.length) {
    // Works页面筛选器逻辑
    const cards = Array.from(worksGrid.querySelectorAll('[data-work-tags]'));
    const emptyState = worksGrid.querySelector('[data-filter-empty]');

    const setActiveChip = (selected) => {
      worksFilterChips.forEach((chip) => {
        const isActive = chip === selected;
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      });
    };

    const applyFilter = (tag, selectedChip) => {
      const normalizedTag = tag === '*' ? null : tag;
      let visibleCount = 0;

      cards.forEach((card) => {
        const tags = (card.dataset.workTags || '')
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean);
        const matches = !normalizedTag || tags.includes(normalizedTag);
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }

      if (selectedChip) {
        setActiveChip(selectedChip);
      }
    };

    worksFilterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.filterTag || '*';
        applyFilter(tag, chip);
      });
      chip.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          chip.click();
        }
      });
    });

    applyFilter('*');
  }

  // 首页筛选器逻辑
  if (indexFilterChips.length && indexCards.length) {
    const emptyState = document.querySelector('.works-empty');
    
    // 去重标签按钮
    const tagButtons = Array.from(indexFilterChips).filter(chip => chip.dataset.filter !== 'all');
    const uniqueTags = new Set();
    const buttonsToRemove = [];
    
    tagButtons.forEach(button => {
      const tag = button.dataset.filter;
      if (uniqueTags.has(tag)) {
        buttonsToRemove.push(button);
      } else {
        uniqueTags.add(tag);
      }
    });
    
    buttonsToRemove.forEach(button => button.remove());
    
    // 重新获取可用的筛选按钮
    const availableChips = document.querySelectorAll('.filter-chip');

    const setActiveChip = (selected) => {
      availableChips.forEach((chip) => {
        const isActive = chip === selected;
        chip.classList.toggle('is-active', isActive);
        chip.setAttribute('aria-pressed', String(isActive));
      });
    };

    const applyFilter = (tag, selectedChip) => {
      const normalizedTag = tag === 'all' ? null : tag;
      let visibleCount = 0;

      indexCards.forEach((card) => {
        const tags = (card.dataset.workTags || '')
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean);
        const matches = !normalizedTag || tags.includes(normalizedTag);
        card.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        const isEmpty = visibleCount === 0;
        emptyState.style.display = isEmpty ? 'block' : 'none';
      }

      if (selectedChip) {
        setActiveChip(selectedChip);
      }
    };

    availableChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const tag = chip.dataset.filter || 'all';
        applyFilter(tag, chip);
      });
      chip.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          chip.click();
        }
      });
    });

    applyFilter('all');
  }
});
