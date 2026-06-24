# 🛒 Ottawa Grocery Price Finder
Compare live grocery prices across 45+ real Ottawa stores — powered by AI web search.

---

## 📁 What's in this folder

```
ottawa-grocery-app/
├── api/
│   ├── search.js      ← The backend brain (calls Anthropic API securely)
│   └── health.js      ← Health check endpoint
├── public/
│   └── index.html     ← The website your customers see
├── package.json       ← Project config
├── vercel.json        ← Tells Vercel how to run everything
└── README.md          ← This file
```

---

## 🚀 HOW TO GO LIVE IN 6 STEPS (beginner-friendly)

### STEP 1 — Create a free GitHub account
1. Go to **https://github.com**
2. Click **"Sign up"**
3. Enter your email, create a password, pick a username
4. Verify your email

---

### STEP 2 — Upload this project to GitHub
1. Once logged in, click the **"+"** button (top right) → **"New repository"**
2. Name it: `ottawa-grocery-app`
3. Leave everything else as default
4. Click **"Create repository"**
5. You'll see a page with some commands — look for the section that says **"uploading an existing file"** and click it
6. Drag and drop ALL the files from this folder into the upload area
7. Click **"Commit changes"**

---

### STEP 3 — Create a free Vercel account
1. Go to **https://vercel.com**
2. Click **"Sign up"**
3. Click **"Continue with GitHub"** — this connects the two automatically ✓

---

### STEP 4 — Import your project into Vercel
1. You'll land on the Vercel dashboard
2. Click **"Add New Project"**
3. Find `ottawa-grocery-app` in the list and click **"Import"**
4. Leave all settings as default
5. **DO NOT click Deploy yet** — go to Step 5 first

---

### STEP 5 — Add your Anthropic API key (the most important step)
1. On the import page, scroll down to **"Environment Variables"**
2. Click **"Add"**
3. In the **Name** box type exactly: `ANTHROPIC_API_KEY`
4. In the **Value** box paste your API key (starts with `sk-ant-...`)
   - Get your key at: https://console.anthropic.com → API Keys → Create Key
5. Click **"Add"**
6. Now click **"Deploy"** ✓

---

### STEP 6 — Your app is live! 🎉
- Vercel will build and deploy in about 60 seconds
- You'll get a free URL like: `https://ottawa-grocery-app.vercel.app`
- Share that URL with anyone — it works immediately
- Every time you update files on GitHub, Vercel auto-deploys the new version

---

## ✅ How to verify it's working
After deploy, visit:
```
https://YOUR-APP-NAME.vercel.app/api/health
```
You should see:
```json
{
  "status": "ok",
  "apiKeyConfigured": true
}
```
If `apiKeyConfigured` shows `false`, go back to Vercel → Your Project → Settings → Environment Variables and add the key.

---

## 💰 Costs
- **Vercel**: Free forever for this type of app (Hobby plan)
- **GitHub**: Free forever
- **Anthropic API**: Each search costs ~$0.02–$0.05
  - Add $10 credit at console.anthropic.com → Billing
  - $10 = approximately 200–500 searches

---

## 🔑 How to make money from this app
Once you have visitors, apply to these affiliate programs:
- **Walmart Canada**: https://www.impactradius.com (search "Walmart Canada")
- **Loblaws / PC Optimum**: https://www.pcoptimum.ca/affiliates
- **Costco**: Via Commission Junction at https://www.cj.com
- **Google AdSense**: https://adsense.google.com (add one line of code, earn per visitor)

Replace the `buyUrl` links in `public/index.html` with your affiliate tracking links once approved.

---

## 🆘 Common problems

**"Failed to fetch" error on the website:**
→ Your backend isn't deployed yet, or the API key isn't set. Visit /api/health to check.

**"API key not configured" error:**
→ Go to Vercel → Your Project → Settings → Environment Variables → Add ANTHROPIC_API_KEY

**Search takes a long time:**
→ Normal! Live AI web search takes 10–20 seconds. This is real data being fetched.

**Want to add more stores?**
→ Edit the `STORES` array in `public/index.html` and add a new store object following the same format.

---

## 📞 Next steps (future features to add)
- [ ] User accounts (so shoppers can save their favourite stores)
- [ ] Price alerts (email when a product drops below a price)
- [ ] Shopping list (add multiple products, see total cost per store)
- [ ] Flyer integration (pull weekly flyer deals automatically)
- [ ] Mobile app (React Native version of the same app)
