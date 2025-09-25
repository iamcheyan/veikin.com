import argparse
import os
import sys
import threading
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent


def reexec_in_venv(venv_path: Path) -> None:
    """如果指定了 venv，并且当前解释器不在该 venv，则使用该 venv 的 python 重新执行自身。"""
    venv_python = venv_path / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if not venv_python.exists():
        print(f"[app] 指定的虚拟环境无效: {venv_python}", file=sys.stderr)
        sys.exit(1)
    current = Path(sys.executable).resolve()
    if current != venv_python.resolve():
        print(f"[app] 切换到虚拟环境解释器: {venv_python}")
        os.execv(str(venv_python), [str(venv_python)] + sys.argv)


def ensure_root_static_symlink() -> None:
    """保持项目根目录干净：如果存在旧的 ./static 符号链接则移除。"""
    link_path = PROJECT_ROOT / "static"
    if link_path.is_symlink():
        try:
            link_path.unlink()
            print("[app] 已移除旧的 ./static 符号链接，静态资源改为直接引用 app/static。")
        except Exception as e:
            print(f"[app] 移除符号链接失败: {e}")


def start_flask_backend(port: int) -> None:
    from backend.app import app

    def _run():
        app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)

    t = threading.Thread(target=_run, daemon=True)
    t.start()
    print(f"[app] Flask 后台已启动: http://127.0.0.1:{port}")


def start_static_server(port: int) -> None:
    import http.server
    import socketserver
    import errno

    os.chdir(PROJECT_ROOT)

    handler = http.server.SimpleHTTPRequestHandler

    # 自动寻找可用端口（占用则递增）
    httpd = None
    chosen_port = None
    for p in range(port, port + 20):
        try:
            httpd = socketserver.TCPServer(("127.0.0.1", p), handler)
            chosen_port = p
            break
        except OSError as e:
            if getattr(e, 'errno', None) in {48, errno.EADDRINUSE}:
                continue
            raise

    if httpd is None:
        raise RuntimeError("无法启动静态服务器：连续 20 个端口均被占用")

    def _run():
        with httpd:
            print(f"[app] 静态站点预览已启动(根目录): http://127.0.0.1:{chosen_port}")
            httpd.serve_forever()

    t = threading.Thread(target=_run, daemon=True)
    t.start()


def render_pages(langs_csv: str) -> None:
    from backend.generator import generate_all

    langs = [x.strip() for x in langs_csv.split(",") if x.strip()]
    print(f"[app] 渲染语言: {langs}")
    generate_all(langs)
    ensure_root_static_symlink()
    print("[app] 渲染完成 -> 项目根目录/")


def main():
    parser = argparse.ArgumentParser(description="veikin 启动器：接受端口位置参数或 --port，渲染并启动 Flask")
    parser.add_argument("port", nargs="?", type=int, help="Flask 端口（位置参数，可选）")
    parser.add_argument("--port", dest="port_kw", type=int, default=5000, help="Flask 端口（可选，默认 5000）")
    args = parser.parse_args()

    chosen_port = args.port if args.port is not None else args.port_kw

    # 渲染固定语言，并直接启动 Flask（启用自动重载）
    render_pages("ja,zh,en")
    from backend.app import app
    print(f"[app] Flask 后台已启动: http://127.0.0.1:{chosen_port}")
    app.run(host="127.0.0.1", port=chosen_port, debug=True, use_reloader=True)


if __name__ == "__main__":
    main()

