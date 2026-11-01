# Deploying to Netlify

This website is fully configured and ready to deploy on **Netlify** with zero configuration required.

---

## Option 1: One-Click Drag & Drop (Fastest — 30 seconds)

1. Build the production files:
   ```bash
   npm run build
   ```
2. In your Netlify dashboard (app.netlify.com), navigate to **Sites**.
3. Drag and drop the generated `dist` folder straight onto the Netlify upload box.
4. Your personal birthday website is immediately live with HTTPS!

---

## Option 2: Continuous Deployment via Git (GitHub / GitLab / Bitbucket)

If your repository is hosted on GitHub:
1. Push your project to your GitHub repository.
2. In Netlify, click **"Add new site"** → **"Import an existing project"**.
3. Select your repository. Netlify automatically detects settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**.

---

## Included Netlify Features

- **`netlify.toml`**: Configures build command, publish folder (`dist`), and SPA rewrites.
- **`public/_redirects`**: Guarantees that refreshing on `#eyes-gallery` or any route serves `index.html` with status `200` without 404 errors.
- **Asset Caching**: Configured `Cache-Control` header for fast loading of images and artwork.
- **Hidden Editor**: Story Content Editor button is completely hidden from visitors. To access editor controls as the creator, append `?edit=true` to your URL or press `Ctrl + Shift + E`.
