# All About Joshua - Interactive Quiz Website

A fun, interactive quiz website where visitors answer questions about Joshua and see funny GIFs based on their answers. Includes a leaderboard and admin dashboard.

## Files

- `index.html` - Main quiz page
- `admin.html` - Joshua's private admin dashboard (view all answers)
- `style.css` - Styles
- `app.js` - Main app logic
- `config.js` - JSONBin configuration (for cloud-synced leaderboard)

## Features

- 5 full-page questions about Joshua
- Random GIFs from Giphy for correct/wrong answers
- Scoring system (Question 3 about looks is worth 50 points!)
- Public leaderboard
- Private admin dashboard to see each person's answers
- Works without setup (uses localStorage) or with JSONBin for cloud sync

## How to Host on GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `joshua-quiz` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. Do NOT initialize with README
5. Click "Create repository"

### Step 2: Upload Your Files

1. In your GitHub repository, click **"uploading an existing file"**
2. Drag and drop all files: `index.html`, `admin.html`, `style.css`, `app.js`, `config.js`
3. Click **Commit changes**

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select `main` branch
5. Click **Save**
6. Wait 1-2 minutes, then your site will be live at:
   `https://YOUR_USERNAME.github.io/joshua-quiz/`

**Admin Dashboard:** `https://YOUR_USERNAME.github.io/joshua-quiz/admin.html`

## Setting Up Cloud-Synced Leaderboard (JSONBin.io)

By default, the site works without any setup (data saved locally). To sync scores across all devices:

### Step 1: Create a JSONBin Account

1. Go to https://jsonbin.io
2. Sign up for a free account

### Step 2: Create a Bin

1. After logging in, click **"+ Create Bin"**
2. Paste this as the content:
   ```json
   {"scores":[]}
   ```
3. Click **Create**
4. Copy the **Bin ID** from the URL (looks like: `6xxxxxxxxxxxxxxxxxxxxx`)

### Step 3: Get Your API Key

1. Go to **Account** > **API Keys** (or top-right menu)
2. Copy your **X-Master-Key**

### Step 4: Update config.js

Open `config.js` and replace:

```javascript
const JSONBIN_CONFIG = {
    BIN_ID: 'YOUR_BIN_ID',
    API_KEY: 'YOUR_API_KEY'
};
```

With your actual values:

```javascript
const JSONBIN_CONFIG = {
    BIN_ID: 'your-actual-bin-id-here',
    API_KEY: 'your-actual-api-key-here'
};
```

### Step 5: Re-upload config.js to GitHub

1. Go back to your GitHub repository
2. Upload the updated `config.js` file
3. Commit the changes
4. Wait ~1 minute for GitHub Pages to update

That's it! Now all scores will sync to the cloud and everyone will see the same leaderboard.

## Admin Dashboard

To see what each person answered:

1. Go to `https://YOUR_USERNAME.github.io/joshua-quiz/admin.html`
2. Enter the admin code: `joshua2026`
3. View all answers, scores, and export to CSV

**To change the admin code:** Open `admin.html` and find:
```javascript
const ADMIN_CODE = 'joshua2026';
```
Change it to any code you want.

## Questions & Answers

| # | Question | Correct Answer | Points |
|---|----------|----------------|--------|
| 1 | Is Joshua a great guy? | Yes | 10 |
| 2 | Does Joshua admire CDPC Puchong or CDPC Subang? | CDPC Puchong | 10 |
| 3 | Is Joshua a good looking guy? | Yes | 50 |
| 4 | Will Joshua be able to speak in tongues this year? | Yes | 10 |
| 5 | Is Joshua a prophet or a healer? | Healer | 10 |

**Maximum possible score: 100 points**
