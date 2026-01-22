# BeOne Sports — Stripe-inspired demo

This is a lightweight, local demo homepage inspired by Stripe's layout and interactions. It uses your requested branding:

- Sitename: BeOne Sports
- Logo: `images/beonelogo.webp` (placeholder expected in `images`)
- Color: clean white + punchy accent
- Font: Helvetica Neue (system fallback)

Files:
- `index.html` — homepage
- `css/styles.css` — styles
- `js/app.js` — small interactions

How to run:
Open `index.html` in your browser or serve the folder with a static server.

Want next: accessibility audit, full content, or additional pages? Reply with what to add.

## Deploying

To publish this site from a GitHub repository and test on Netlify:

- Create a repository on GitHub and push this folder as the repository root.
- In Netlify, choose "New site from Git" → connect GitHub → select the repo → deploy (build command: none, publish directory: `/`).

Quick local commands (after creating a GitHub repo named `your-repo`):

```powershell
git remote add origin https://github.com/<your-username>/your-repo.git
git branch -M main
git push -u origin main
```

If you prefer, install the GitHub CLI and run `gh repo create --public --source=. --remote=origin --push` to create and push in one step.
