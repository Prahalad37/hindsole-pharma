# Deployment Guide - Hindsole Pharma

## 1. Prerequisites
Ensure you have the Firebase CLI installed and are logged in.

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Enable Auth
# Login to Firebase
firebase login
```

## 1.1 Enable Authentication (CRITICAL)
1. Go to [Firebase Console](https://console.firebase.google.com/) > Authentication.
2. Enable **Email/Password**.
3. **Admin Access**: We have pre-authorized your UID (`N10HJz2hWabEhzckpHQW4AnOlJb2`) in the rules. You can also login with `admin@hindsole.com`.

## 2. Configuration
We have already created the `firebase.json` configuration for you.

However, we need to link your local project to your live Firebase project.
Since your Project ID is in your `.env` file, please run the following command, replacing `YOUR_PROJECT_ID` with the actual ID from your Firebase Console (or `.env` file).

```bash
# Link project
firebase use --add YOUR_PROJECT_ID
```

*(Select "default" as the alias if prompted)*

## 3. Deploy
Once linked, simply run:

```bash
npm run build
firebase deploy
```

This will deploy the `dist` folder to Firebase Hosting.
