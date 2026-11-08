(() => {
  const config = window.APP_CONFIG || {};
  const form = document.getElementById("lead-form");
  const firstNameInput = document.getElementById("first-name");
  const emailInput = document.getElementById("email");
  const submitButton = document.getElementById("submit-button");
  const buttonText = submitButton.querySelector(".button-text");
  const message = document.getElementById("form-message");

  const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid"];
  const STORAGE_KEY = "ai_website_training_attribution";

  function collectAttribution() {
    const current = new URLSearchParams(window.location.search);
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}
    for (const key of ATTRIBUTION_KEYS) {
      const value = current.get(key);
      if (value) saved[key] = value;
    }
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (_) {}
    return saved;
  }

  const attribution = collectAttribution();

  function setMessage(text, type) {
    message.textContent = text;
    message.className = "form-message" + (type ? " " + type : "");
  }
  function setLoading(loading) {
    submitButton.disabled = loading;
    buttonText.textContent = loading ? "SAVING YOUR DETAILS..." : "UNLOCK THE FREE TRAINING";
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function initializeMetaPixel() {
    const pixelId = (config.META_PIXEL_ID || "").trim();
    if (!pixelId || pixelId === "YOUR_META_PIXEL_ID" || window.fbq) return;
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }
  initializeMetaPixel();

  function buildWatchUrl() {
    const target = new URL("/training/", window.location.origin);
    for (const key of ATTRIBUTION_KEYS) {
      if (attribution[key]) target.searchParams.set(key, attribution[key]);
    }
    return target.pathname + target.search;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("", "");

    const first_name = firstNameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    firstNameInput.setAttribute("aria-invalid", String(!first_name));
    emailInput.setAttribute("aria-invalid", String(!validEmail(email)));

    if (!first_name) {
      setMessage("Please enter your first name.", "error");
      firstNameInput.focus();
      return;
    }
    if (!validEmail(email)) {
      setMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }
    if (!window.supabase || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY ||
        config.SUPABASE_URL.includes("YOUR_") || config.SUPABASE_ANON_KEY.includes("YOUR_")) {
      setMessage("Registration is not connected yet. Please try again later.", "error");
      return;
    }

    setLoading(true);
    try {
      const client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
      const lead = {
        first_name,
        email,
        landing_page_url: window.location.href,
        referrer: document.referrer || null,
        utm_source: attribution.utm_source || null,
        utm_medium: attribution.utm_medium || null,
        utm_campaign: attribution.utm_campaign || null,
        utm_term: attribution.utm_term || null,
        utm_content: attribution.utm_content || null,
        fbclid: attribution.fbclid || null
      };

      const { error } = await client.from("leads").insert([lead]);
      if (error) throw error;

      // Fire the Lead event only after Supabase confirms the insert.
      if (typeof window.fbq === "function") window.fbq("track", "Lead");
      window.location.assign(buildWatchUrl());
    } catch (error) {
      console.error("Lead submission failed:", error);
      setMessage("We couldn't submit your details. Please check your connection and try again.", "error");
      setLoading(false);
    }
  });
})();
