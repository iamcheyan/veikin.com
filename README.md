# veikin.com 静态企业站（Flask 后台 + JSON 驱动）

## 功能
- 多语言：日语/中文/英文
- 前台：纯静态 HTML/CSS/JS，从 JSON 内容生成
- 后台：Flask 提供内容读取/更新接口，并触发静态生成

## 目录结构
- `backend/` Flask 后台与静态生成器
- `content/` 多语言内容 JSON（`site.ja.json`/`site.zh.json`/`site.en.json`）
- `templates/` Jinja2 模板（`base.html`/`index.html`/`works.html`）
- `static/` 静态资源
- `public/` 生成后的静态网站输出

## 快速开始
1. 安装依赖
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```
2. 启动后台（本地）
```bash
FLASK_APP=backend.app flask run --host 0.0.0.0 --port 5000
```
3. 生成静态页面
```bash
curl -X POST http://localhost:5000/admin/generate
```
生成输出位于 `public/` 目录，可直接部署为静态站点（例如 Nginx/Netlify/Vercel 静态托管）。

## API 概览
- `GET /admin/health` 健康检查
- `GET /admin/content/<lang>` 获取语言内容（`ja|zh|en`）
- `POST /admin/content/<lang>` 更新语言内容（JSON 体）
- `POST /admin/generate?langs=ja,zh,en` 触发生成

## 部署建议
- 将 `public/` 与 `static/` 一并部署
- 根路径可重定向到 `/ja/` 或根据 Accept-Language 做前端选择

## 许可
MIT

