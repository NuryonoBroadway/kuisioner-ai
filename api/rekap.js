module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, message: "Method tidak diizinkan." });
  }

  const expectedKey = process.env.REKAP_ACCESS_KEY;
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const providedKey = req.query?.key || req.headers["x-access-key"];

  if (!scriptUrl) {
    return res.status(503).json({ ok: false, message: "Sinkronisasi server belum dikonfigurasi." });
  }

  if (!expectedKey) {
    return res.status(503).json({ ok: false, message: "Kunci akses rekap belum dikonfigurasi." });
  }

  if (!providedKey || providedKey !== expectedKey) {
    return res.status(401).json({ ok: false, message: "Kunci akses rekap tidak valid." });
  }

  try {
    const upstream = await fetch(`${scriptUrl}?action=responses`);
    if (!upstream.ok) {
      return res.status(502).json({ ok: false, message: "Gagal mengambil data dari Google Sheets." });
    }

    const contentType = upstream.headers.get("content-type") || "";
    const rawText = await upstream.text();

    if (!contentType.includes("application/json")) {
      const looksLikeHtml =
        rawText.trim().startsWith("<!DOCTYPE") || rawText.trim().startsWith("<html");
      return res.status(502).json({
        ok: false,
        message: looksLikeHtml
          ? "Apps Script mengembalikan HTML, bukan JSON. Periksa apakah Web App sudah di-deploy ulang, URL benar, dan akses deployment di-set ke Anyone."
          : "Apps Script tidak mengembalikan JSON yang valid."
      });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      return res.status(502).json({
        ok: false,
        message: "Respons Apps Script bukan JSON yang valid."
      });
    }

    return res.status(200).json({
      ok: true,
      responses: Array.isArray(data.responses) ? data.responses : []
    });
  } catch (error) {
    return res.status(502).json({ ok: false, message: "Terjadi gangguan saat memuat rekap." });
  }
};
