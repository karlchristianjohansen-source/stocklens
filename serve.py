#!/usr/bin/env python3
"""Static file server for local preview.

Two deliberate choices:
  * the port comes from $PORT, so the harness can assign one and there is
    no hardcoded flag to collide with something already listening;
  * the served directory is resolved from this file's own location, not the
    process working directory, which keeps it correct no matter where the
    server is launched from.
"""
import functools
import http.server
import os
import pathlib
import socketserver

ROOT = pathlib.Path(__file__).resolve().parent
PORT = int(os.environ.get("PORT") or 4770)


class Server(socketserver.TCPServer):
    allow_reuse_address = True


class Handler(http.server.SimpleHTTPRequestHandler):
    """Never let the browser cache during local preview.

    Without this the browser holds on to app.js / styles.css and edits appear
    to do nothing, which is a slow and confusing way to lose ten minutes.
    """

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main() -> None:
    handler = functools.partial(Handler, directory=str(ROOT))
    with Server(("127.0.0.1", PORT), handler) as httpd:
        print(f"serving {ROOT} on http://127.0.0.1:{PORT}", flush=True)
        httpd.serve_forever()


if __name__ == "__main__":
    main()
