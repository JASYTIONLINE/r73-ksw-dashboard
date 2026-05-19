# DigiPortAI portal home button (paste-in package)

Self-contained folder you can **copy into any repository**. It includes:

| File | Purpose |
|------|---------|
| `dai-home-button.js` | Registers `<dai-home-button>` (custom element, Shadow DOM) |
| `dai-btn.png` | Button artwork (keep it **next to** the `.js` file) |
| `README.md` | This install guide |

**Default “home” target:** [DigiPortAI on GitHub Pages](https://jasytionline.github.io/) (override with `href` if needed).

---

## Install (3 steps)

1. **Copy** the whole `dai-portal-home-button` folder into your project, for example:
   - Static site: `public/dai-portal-home-button/`
   - Vite: `public/dai-portal-home-button/`
   - Plain HTML at repo root: `dai-portal-home-button/` next to your pages

2. **Load the script once** on every page that should show the button (use a path that matches **your** deploy):

   ```html
   <script
     type="module"
     src="/dai-portal-home-button/dai-home-button.js"
   ></script>
   ```

   Adjust the `src` if your folder is not at the web root (e.g. `src="/my-app/dai-portal-home-button/dai-home-button.js"`).

3. **Place the tag** where you want the button (navbar, footer, etc.):

   ```html
   <dai-home-button></dai-home-button>
   ```

No npm install required. Keep `dai-btn.png` in the **same folder** as `dai-home-button.js` so the image loads automatically.

---

## Install without copying (link to JASYTI Pages)

If you prefer not to vendor files, load the published module from this repo:

```html
<script
  type="module"
  src="https://jasytionline.github.io/dai-portal-home-button/dai-home-button.js"
></script>
<dai-home-button></dai-home-button>
```

---

## Optional attributes

| Attribute | Default | Notes |
|-----------|---------|--------|
| `href` | `https://jasytionline.github.io/` | Portal URL |
| `img-src` | *(PNG next to the script)* | Override image URL |
| `label` | `Return to DigiPortAI (DAI) home` | Accessible name + tooltip |
| `layout` | `inline` | Use `fixed` for top-right floating button |

**Floating example**

```html
<dai-home-button layout="fixed"></dai-home-button>
```

**Resize from your page**

```html
<dai-home-button style="--dai-btn-max-height: 40px;"></dai-home-button>
```

- `--dai-btn-max-height` — max height of the image (default `48px`)
- `--dai-btn-width` — optional fixed width

---

## Bundlers (Vite, Webpack, …)

```js
import "/dai-portal-home-button/dai-home-button.js";
```

If the bundler rewrites `import.meta.url` so the PNG breaks, set an explicit image:

```html
<dai-home-button img-src="/dai-portal-home-button/dai-btn.png"></dai-home-button>
```

---

## Frameworks

Register the script once (e.g. in your root layout / `index.html`), then render the custom element:

- **React:** use `<dai-home-button />` and ensure your setup allows unknown intrinsic elements, or `document.createElement` after `import`.
- **Vue:** include the script in `index.html`, use `<dai-home-button>` in templates (Vue 3 supports custom elements; configure `compilerOptions.isCustomElement` if needed).

---

## License

Use with your DigiPortAI / JASYTI sites as you see fit.
