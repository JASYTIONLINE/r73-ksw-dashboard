/**
 * DigiPortAI — “Return to DAI” home button (dai-btn.png).
 *
 * Drop the whole `dai-portal-home-button` folder into any repo and load this
 * file as a module. The image resolves next to this script via import.meta.url.
 *
 * @example Paste folder at /public/dai-portal-home-button/
 * <script type="module" src="/dai-portal-home-button/dai-home-button.js"></script>
 * <dai-home-button></dai-home-button>
 *
 * @example From JASYTI GitHub Pages (no copy needed)
 * <script type="module" src="https://jasytionline.github.io/dai-portal-home-button/dai-home-button.js"></script>
 * <dai-home-button></dai-home-button>
 */
const DEFAULT_HOME = "https://jasytionline.github.io/";

/** When hosting the portal, use bundled PNG next to this file. */
const FALLBACK_IMG =
  "https://jasytionline.github.io/dai-portal-home-button/dai-btn.png";

function defaultImageUrl() {
  try {
    return new URL("dai-btn.png", import.meta.url).href;
  } catch {
    return FALLBACK_IMG;
  }
}

const DEFAULT_LABEL = "Return to DigiPortAI (DAI) home";

export class DaiHomeButton extends HTMLElement {
  static get observedAttributes() {
    return ["href", "img-src", "label", "title", "layout"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const href = (this.getAttribute("href") || DEFAULT_HOME).trim();
    const imgSrc = (this.getAttribute("img-src") || defaultImageUrl()).trim();
    const label = (
      this.getAttribute("label") ||
      this.getAttribute("title") ||
      DEFAULT_LABEL
    ).trim();

    const layout = (this.getAttribute("layout") || "inline").toLowerCase();
    const hostLayout =
      layout === "fixed"
        ? `:host { position: fixed; top: 0.75rem; right: 0.75rem; z-index: 10000; }`
        : `:host { display: inline-block; vertical-align: middle; }`;

    this.shadowRoot.textContent = "";

    const style = document.createElement("style");
    style.textContent = `
      ${hostLayout}
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        padding: 0;
        margin: 0;
        line-height: 0;
        border-radius: 6px;
        text-decoration: none;
        transition: opacity 0.2s ease, transform 0.15s ease;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
      }
      a:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      a:focus-visible {
        outline: 3px solid #22d3ee;
        outline-offset: 3px;
      }
      img {
        display: block;
        height: auto;
        max-width: 100%;
        width: var(--dai-btn-width, auto);
        max-height: var(--dai-btn-max-height, 48px);
      }
    `;
    this.shadowRoot.appendChild(style);

    const a = document.createElement("a");
    a.href = href;
    a.rel = "noopener noreferrer";
    a.target = "_self";
    a.setAttribute("aria-label", label);
    a.title = label;

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "";
    img.decoding = "async";
    img.loading = "lazy";

    a.appendChild(img);
    this.shadowRoot.appendChild(a);
  }
}

if (!customElements.get("dai-home-button")) {
  customElements.define("dai-home-button", DaiHomeButton);
}
