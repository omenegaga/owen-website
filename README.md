# Owen Omene — AI Website Masterclass Funnel

## Routes
- `/` — general homepage, reserved for future use
- `/register/` — existing free-training lead capture page
- `/training/` — free video training page
- `/sales/` — AI Website Masterclass sales page

The registration page redirects successful registrations to `/training/`. The training CTA links to `/sales/`.

## Deployment
Deploy the contents of this folder to the existing Vercel project. Keep the `assets/` folder and shared `styles.css`, `config.js`, and `app.js` at the project root.

## Important existing integrations
The supplied original project still uses Supabase placeholders for lead capture. This restructuring does not connect Brevo yet. The Supabase settings must be replaced with a secure Brevo server-side endpoint before the registration form can save leads. Keep the Brevo API key out of browser-side files.

The payment URL and training video are still configured as placeholders in the original project. Set those before launch.
