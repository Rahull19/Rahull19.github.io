# rahull19.github.io

Personal portfolio of **Rahul Potti**, AI Engineer and Python Backend Engineer.

Live at **https://rahull19.github.io/**

## Stack

A static site with no framework, no build step and no runtime dependencies, so GitHub Pages serves it as is.

```
index.html               all page content (semantic HTML, indexable)
404.html                 not-found page
assets/css/styles.css    design tokens, layout, components
assets/js/main.js        nav state, active section, reveal, case-study dialog, copy email
assets/fonts/            self-hosted Inter, Instrument Serif, JetBrains Mono (SIL OFL)
assets/img/              favicon, touch icon, Open Graph image
assets/Rahul_Potti_Resume.pdf
robots.txt, sitemap.xml, .nojekyll
```

## Editing content

- **Text** lives in `index.html`, section by section (`#about`, `#skills`, `#projects`, `#experience`, `#expertise`, `#resume`, `#contact`).
- **Case studies:** each project card has a hidden `.case-study` block. Its contents are copied into the dialog when "Read case study" is clicked. Deep links work too, for example `/#case-alertlens`.
- **Résumé:** replace `assets/Rahul_Potti_Resume.pdf` and keep the same file name.
- **Colours and spacing** are CSS custom properties at the top of `styles.css`.

## Run locally

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push to `main`. GitHub Pages publishes the repository root automatically for a `<username>.github.io` repository.
