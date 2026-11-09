# Owen Omene — AI Website Masterclass Funnel

## Routes
- `/` — general homepage, reserved for future use
- `/register/` — free-training lead capture page
- `/training/` — separate training page (not used as the post-registration destination)
- `/sales/` — sales page containing the video; successful registrations redirect here

## Brevo lead capture
The registration form sends the first name and email to `/api/subscribe`. The Vercel serverless function in `api/subscribe.js` sends the contact to Brevo using a server-side API key. The API key must never be placed in `app.js`, `config.js`, or any other public file.

In Vercel → Project → Settings → Environment Variables, add:
- `BREVO_API_KEY` — your Brevo API key (keep it private).
- `BREVO_LIST_ID` — optional numeric ID of the Brevo contact list for these leads. If omitted, the contact is created/updated in Brevo without being assigned to a specific list.

Apply the variables to Production (and Preview if you want preview deployments to accept registrations), save, then redeploy.

## Deployment
Deploy the contents of this folder to the existing Vercel project. Keep `api/`, `assets/`, the page folders, and the shared files at the repository root.

## Other launch settings
The payment URL and training video may still be placeholders in the original project. Set those before launch.
