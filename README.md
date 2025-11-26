# SEQHER Digital Hub

This is a Next.js 14 website for SEQHER, an NGO aligned with the UN's Sustainable Development Goals (SDGs). The platform is built with Firebase (App Hosting, Firestore, Authentication) and Tailwind CSS.

## Core Features


## Tech Stack


## Getting Started

### Prerequisites


### 1. Clone the Repository

```bash
git clone <repository-url>
cd seqher-digital-hub
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables. Obtain the Firebase configuration from your Firebase project settings.

```
# Firebase Configuration
# Get these from your Firebase project settings > General
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe Configuration
# Get these from your Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# App URL
# The base URL of your deployed app (e.g., for Stripe redirects)
# For local development, this is typically http://localhost:9002
NEXT_PUBLIC_APP_URL=http://localhost:9002
```

### 4. Set Up Firebase Emulators (Optional but Recommended)

Using Firebase Emulators for local development is highly recommended to avoid interfering with production data.

1.  **Initialize Emulators**:
    If you haven't already, run this command in your project root:
    ```bash
    firebase init emulators
    ```
    Select Authentication, Firestore, and Functions emulators. Use the default ports.

2.  **Start Emulators**:
    ```bash
    firebase emulators:start
    ```
    This will start the emulators and provide a UI for viewing data, typically at `http://localhost:4000`.

### 5. Seed Sample Data

To populate your local Firestore emulator with sample data (users, programs, blog posts), you can sign up a new user via the application's UI. The first user to sign up will automatically be granted admin privileges. You can then use the admin interface to add blog posts. Programs are currently mocked in the code but can be migrated to Firestore.

To create an initial admin user:
1. Start the app and emulators.
2. Navigate to `/login` and create a new account.
3. This first account will have the `role` field set to `admin` in your local Firestore emulator.

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Deployment

This project is configured for deployment to Firebase App Hosting. The CI/CD pipeline is managed via GitHub Actions, which will automatically deploy the `main` branch.

To deploy manually:

```bash
firebase deploy --only hosting
```

## Security Checklist (recommended)


### If a secret was accidentally committed (what to do)

If you discover a sensitive file (API keys, service account JSON, `.env` with secrets, private keys) has been committed to this repository, follow these steps immediately:

1. Rotate the exposed secrets right away with the provider (Stripe, Firebase, cloud provider, etc.). Do not rely on removing the file from git alone — rotate the keys.

2. Remove the file from the repository and stop tracking it (example):

```bash
# Stop tracking the file and remove it from the next commit
git rm --cached <sensitive-file>
git commit -m "chore: remove sensitive file from repository"
git push origin main
```

3. Add the filename (or a pattern) to `.gitignore` so it's not accidentally recommitted. Example:

```gitignore
# Ignore local env files and service account JSON
.env*
service-account*.json
```

4. Purge the file from git history (optional but recommended) using a tool like BFG Repo-Cleaner or `git filter-repo`. History rewrite requires force-pushing and coordination with collaborators. If you want help, I can prepare the exact commands.

5. After history rewrite, inform collaborators to re-clone the repository. Also rotate any secrets that may have been exposed.

If you want me to remove a specific sensitive file from the repo (git rm --cached, update .gitignore, and commit), tell me the exact path and I'll do that change for you. I will not rewrite git history without explicit confirmation.


