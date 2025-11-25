import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;  
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;  
const SHOPIFY_API_VERSION = "2025-01";

app.get("/", (req, res) => {
  res.send("Your Shopify server is alive.");
});
app.post('/create-draft-order', (req, res) => {
  console.log("✅ HIT /create-draft-order");
  console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

  ...
});

app.post("/create-draft-order", async (req, res) => {
  console.log("Incoming body:", JSON.stringify(req.body, null, 2));

  try {
    const { order } = req.body;

    if (!order) {
      return res.status(400).json({
        success: false,
        error: "missing_order",
        message: "Body must contain an 'order' field"
      });
    }

    // At this point, order should already be an object like:
    // {
    //   customer_name: "...",
    //   phone_number: "...",
    //   fulfillment_type: "pickup" or "delivery",
    //   address: "...",
    //   order_details: "..."
    // }

    console.log("Parsed order:", order);

    return res.json({
      success: true,
      received: order
    });
  } catch (err) {
    console.error("Error handling order:", err);
    return res.status(500).json({
      success: false,
      error: "server_error",
      message: err.message
    });
  }
});

app.listen(3000, () => console.log("Local server running"));

