# Setting Up Your Nikkei Dashboard — Complete Beginner Guide

This guide assumes you've never done anything like this before. Every step
is spelled out. Take it slowly — there's no rush, and nothing here can be
done "wrong" in a way that breaks anything permanently.

## What you're actually doing, in plain English

You have a zip file full of code sitting on your phone right now. That code
needs to live on two free websites before it becomes a real, working
dashboard:

1. **GitHub** — think of this as a storage cabinet for the code
2. **Vercel** — this reads the code from the cabinet and turns it into an
   actual website with its own web address, like a normal site you'd visit

You will do this entirely by tapping buttons on websites. No typing of code,
no apps to install.

---

## Before you start: find the zip file on your phone

1. Open the **Files** app on your iPhone (blue folder icon — it comes
   built into every iPhone, you don't need to download it)
2. Tap **Browse** at the bottom, then tap **Downloads**
3. You should see a file called something like `nikkei-dashboard-app.zip`
4. Leave it there for now — you'll need it again in Step 3

---

## Step 1 — Create a free Anthropic account for API access

This is different from your normal Claude app login. Think of it as a
separate "service account" that lets a website talk to Claude.

1. Open Safari and go to **console.anthropic.com**
2. Sign in or create an account (you can use the same email as your normal
   Claude account)
3. Once logged in, look for **API Keys** in the menu (usually on the left
   or under a settings icon)
4. Tap **Create Key**. It'll ask for a name — type anything, e.g. `nikkei`
5. It will show you a long code starting with `sk-ant-`. Tap to copy it
6. **Important**: paste this somewhere safe for now — like a new Notes app
   note titled "Nikkei dashboard keys". You can't view this exact key again
   once you navigate away
7. Look for **Billing** in the same menu and add a small amount of credit —
   $10 is more than enough for a month of daily use

---

## Step 2 — Create a free GitHub account

1. Open Safari and go to **github.com**
2. Tap **Sign up**, follow the steps (email, password, username)
3. Once you're logged in and see your GitHub homepage, look for a **+**
   icon near the top of the screen
4. Tap it, then tap **New repository**
5. Where it says "Repository name", type: `nikkei-dashboard`
6. Leave everything else as it is
7. Scroll down and tap the green **Create repository** button

You now have an empty storage cabinet, ready for the code.

---

## Step 3 — Upload the code into GitHub

1. On the page that just appeared, look for a link that says
   **uploading an existing file** (it's small, in the middle of the page)
2. Tap it
3. Tap **choose your files**
4. This opens your Files app — navigate to **Downloads** and tap on
   `nikkei-dashboard-app.zip`
5. GitHub will automatically unzip it and show you the files inside —
   you'll see things like `app`, `package.json`, `SETUP.md` etc.
6. Scroll to the bottom of the page
7. Tap the green **Commit changes** button

The code is now safely stored on GitHub.

---

## Step 4 — Turn the code into a real website using Vercel

1. Open Safari and go to **vercel.com**
2. Tap **Sign Up**
3. Choose **Continue with GitHub** — this links the two accounts together
   automatically, so you won't need to copy anything across manually
4. Once logged in, tap **Add New**, then **Project**
5. You should see `nikkei-dashboard` in a list — tap **Import** next to it
6. Before tapping the final Deploy button, look for a section called
   **Environment Variables** — this is where your secret keys go so the
   website can use them
7. You need to add two entries here. For each one, there's a "Name" box and
   a "Value" box:

   **First entry:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: *paste the `sk-ant-...` key you saved in Step 1*

   **Second entry:**
   - Name: `TWELVE_DATA_KEY`
   - Value: *paste your Twelve Data key*

8. Once both are added, tap the **Deploy** button
9. Wait about 1-2 minutes — you'll see a progress screen, then a
   celebration screen when it's done

---

## Step 5 — Find your website's address

1. After deployment finishes, Vercel will show you a link like
   `nikkei-dashboard-yourname.vercel.app`
2. Tap it — this opens your actual, live dashboard
3. **Bookmark this page**, or better, add it to your home screen:
   - Tap the **Share** icon at the bottom of Safari
   - Scroll down and tap **Add to Home Screen**
   - Now it sits on your phone like a normal app icon

---

## Using it from now on

Every evening, tap the icon, then tap **Analyse**. It'll show you the
Nikkei chart, the verdict, and relevant news/events.

The next morning, scroll down to **History**, find last night's entry, and
log what actually happened — that's how you build up a month of data to
review.

---

## If anything goes wrong

Don't worry, nothing here can be broken permanently. Just take a screenshot
of whatever error or odd thing you see, and come back here — describe
exactly what step you were on and what the screen showed, and I'll walk
you through fixing it.
