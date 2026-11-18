# Alin Kakaei — Resume Website

A dependency-free HTML, CSS, and JavaScript resume website. The content is data-driven, bilingual (Persian / English), responsive, and ready to extend.

## Run locally

Open `index.html` in a browser, or serve the folder through a local static server. For example:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Project structure

```text
alin-resume-website/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── images/
    │   └── favicon.svg
    └── js/
        ├── app.js
        └── resume-data.js
```

## Update resume content

Edit `assets/js/resume-data.js` to update the resume. Keep Persian and English values together in each field:

```js
{
  title: {
    fa: "عنوان فارسی",
    en: "English title"
  }
}
```

Add or edit entries in `experience`, `education`, `courses`, `languages`, `skills`, `projects`, and `certificates`. Project cards are rendered from the `projects` array; use `group: "main"` or `group: "portfolio"` to place them in the corresponding panel. Add category IDs to `categories` to make projects respond to the filters.

The layout uses content-driven panels and CSS grid/flex layouts. Avoid fixed panel heights so longer descriptions, additional skills, and translated text can expand naturally.

## Existing interactions

- Persian / English language switch with automatic right-to-left / left-to-right text direction.
- Expandable project descriptions and project category filters.
- Scroll-reveal animations with reduced-motion support.
- Optional flashlight mode with a cursor-following spotlight, bilingual control, and a glowing lights-on button.
- Print / Save as PDF action.
- Responsive three-column, two-column, and single-column layouts.

## Flashlight mode

The page starts in its normal illuminated state. Use **چراغ خاموش / lights out** to darken the page and reveal a circular area around the pointer. The flashlight control stays fixed at the top-left in both modes; its glow is white while flashlight mode is active. The feature is excluded from the print stylesheet and exported CV.

## Export a professional CV PDF

Use the **Save CV as PDF** button. It opens the browser print dialog with a separate, data-driven CV layout:

- Page 1: profile, contact details, summary, experience, education, courses, certificates, skills, and languages.
- Page 2 onward: projects and selected work, with additional projects flowing onto continuation pages automatically.
- The export follows the current language selection (Persian or English) and includes all projects, regardless of the active website filter or which project details are expanded.

In the browser print dialog, select **Save as PDF**, keep the paper size set to **A4**, and turn off **Headers and footers** for a clean document. The exported PDF remains text-selectable and keeps project links clickable.

## Extend later

- Add images to `assets/images/` and reference them from the project data.
- Add more resume sections by placing their content in `resume-data.js`, rendering them in `app.js`, and styling them in `styles.css`.
- If the project later needs a framework or CMS, the data-driven rendering layer can be migrated without rewriting the resume content structure.

No build step or external JavaScript dependency is required.


## Typography

The design is prepared for **Klapt Arabic** as the main Persian typeface and **Ray Arabic** as a limited pixel-display accent for window headings and small labels. The commercial font files are not included. To activate them, place properly licensed webfont files in `assets/fonts/` using these names:

- `klapt-arabic-regular.woff2`
- `klapt-arabic-medium.woff2`
- `klapt-arabic-bold.woff2`
- `ray-arabic.woff2`

The site falls back to system fonts until those files are added. Confirm that your font license permits web embedding before publishing.
