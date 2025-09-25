import json
from pathlib import Path
from typing import Dict, Any, List

from jinja2 import Environment, FileSystemLoader, select_autoescape


APP_DIR = Path(__file__).resolve().parents[1]
PROJECT_ROOT = APP_DIR.parent
CONTENT_DIR = APP_DIR / "content"
TEMPLATES_DIR = APP_DIR / "templates"
OUTPUT_DIR = PROJECT_ROOT  # 输出到项目根目录
STATIC_DIR = APP_DIR / "static"


def _load_content(lang: str) -> Dict[str, Any]:
    file_path = CONTENT_DIR / f"site.{lang}.json"
    with file_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _jinja_env() -> Environment:
    env = Environment(
        loader=FileSystemLoader(str(TEMPLATES_DIR)),
        autoescape=select_autoescape(["html", "xml"]),
        enable_async=False,
    )
    env.globals.update({
        "static": lambda path: f"/app/static/{path}",
    })
    return env


def generate_all(langs: List[str]) -> None:
    env = _jinja_env()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Static assets live under app/static and are referenced directly via /app/static/...
    # Deployments should ship that folder alongside the generated language directories.

    for lang in langs:
        data = _load_content(lang)

        # index.html
        index_tpl = env.get_template("index.html")
        index_html = index_tpl.render(lang=lang, t=data.get("t", {}), site=data)
        out_dir = OUTPUT_DIR / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(index_html, encoding="utf-8")

        # works.html
        works_tpl = env.get_template("works.html")
        works_html = works_tpl.render(lang=lang, t=data.get("t", {}), site=data)
        (out_dir / "works.html").write_text(works_html, encoding="utf-8")

    # root index: redirect or language selector
    root_index = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta http-equiv="refresh" content="0; url=/ja/"/>
    <title>veikin</title>
  </head>
  <body>
    <p>Redirecting to /ja/ ...</p>
  </body>
</html>
"""
    (OUTPUT_DIR / "index.html").write_text(root_index, encoding="utf-8")
