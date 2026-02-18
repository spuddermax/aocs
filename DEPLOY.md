# AOCS Deployment Guide

## Local Development

### Run Dev Server
```bash
./dev-server.sh
```

Access at: `http://localhost:8080/site/`

### Optional: Custom Local DNS
If you want a custom local domain (e.g., `aocs.local`), add to `/etc/hosts`:
```
127.0.0.1  aocs.local
```

Then access at: `http://aocs.local:8080/site/`

## Production Deployment

### Option 1: Cloudflare Pages (Standalone)

1. **Create new Cloudflare Pages project**
   - Connect to this git repo
   - Build directory: `site`
   - Build command: (none - static files)
   - Build output directory: `/`

2. **Configure custom domain** (optional)

### Option 2: Integrate into Existing Site (Subpath)

To deploy at a subpath like `/aocs` on an existing site:

1. **Copy files to your project:**
   ```bash
   cp -r site/ <your-project>/public/aocs/
   cp -r docs/ <your-project>/public/aocs/docs/
   ```

2. **Update routing** in your web server/Workers to serve static files from `/aocs`

3. **Push to deploy**

### Option 3: GitHub Pages

1. **Enable GitHub Pages** in repository settings
2. **Set source to `main` branch**
3. **Set directory to `/site`**
4. Access at: `https://yourusername.github.io/aocs/`

## File Structure

The site uses relative paths, so it works at any base path:

```
/
├── site/
│   └── index.html
└── docs/
    └── AOCS.md
```

All asset paths in `index.html` use relative paths (`../docs/AOCS.md`), making the site portable.
