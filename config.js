/*
  Frontend-safe configuration.
  Supabase URL + anon/publishable key are intended for browser use.
  NEVER put a Supabase service_role/secret key in this file.
*/
window.APP_CONFIG = {
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY",
  META_PIXEL_ID: "", // Optional. Add your real Meta Pixel ID; do not use a placeholder ID.
  PAYMENT_URL: "YOUR_PAYSTACK_OR_FLUTTERWAVE_PAYMENT_LINK" // Paste your ₦5,000 checkout/payment link here before launch.
};
