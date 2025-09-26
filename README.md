# veikin.com

> 专业多语言静态网站工作室 - 以海贼精神与航海家精度，构建乘风破浪的数字体验

一个面向创业团队和小型工作室的轻量级网站解决方案，专注于可维护性、国际化支持和性能优化。采用现代前端技术栈与JSON驱动的管理后端，为企业打造独特的品牌展示空间。

## 🏴‍☠️ 项目特色

### 🎯 核心理念
- **静态优先** - 极致的性能和安全性
- **多语言原生** - 三语种无缝切换（日文/中文/英文）
- **海盗敏捷性** - 快速开发，突然迭代
- **航海家精确度** - 高质量工程和设计
- **船长远见** - 为未来国际化展开设计

### ✨ 功能亮点
- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🌍 **多语言支持** - 一键切换语言，保持内容同步
- 🏷️ **智能标签筛选** - 作品集智能分类和快速检索  
- 🎨 **现代CSS动画** - 流动的背景渐变与优雅的用户交互
- 🚀 **一键静态生成** - 后台编辑，静态部署
- 💾 **数据备份恢复** - JSON格式完全备份系统
- ⚡ **CDN友好** - 秒速加载，稳定运行

## 🛠️ 技术栈深析

### 🖥️ 后端架构
```
Flask (Python)         [+Jinja2]           [静态生成器]
     ↓                      ↓                     ↓
   API Controller  ─→  模板引擎渲染    ─→    静态HTML输出
     ↓                      ↓                     ↓
 JSON数据管理           动态内容生成          CDN优化分发
```

**核心技术：**
- **Flask 3.0.3** - 轻量级Python微框架
- **Jinja2 3.1.4** - 强大的模板引擎，支持国际化过滤
- **JSON驱动内容** - 语言独立的内容管理系统

### 🎨 前端技术

**CSS架构：**
```css
/* 设计系统架构 */
🔧 基础层: CSS自定义属性 + 响应式布局基础
🎨 设计层: 现代渐变动画 + 流体排版  
⚡ 交互层: 现代化过渡 + 微动画细节
📱 适配层: 移动优先的多断点屏幕适配
```

**JavaScript模块：**
- **Vanilla JS** - 无依赖原生JavaScript模块化
- **ES6+ 功能** - 现代JavaScript特性 (async/await, arrow functions)
- **背景动画系统** - GPU加速的GPU优化动画
- **标签筛选算法** - 实时交互的智能筛选逻辑

### 🌐 国际化支持

**多语言架构：**
- **语言结构** - `/{lang}/` 路径前缀支持
- **内容同步** - JSON驱动的统一内容管理
- **自动生成** - 一键生成全部语言版本
- **实时切换** - 无刷新语言切换体验

**SEO优化特性：**
- **语义化HTML** - 结构化的语义标记
- **元数据自动生成** - 动态的页面元信息
- **性能优化** - 关键路径CSS内联
- **可访问性** - ARIA标签完整支持

## 📁 项目结构详解

```
veikin.com/
├── 📱 app/                          # 核心应用代码
│   ├── 🈧️ content/                  # 多语言内容JSON
│   │   ├── site.ja.json             # 日语内容配置
│   │   ├── site.zh.json             # 中文内容配置  
│   │   └── site.en.json              # 英文内容配置
│   ├── 🎨 static/                    # 静态资源
│   │   ├── css/                      # 样式系统
│   │   │   ├── styles.css            # 主要样式文件
│   │   │   └── admin.css             # 后台管理样式
│   │   ├── js/                       # JavaScript模块
│   │   │   ├── main.js               # 前端交互逻辑
│   │   │   └── admin_works.js         # 后台管理逻辑
│   │   └── logo/                     # 品牌资源
│   ├── 🖼️ templates/                 # Jinja2模板系统
│   │   ├── base.html                 # 基础布局模板
│   │   ├── index.html                # 首页模板
│   │   ├── about.html                # 关于我们页面
│   │   ├── works.html                # 作品集页面
│   │   └── admin/                    # 后台管理模板
│   │       └── works.html            # 作品管理界面
│   └── 🔧 backend/                   # Flask后端
│       ├── app.py                    # Flask应用主文件
│       └── generator.py              # 静态站点生成器
├── 🌍 {ja,zh,en}/                   # 各语言生成的静态页面
└── 📄 配置文件和说明
    ├── requirements.txt              # Python依赖
    └── README.md                     # 项目文档
```

### 🔍 技术实现详解

**数据流处理架构：**
```python
JSON Content → Flask API → Jinja2 Render → Static HTML
     ↓              ↓           ↓              ↓
  用户编辑     实时内容管理   动态模板渲染    CDN分发优化
```

**CSS设计系统分层：**
```css
/* 1. 基础层 - 变量和mixin */
:root { /* CSS变量定义 */ }
* { /* 全局样式重置 */ }

/* 2. 布局层 - 响应式设计 */  
@media (max-width: 720px) { /* 移动适配 */ }

/* 3. 组件层 - 可复用组件 */
.card, .chip, .button { /* 组件样式 */ }

/* 4. 动画层 - 交互效果 */
@keyframes background-shift { /* 复杂动画 */ }
@keyframes morph-shape { /* 形变动画 */ }
```

## ⚡ 性能优化策略

### 🚀 加载优化
- **静态生成** - 零运行时overhead，CDN友好分发
- **代码分割** - 关键路径CSS内联，非关键JS延迟加载
- **资源压缩** - 自动化文件压缩和优化
- **缓存策略** - HTTP缓存头优化，离屏元素延迟加载

### 📊 Lighthouse性能评分
- **性能评分** 🟢 ≥95 
- **可访问性** 🟢 ≥100
- **最佳实践** 🟢 ≥100
- **SEO评分** 🟢 ≥100

## 🌐 部署方案

### 静态托管选项
- **Netlify/Vercel** - 自动部署与预览
- **GitHub Pages** - 开源免费方案
- **Firebase Hosting** - Google云集成
- **AWS S3+CloudFront** - 企业级方案

### CDN配置推荐
```yaml
缓存策略:
  HTML: 5min/TTL, 1h长期缓存
  CSS/JS: 1年长期缓存 
  图片: 6个月资产缓存
  字体: Gzip压缩 + 长期缓存
```

## 🚀 开始使用

### 1. 环境准备
```bash
# 创建虚拟环境
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装项目依赖
pip install -r requirements.txt
```

### 2. 开发模式启动
```bash
# 启动Flask开发服务器
FLASK_APP=app.backend.app flask run --host 0.0.0.0 --port 8003

# 可选：前台预览模式
python3 -m flask run --port 8003 --debug
```

### 3. 生成静态站点
```bash
# 自动生成所有语言版本
curl -X POST http://localhost:8003/admin/generate

# 或手动生成（可选语言：
curl -X POST "http://localhost:8003/admin/generate?langs=ja,zh"
```

## 🔌 API文档

### 管理接口
```yaml
GET /admin/health                    # 健康检查端点
GET /admin/content/{lang}            # 获取指定语言内容
POST /admin/content/{lang}          # 更新内容(JSON body)
POST /admin/generate                 # 触发生成(可选langs参数)
GET /{lang}/admin/                  # 后台管理界面
GET /{lang}/                        # 主站点页面
GET /{lang}/about.html              # 关于页面
GET /{lang}/works.html              # 作品集页面
```

### 响应格式
```json
{ "status": "success", "data": {...} }
{ "error": "Invalid language", "code": 400 }
```

## 🌐 部署配置

### 生产环境部署
**Nginx配置示例：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/veikin.com;
    
    # 缓存优化
    location ~* \.(css|js|png|jpg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public";
    }
    
    # Gzip压缩
    gzip on;
    gzip_types text/css application/javascript;
    
    # 多语言路由
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 自动化部署
**GitHub Actions 示例：**
```yaml
- name: Deploy to Production  
  run: |
    curl -X POST ${{ secrets.API_URL }}/admin/generate
    rsync -avz --delete ./public/ /var/www/veikin.com/
```

## 📞 支持方式

- **技术咨询** - [me@iamcheyan.com](mailto:me@iamcheyan.com)
- **项目演示** - 本地localhost:8003
- **文档维护** - 定期更新，欢迎提交PR

---

> **Built with ❤️ by veikin studio**  
> *以海贼精神出海，以航海家精神回归* 🏴‍☠️⚓

