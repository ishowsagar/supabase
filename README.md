# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploying to Netlify

Quick steps to deploy this Vite app to Netlify:

1. Push your repo to GitHub (already done).
2. Go to https://app.netlify.com and click "New site from Git" → choose GitHub and select this repository.
3. For Build command use: `npm run build` and Publish directory: `dist`.
4. In Netlify site settings > Environment, add these environment variables:
   - `VITE_SUPABASE_URL` — your Supabase URL
   - `VITE_SUPABASE_KEY` — your Supabase anon/public key (do not use service_role key client-side)
5. Deploy. Netlify will run the build and publish the `dist` folder.

If you want, I added a `netlify.toml` in the repo with the correct build/publish settings.
