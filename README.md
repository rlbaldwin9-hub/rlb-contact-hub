# RLB Contact Hub — Setup Instructions

## Files in this folder
- `index.html`  → Upload to GitHub repo `rlb-contact-hub`
- `Code.gs`     → Paste into a new Google Apps Script project
- `SETUP.md`    → This file

---

## STEP 1 — Create the Google Apps Script

1. Go to https://script.google.com
2. Click **New Project**
3. Name it: **RLB Contact Hub**
4. Delete all existing code in the editor
5. Open `Code.gs` from this folder, copy ALL the contents
6. Paste into the Apps Script editor
7. Click **Save** (Ctrl+S)

---

## STEP 2 — Create the Google Sheet

1. Go to https://sheets.google.com
2. Create a new blank spreadsheet
3. Name it: **RLB Contact Hub**
4. Leave it blank — the script creates the header row automatically on first run

---

## STEP 3 — Link the Script to the Sheet

1. In Google Sheets, go to **Extensions → Apps Script**
   *(This opens a new Apps Script project linked to this sheet)*
2. Delete the default code, paste in the contents of `Code.gs`
3. Save (Ctrl+S)
4. Name the project **RLB Contact Hub** at the top

---

## STEP 4 — Deploy the Web App

1. In the Apps Script editor, click **Deploy → New Deployment**
2. Click the gear ⚙️ next to "Select type" → choose **Web App**
3. Fill in:
   - Description: `RLB Contact Hub v1`
   - Execute as: **Me (ogrlbdesigns@gmail.com)**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** and follow the prompts
   *(Google will warn "unverified app" — click Advanced → Go to RLB Contact Hub)*
6. Copy the **Web App URL** — it looks like:
   `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`

---

## STEP 5 — Test Before Going Live

1. Back in the Apps Script editor, select the function `testSubmission` from the dropdown
2. Click **Run**
3. Check:
   - ✅ A test row appeared in the Google Sheet
   - ✅ An email arrived at ogrlbdesigns@gmail.com
4. If prompted, authorize Gmail permissions

---

## STEP 6 — Add the URL to index.html

1. Open `index.html` in Notepad
2. Find this line near the bottom of the file (in the `<script>` section):
   ```
   const SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with your Web App URL:
   ```
   const SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXXXXX/exec';
   ```
4. Save the file

---

## STEP 7 — Deploy to GitHub Pages

1. Go to https://github.com/rlbaldwin9-hub
2. Create a new repo named: `rlb-contact-hub`
   - Public ✅
   - Add a README ✅
3. Upload `index.html`
4. Go to Settings → Pages → Branch: main / Folder: root → Save
5. Wait 2 minutes → test at: `https://rlbaldwin9-hub.github.io/rlb-contact-hub/`

---

## STEP 8 — (Optional) Custom Domain

Follow `CLOUDFLARE-DNS-GUIDE.md` to set up a subdomain like:
`contact.rlbdesigns.com` or `help.rlbdesigns.com`

---

## Updating the Script Later

Any time you change `Code.gs`:
- Go to Deploy → **Manage Deployments**
- Click the pencil ✏️ edit icon
- Change version to **New version**
- Click **Deploy**
- The Web App URL stays the same — no need to update `index.html`
