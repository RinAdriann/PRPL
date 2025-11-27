import app from "../src/app.js";

export default (req, res) => {
  try {
    app(req, res);
  } catch (e) {
    console.error("Unhandled error:", e);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};