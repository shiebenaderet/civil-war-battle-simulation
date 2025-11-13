# Firebase Setup Guide for Civil War Battle Simulation

This guide will help you set up Firebase Authentication and Firestore to enable Google Sign-In and cloud save functionality for your students.

## Prerequisites

- A Google account (preferably your school's Google Workspace admin account)
- 10-15 minutes of setup time

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter a project name (e.g., "Civil War Simulation")
4. (Optional) Enable Google Analytics if you want usage stats
5. Click **"Create project"**

## Step 2: Enable Google Authentication

1. In the Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"** in the providers list
5. Toggle the **"Enable"** switch to ON
6. Set a support email (use your school email)
7. Click **"Save"**

### Important for School Accounts

If you're using Google Workspace for Education:
- You may want to configure **"Authorized domains"** to only allow your school domain
- Go to **Authentication > Settings > Authorized domains**
- Add your school's domain (e.g., `yourschool.edu`)

## Step 3: Enable Firestore Database

1. In the Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set up rules next)
4. Select a Firestore location closest to your school (e.g., `us-central1` for US)
5. Click **"Enable"**

## Step 4: Configure Firestore Security Rules

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the default rules with these (allows students to only access their own saves):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only read/write their own save data
    match /studentSaves/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Optional: Allow teachers to read all student data (requires custom claims)
    // match /studentSaves/{userId} {
    //   allow read: if request.auth != null &&
    //     (request.auth.uid == userId ||
    //      request.auth.token.teacher == true);
    //   allow write: if request.auth != null && request.auth.uid == userId;
    // }
  }
}
```

3. Click **"Publish"**

## Step 5: Get Your Firebase Configuration

1. In the Firebase Console, click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **web icon** (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Civil War Simulation Web")
6. **Do NOT check** "Also set up Firebase Hosting" (unless you want to deploy there)
7. Click **"Register app"**
8. Copy the `firebaseConfig` object that appears

## Step 6: Add Firebase Config to Your Game

1. Open `index.html` in a text editor
2. Find this section near the top of the `<script>` tag (around line 4456):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

3. Replace it with YOUR Firebase config from Step 5:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "civil-war-sim-12345.firebaseapp.com",
    projectId: "civil-war-sim-12345",
    storageBucket: "civil-war-sim-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

4. Save the file

## Step 7: Configure Authorized Domains

For the game to work when deployed:

1. In Firebase Console, go to **Authentication > Settings**
2. Scroll to **"Authorized domains"**
3. Add your deployment domain (e.g., `yourschool.github.io` or your custom domain)
4. Click **"Add domain"**

## Step 8: Test the Sign-In

1. Open `index.html` in a web browser
2. You should see the Google Sign-In screen
3. Click **"Sign in with Google"**
4. Choose a Google account to test with
5. You should see the save slot selection screen

## Optional: Deploy to GitHub Pages

To make the game accessible to students:

1. Push your code to GitHub:
```bash
git add .
git commit -m "Add Firebase authentication and save system"
git push origin main
```

2. In your GitHub repository, go to **Settings > Pages**
3. Under "Source", select **"main"** branch
4. Click **"Save"**
5. Your game will be available at `https://[username].github.io/[repo-name]`

## Cost Considerations

Firebase has a generous **free tier** (Spark Plan):

### Free Tier Limits:
- **Authentication**: 10,000 monthly active users (plenty for a classroom!)
- **Firestore Database**:
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
- **Bandwidth**: 10 GB/month

### Typical Usage Estimate:
- Each student save: ~1-2 KB
- 30 students with 3 saves each: ~180 KB total
- Auto-save after each battle: ~10 writes per student campaign
- Loading saves: ~3 reads per session

**For a typical classroom (30-50 students), you'll stay well within the free tier!**

## Troubleshooting

### Students Can't Sign In
- Make sure Google sign-in is enabled in Firebase Console
- Check that your domain is listed in "Authorized domains"
- Verify students are using accounts from your approved domain (if restricted)

### Saves Not Working
- Check the browser console (F12) for error messages
- Verify Firestore rules are correctly set
- Make sure the Firebase config is correctly added to `index.html`

### "Firebase not configured" Message
- This is normal if you haven't added your Firebase config yet
- The game will work with localStorage only (saves on that computer only)
- Add Firebase config to enable cloud saves across devices

## Privacy & Data Protection

For compliance with FERPA and student privacy:

1. **Data Collected**:
   - Student Google email (authentication only)
   - Display name
   - Game progress (battles completed, scores, choices made)

2. **Data NOT Collected**:
   - No personally identifiable information beyond Google profile
   - No tracking cookies
   - No third-party analytics (unless you enable Google Analytics)

3. **Data Access**:
   - Students can only access their own saves
   - No data sharing between students
   - Export functionality lets students backup their own data

4. **Data Deletion**:
   - Students can delete their own save slots
   - Teachers can delete student data from Firebase Console if needed

## Support

If you encounter issues:
1. Check the browser console (F12) for error messages
2. Review Firebase Console for authentication/database errors
3. Verify all setup steps were completed
4. Create an issue in the GitHub repository

## Next Steps

Once Firebase is set up, you can:
- Test with a few students first
- Monitor usage in Firebase Console
- Set up teacher dashboard (Phase 5 - future enhancement)
- Add custom claims for teacher accounts (advanced)

---

**Questions?** Open an issue on GitHub or contact your Firebase support team.
