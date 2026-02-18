#!/usr/bin/env python3
"""AOCS dev server — redirects / to /site/, serves files from project root."""
import http.server
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '':
            self.send_response(302)
            self.send_header('Location', '/site/')
            self.end_headers()
        else:
            super().do_GET()

http.server.HTTPServer(('0.0.0.0', 8080), Handler).serve_forever()
