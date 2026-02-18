# AOCS Deployment Guide

## Local Development

### Setup DNS
Add to `/etc/hosts` (or Synology DNS):
```
192.168.0.65  aocs.lan
```

### Run Dev Server
```bash
./dev-server.sh
```

Access at: `http://aocs.lan:8080/aocs`

## Production (Cloudflare Pages)

### Option 1: Manual Deploy (Recommended for /aocs subpath)

Since you want this at `https://myavs.us/aocs`, the best approach is to integrate it into your existing Cloudflare Workers site.

1. **Copy site files to your myavs.us project:**
   ```bash
   cp -r site/ <your-myavs-project>/public/aocs/
   cp docs/AOCS.md <your-myavs-project>/public/aocs/docs/
   ```

2. **Update your Workers routing** to serve static files from `/aocs`

3. **Push to git** - Cloudflare will auto-deploy

### Option 2: Standalone Cloudflare Pages

If you want a separate deployment:

1. **Create new Cloudflare Pages project**
   - Connect to this git repo
   - Build directory: `site`
   - Build command: (none - static files)

2. **Custom domain:** `aocs.myavs.us` or similar

### DNS Note
For `aocs.lan` to work locally, add to Synology DNS:
- Hostname: `aocs`
- IP: `192.168.0.65` (this machine)

## File Structure for Production

When deploying to `/aocs` subpath:
```
/aocs/
  ├── index.html
  └── docs/
      └── AOCS.md
```

All asset paths in `index.html` use relative paths (`../docs/AOCS.md`), so they'll work at any base path.
