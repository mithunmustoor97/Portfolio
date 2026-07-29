# Mithun M - Portfolio

Static recreation of [mithun-m.framer.website](https://mithun-m.framer.website/) with original content and media.

## Motion (https://motion.dev)

Animation is powered by **[Motion](https://motion.dev)** v12:

```bash
npm install
```

- Package: `motion` in `package.json` / `node_modules`
- Browser build (used by the site): `js/vendor/motion.js`
- Wired in: `js/main.js`, `js/case-study.js` (`animate`, `inView`, `stagger`, `hover`, `scroll`)

Re-copy the vendor file after upgrading:

```bash
npm install motion@latest
copy node_modules\motion\dist\motion.js js\vendor\motion.js
```

## Open locally

```bash
npm start
# or: npx serve . -p 5500
# or: python -m http.server 5500
```

Then visit `http://localhost:5500`. You can also double-click `index.html`.

## Pages

| File | Matches |
|------|---------|
| `index.html` | Home |
| `about.html` | About Me |
| `work.html` | Works |
| `online-bhnagarwala.html` | Online Bhangarwala case study |
| `slsrfid.html` | SLSRFID case study |
| `tag-group.html` | TechAdGroup case study |

## Structure

```
New/
├── index.html
├── about.html
├── work.html
├── online-bhnagarwala.html
├── slsrfid.html
├── tag-group.html
├── css/styles.css
├── js/main.js
└── assets/images/   # media from Framer CDN
```

## Contact (from site)

- mithunmustoor97@gmail.com
- 7975452363
- [LinkedIn](https://www.linkedin.com/in/mithun-mustoor/)
- [Behance](https://www.behance.net/mithunmustoor)

## UI UX Pro Max skill

Installed from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill):

- Project: .cursor/skills/, .claude/skills/, .grok/skills/
- Grok (global): ~/.grok/skills/ui-ux-pro-max/
- CLI: `npx ui-ux-pro-max-cli`

Requires **Python 3** for design-system search scripts. Install from https://www.python.org/downloads/ if missing.
