# Welcome to your project

## Project info


## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will be committed to your repository.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## Monorepo apps

This repo now exposes separate Vite apps under the `apps/` directory so that each
section of the platform can be deployed to its own subdomain.

Run `npm install` in the repository root to install all workspace dependencies.

- `apps/admin` – dashboard served at `admin.yourdomain.com`
- `apps/bookings` – booking form served at `bookings.yourdomain.com`
- `apps/rentals` – rental form served at `rentals.yourdomain.com`
- `apps/main` – the main website
- `apps/links` – smart link pages served at `links.yourdomain.com`

Use the workspace scripts to run each app locally:

```bash
npm run dev:admin   # start admin app
npm run dev:bookings
npm run dev:rentals
npm run dev:main
npm run dev:links
```
