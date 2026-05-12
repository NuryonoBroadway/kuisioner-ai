module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, reason: "method-not-allowed" });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return res.status(503).json({ ok: false, reason: "not-configured" });
  }

  try {
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const payload = new URLSearchParams(body);
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: payload.toString()
    });

    if (!upstream.ok) {
      return res.status(502).json({ ok: false, reason: "sync-failed" });
    }

    return res.status(200).json({ ok: true, synced: true });
  } catch (error) {
    return res.status(502).json({ ok: false, reason: "network-error" });
  }
};
