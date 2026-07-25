# Wealth Builder — Web (Wealth-BuildeR Web)

Discover legitimate ways to earn money online through affiliate marketing, freelancing, digital products, and financial education. This repository contains a responsive React + TypeScript frontend (Vite) for the Wealth Builder platform — a demo-ready web app with a localStorage-backed mock data layer that simulates authentication, users, marketplace, affiliate flows, seller accounts, admin operations, campaigns, and more.

Preview: index.html -> mounts React app at /src/main.tsx

---

## Features

- Authentication & simulated account verification flow
- Dashboard with announcements, tickets, withdrawals and wallet balances
- Discover / Article saving functionality
- Toolbox & Quizzes (learning features)
- Multi-vendor Marketplace and Seller Hub (create/list products)
- Affiliate referral flows and manual referral claims
- Ad campaign creation & simulated analytics
- Admin panel (approve/reject users, process withdrawals, manage campaigns)
- LocalStorage-based mock backend seeded with example users, products, and admin settings
- Responsive UI with TailwindCSS and Lucide icons
- Charts via Recharts and visual effects via canvas-confetti

Key views (src/views): Auth, Verification, Dashboard, Discover, Toolbox, Quizzes, Marketplace, SellerHub, AiAssistant, AdminPanel

The app state and mock backend lives in `src/state/Store.ts` (useAppStore) with seeded data and helper utilities to persist to localStorage.

---

## Tech stack

- React 18 + TypeScript
- Vite (dev server / build)
- Tailwind CSS + PostCSS
- lucide-react (icons)
- recharts (charts)
- canvas-confetti (visual micro-interactions)
- LocalStorage-based state seeds (no production backend required)
- (Optional) Can be extended to use Firebase Auth / Firestore or your own API

---

## Quick start

Prerequisites: Node.js (Recommended 18+), npm or yarn

1. Clone the repo
   - git clone https://github.com/wealthbuildars-ui/Wealth-Buildar.git
   - cd Wealth-Buildar

2. Install dependencies
   - npm install
   - or
   - yarn

3. Environment
   - Copy and customise environment variables if needed:
     - cp .env.example .env
   - (By default the app uses localStorage seeded data. Connect a real backend only if you implement it and update environment/config.)

4. Run the dev server (hosted to 0.0.0.0:3000 by default)
   - npm run dev
   - This runs: `vite --host 0.0.0.0 --port 3000` (see package.json)

5. Build for production
   - npm run build
   - (Build runs TypeScript compile + Vite build)

6. Preview a production build
   - npm run preview

---

## Scripts (from package.json)

- dev: start Vite dev server (host 0.0.0.0, port 3000)
- build: runs TypeScript compile then `vite build`
- preview: `vite preview`
- lint: placeholder script (echo 'No lint errors')

---

## Project structure (important files & directories)

- index.html — app entry HTML
- src/
  - main.tsx — app bootstrap
  - App.tsx — main layout, navigation, and tabbed views
  - state/Store.ts — app state, seeded demo data, and action methods (login, signup, purchase, withdraw, admin ops, etc.)
  - views/ — UI screens (Auth, Dashboard, Discover, Marketplace, AdminPanel, etc.)
  - components/ — shared components (if present)
  - index.css — Tailwind styles
- assets/ — images and static assets
- package.json — dependencies and scripts
- vite.config.ts — Vite configuration
- tailwind.config.js / postcss.config.js — Tailwind setup
- .env.example — environment variable example (copy to `.env` when needed)
- metadata.json — repository/app metadata

---

## Running the demo (tips)

- The app comes with seeded demo users (including an `Administrator` account).
  - Administrator email present in seeds: `wealthbuilder@gmail.com` (used for demo admin access).
- The app stores all changes in localStorage, so you can freely try admin operations, create products, submit withdrawals, etc. To reset seeded data, clear site localStorage in your browser.
- Many admin flows (approvals, payouts, referral credits) are simulated to demonstrate frontend behavior.

---

## Extending to a real backend

The current implementation uses localStorage and seeded data to simulate backend behavior. To use a real backend (e.g., Firebase Auth + Firestore or any REST API):

- Replace mock methods in `src/state/Store.ts` with real API calls.
- Move secrets and keys into environment variables and update `.env` and `.env.example`.
- Ensure CORS and auth flows are configured on the backend and that the frontend communicates securely.

---

## Contributing

Contributions are welcome:

- Open an issue describing the feature or bug first.
- Create a branch off main, implement changes, and open a pull request with a clear description of the change.
- Keep UI/UX consistent with Tailwind utility conventions used in the project.

---

## Known limitations

- No server-side persistence by default — localStorage is used for demo and prototyping purposes.
- No automated tests included (add your preferred testing framework as needed).
- Lint script is a placeholder.

---

## License

No license file included. If you intend to share or open-source this project, add a LICENSE file (MIT/Apache-2.0/etc.) and update this section.

---

## Contact / Maintainers

For questions about the demo seed data or admin flows, the seeded admin account used for demo is:
- Email: wealthbuilder@gmail.com

(If you are the repository owner, update contact/maintainer details and license in this README.)

---

Thank you for checking out Wealth Builder — build, learn, and scale your online income ideas!
