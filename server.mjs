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

app.post("/create-draft-order", async (req, res) => {
  try {
    const order = req.body;

    const createResp = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/draft_orders.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ draft_order: order })
      }
    );

    const createData = await createResp.json();
    const draftId = createData.draft_order.id;

    await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}/draft_orders/${draftId}/send_invoice.json`,
      {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ draft_order_invoice: { to: order.customer.email } })
      }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

app.listen(3000, () => console.log("Local server running"));
