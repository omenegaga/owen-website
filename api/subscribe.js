// Vercel serverless function: securely adds a registration to Brevo.
// Configure BREVO_API_KEY in Vercel. BREVO_LIST_ID is optional.
module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed." });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("BREVO_API_KEY is not configured.");
    return res.status(500).json({ ok: false, message: "Registration is temporarily unavailable." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body && typeof body === "object" ? body : {};

  const firstName = String(body.first_name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!firstName || !validEmail) {
    return res.status(400).json({ ok: false, message: "Please provide a valid name and email address." });
  }

  const contact = {
    email,
    attributes: { FIRSTNAME: firstName },
    updateEnabled: true
  };
  const listId = Number.parseInt(process.env.BREVO_LIST_ID || "", 10);
  if (Number.isInteger(listId) && listId > 0) contact.listIds = [listId];

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(contact)
    });

    if (!brevoResponse.ok) {
      const detail = await brevoResponse.text();
      console.error("Brevo contact creation failed:", brevoResponse.status, detail.slice(0, 500));
      return res.status(502).json({ ok: false, message: "We couldn't save your details. Please try again." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Brevo request failed:", error);
    return res.status(502).json({ ok: false, message: "We couldn't connect to the registration service. Please try again." });
  }
};
