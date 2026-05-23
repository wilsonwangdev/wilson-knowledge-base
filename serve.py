#!/usr/bin/env python3
"""Serve Wilson Knowledge Base static files with clean URL support."""
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

port = int(os.environ.get("PORT", 4180))
root = os.path.expanduser("~/projects/wilson-knowledge-base/public")

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root, **kwargs)

    def do_GET(self):
        # Try the exact path first
        path = self.translate_path(self.path)
        if os.path.exists(path):
            return super().do_GET()

        # Try appending .html for clean URLs (Quartz style)
        html_path = path + ".html"
        if os.path.exists(html_path):
            self.path = self.path + ".html"
            return super().do_GET()

        # Try index.html for directory-like paths
        index_path = os.path.join(path, "index.html")
        if os.path.isdir(path) and os.path.exists(index_path):
            self.path = self.path.rstrip("/") + "/index.html"
            return super().do_GET()

        return super().do_GET()

print(f"[knowledge-base] serving on port {port} (with clean URL support)", flush=True)
HTTPServer(("127.0.0.1", port), Handler).serve_forever()
