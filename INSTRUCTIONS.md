# 🏋️ Gym Tracker — Claude Code Handoff Instructions

## What this is
A React web app for Adam & Kelly to track their gym workouts.
It needs to be set up as a proper project, deployed to GitHub Pages,
and connected to Google Sheets for logging workout data.

---

## Your job (Claude Code)

Please do all of the following steps in order. Ask me before doing anything
destructive. Let me know when each step is complete.

---

## STEP 1 — Prerequisites check

Check if the following are installed. If any are missing, tell me and give
me the install link. Do NOT proceed until all three are present.

- `node` (v18 or higher) → nodejs.org
- `git` → git-scm.com
- `gh` (GitHub CLI) → cli.github.com

Also check if the user is logged into GitHub CLI by running:
  gh auth status

If not logged in, run:
  gh auth login
...and guide the user through the browser login flow.

---

## STEP 2 — Set up the project

All the source files are already in this folder. Run the following:

  npm install

Verify it completes without errors.

---

## STEP 3 — Test the build locally

Run:
  npm run build

This should create a `dist/` folder. If there are any errors, fix them.
The most likely issue is a missing dependency — just install it.

Optionally run:
  npm run preview

...so I can see the app in my browser at localhost before deploying.

---

## STEP 4 — Create the GitHub repository

Run:
  gh repo create gym-tracker --public --source=. --remote=origin --push

This creates a public repo called `gym-tracker`, links this folder to it,
and pushes all the code in one command.

If the repo name is taken, try `gym-tracker-app` and also update
`vite.config.js` base path to match:
  base: '/gym-tracker-app/'

---

## STEP 5 — Enable GitHub Pages

Run:
  gh api repos/{owner}/gym-tracker/pages \
    --method POST \
    -f build_type=workflow \
    -f source.branch=main

Replace `{owner}` with the actual GitHub username (get it from `gh api user --jq .login`).

Then check the Actions tab is running:
  gh run list --repo {owner}/gym-tracker

Wait for the first deployment to complete (usually 1-2 minutes):
  gh run watch --repo {owner}/gym-tracker

---

## STEP 6 — Get the live URL

Run:
  gh api repos/{owner}/gym-tracker/pages --jq .html_url

This returns the live URL, e.g.: https://yourusername.github.io/gym-tracker/

Tell me this URL so I can bookmark it on my phone.

---

## STEP 7 — Google Sheets setup (I do this part, not you)

Tell me when GitHub Pages is live, then prompt me to follow these steps:

1. Go to sheets.google.com → create a new blank spreadsheet
   Name it: "Gym Tracker Logs"

2. Click Extensions → Apps Script

3. Delete all existing code in the editor

4. Open the file `google-apps-script.js` from this folder and paste
   the entire contents into the Apps Script editor

5. Click Save (floppy disk icon), name the project "Gym Tracker"

6. Click Deploy → New deployment
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   Click Deploy → Authorise → Allow

7. Copy the Web App URL (looks like: https://script.google.com/macros/s/ABC.../exec)

8. Open `src/App.jsx` and replace:
     PASTE_YOUR_APPS_SCRIPT_URL_HERE
   with the copied URL

9. Commit and push the change:
     git add src/App.jsx
     git commit -m "Add Google Sheets sync URL"
     git push

   GitHub Actions will automatically rebuild and redeploy (takes ~1 min).

---

## STEP 8 — Add to Android home screen

Once the live URL is confirmed working, tell me to:

1. Open the URL in Chrome on Android
2. Tap the ⋮ menu (three dots, top right)
3. Tap "Add to Home screen"
4. Name it "Gym" and tap Add

It will appear as an app icon on the home screen. Both Adam and Kelly
should do this on their own phones.

---

## File structure reference

```
gym-tracker-handoff/
├── src/
│   ├── App.jsx          ← Main React app (all workout logic + UI)
│   └── main.jsx         ← React entry point
├── public/
│   └── manifest.json    ← PWA config (makes it installable on Android)
├── .github/
│   └── workflows/
│       └── deploy.yml   ← Auto-deploys to GitHub Pages on every git push
├── index.html           ← HTML entry point
├── package.json         ← Project dependencies
├── vite.config.js       ← Build config (set base path = repo name)
├── google-apps-script.js ← Paste this into Google Sheets Apps Script
└── INSTRUCTIONS.md      ← This file
```

---

## How the app works (for context)

- **Data storage**: Uses browser `localStorage` on the device, so data persists
  between visits without needing a login
- **Google Sheets sync**: Every time a "Save" is clicked, it also POSTs to the
  Apps Script URL which appends a row to the spreadsheet
- **Offline**: Works without internet — the localStorage save always happens
  first, Sheets sync is a background bonus
- **Both phones**: Adam and Kelly each use the toggle in the app to switch
  between their profiles. localStorage is per-device, so their numbers don't
  interfere with each other
- **Future updates**: Any changes to the program (exercises, sets, reps) just
  require editing `src/App.jsx` and pushing — GitHub Actions rebuilds automatically

---

## Troubleshooting

**Build fails**: Run `npm install` again, then `npm run build`

**GitHub Pages shows 404**: Check that `vite.config.js` base matches the repo name exactly

**Sheets not receiving data**: 
  - Check the Apps Script URL is pasted correctly in App.jsx (no trailing spaces)
  - Re-deploy the Apps Script (Deploy → Manage deployments → edit → new version)
  - Check the browser console for CORS errors

**App not updating after a push**: Wait 2 minutes, then hard-refresh (Ctrl+Shift+R)
