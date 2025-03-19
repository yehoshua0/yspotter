# YSpotter | React + Vite


## Project structure at High Level
src/

│── assets/              # Static assets like images, icons, fonts

│── components/          # Reusable UI components (buttons, cards, tables, etc.)

│── context/             # Context providers for global state management

│── hooks/               # Custom React hooks

│── layouts/             # Dashboard layouts & wrappers

│── services/            # API calls, data fetching, authentication services

│── store/               # Global state management (Redux, Zustand, etc.)

│── styles/              # Global styles, theme configurations

│── utils/               # Helper functions & utilities

│── views/               # Feature-specific components (Dashboard, Reports, etc.)

│── App.jsx              # Main app component (if using CRA/Vite)

│── main.jsx             # Entry point (ReactDOM.render in CRA/Vite)

│── routes.jsx           # Route definitions (React Router)

└── index.tsx            # Application bootstrap file


## About technologies

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
