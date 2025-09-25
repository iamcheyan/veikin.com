import json
import os
from pathlib import Path
from typing import Dict, Any

from flask import Flask, jsonify, request, render_template, redirect, url_for

from .generator import generate_all


APP_DIR = Path(__file__).resolve().parents[1]
CONTENT_DIR = APP_DIR / "content"


APP_DIR = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = APP_DIR / "templates"
STATIC_DIR = APP_DIR / "static"


def _load_content(lang: str) -> Dict[str, Any]:
    file_path = CONTENT_DIR / f"site.{lang}.json"
    if not file_path.exists():
        return {}
    with file_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def create_app() -> Flask:
    # 配置模板与静态目录，使网站前台也通过 Flask 正常渲染与服务
    app = Flask(
        __name__,
        template_folder=str(TEMPLATES_DIR),
        static_folder=str(STATIC_DIR),
        static_url_path="/static",
    )

    # 与静态站点生成器保持一致：提供 `static(path)` 模板函数
    # 在 Flask 运行时返回 /static/...，在静态生成时由 generator 提供 /app/static/...
    app.jinja_env.globals.update({
        "static": lambda path: url_for("static", filename=path),
    })

    def asset_url(path: str) -> str:
        if not isinstance(path, str):
            return path
        p = path.strip()
        # 在 Flask 下静态资源一律走 /static/
        if p.startswith("/static/"):
            return p
        if p.startswith("static/"):
            return "/" + p
        return p

    app.jinja_env.filters["asset_url"] = asset_url

    @app.get("/admin/health")
    def health() -> Dict[str, str]:
        return {"status": "ok"}

    @app.get("/admin/content/<lang>")
    def get_content(lang: str):
        if lang not in {"ja", "zh", "en"}:
            return jsonify({"error": "unsupported language"}), 400
        file_path = CONTENT_DIR / f"site.{lang}.json"
        if not file_path.exists():
            return jsonify({"error": "content not found"}), 404
        with file_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return jsonify(data)

    @app.post("/admin/content/<lang>")
    def update_content(lang: str):
        if lang not in {"ja", "zh", "en"}:
            return jsonify({"error": "unsupported language"}), 400
        try:
            payload: Dict[str, Any] = request.get_json(force=True, silent=False)
        except Exception:
            return jsonify({"error": "invalid JSON"}), 400

        file_path = CONTENT_DIR / f"site.{lang}.json"
        file_path.parent.mkdir(parents=True, exist_ok=True)
        with file_path.open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        return jsonify({"ok": True})

    @app.post("/admin/generate")
    def generate():
        langs = request.args.get("langs", "ja,zh,en").split(",")
        langs = [l.strip() for l in langs if l.strip()]
        try:
            generate_all(langs)
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500
        return jsonify({"ok": True})

    # 根路径重定向到默认语言
    @app.get("/")
    def root_redirect():
        return redirect("/ja/", code=302)

    # ========= 前台站点（通过 Flask 动态渲染） =========
    @app.get("/<lang>/")
    def site_index(lang: str):
        if lang not in {"ja", "zh", "en"}:
            return "Unsupported language", 404
        site = _load_content(lang)
        t = site.get("t", {}) if isinstance(site, dict) else {}
        return render_template("index.html", lang=lang, site=site, t=t)

    @app.get("/<lang>/works.html")
    def site_works(lang: str):
        if lang not in {"ja", "zh", "en"}:
            return "Unsupported language", 404
        site = _load_content(lang)
        t = site.get("t", {}) if isinstance(site, dict) else {}
        return render_template("works.html", lang=lang, site=site, t=t)

    return app


app = create_app()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)


