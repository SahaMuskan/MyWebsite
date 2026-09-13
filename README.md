# Muskan Saha — Personal Website

Professional single-page site for a **credit-risk / model-risk specialist**, hosted on
**GitHub Pages**. Static HTML/CSS/JS — no build step, no tracking, no cookies.

**Live:** https://sahamuskan.github.io/MyWebsite/

## Structure
```
index.html            Single page (Hero · About · Expertise · Experience · Skills · Contact)
css/styles.css        Design system — "Trust Navy + Gold", light + dark
js/main.js            Theme toggle, mobile nav, scroll-spy, reveal, counters, contact form
assets/images/        Portrait, OG card, favicons
docs/                 Planning: PRODUCT / SPEC / DESIGN / PLAN / COUNCIL_REVIEW
```

## Activate the contact form (1 step)
The form uses [Web3Forms](https://web3forms.com) (free, no backend, keeps your email private):
1. Get a free **access key** at web3forms.com using the inbox where you want messages delivered.
2. In `index.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with your key.
That's it — until then the form politely tells visitors to use LinkedIn.

## Privacy by design
- **No email address or phone number** anywhere on the site or in any file.
- The **original résumé PDF is intentionally not part of this repo** (it contained private contact details) and is git-ignored.
- No analytics, cookies, or third-party trackers. Fonts are the only external request (Google Fonts — see follow-ups).

## Editing content
All copy lives in `index.html`. Colors, type and spacing are CSS variables at the top of `css/styles.css`
(`:root` for light, `html.dark` for dark).

## Documented follow-ups (see docs/PLAN.md)
- Self-host IBM Plex fonts (WOFF2) to remove the Google Fonts request (privacy/perf).
- Optional: migrate styling to a Tailwind CLI build if that workflow is preferred.
- Optional: add a "Perspectives" section (short IFRS 9 / SR 11-7 explainers).

---
Design informed by the *impeccable* and *ui-ux-pro-max* skills; planned via an *llm-council*-style review (`docs/COUNCIL_REVIEW.md`).
