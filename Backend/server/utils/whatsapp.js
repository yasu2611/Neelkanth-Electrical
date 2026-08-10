import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;
import qrcode from "qrcode-terminal";
import path from "path";
import { INVOICES_DIR } from "./generateInvoice.js";

// Initialize WhatsApp client with local session persistence
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("📲 Scan this QR code in WhatsApp to link your bot:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ WhatsApp Bot is ready and connected!");
});

client.initialize();

/**
 * Sends order details and the PDF invoice directly to the admin WhatsApp number.
 */
export async function sendInvoiceToWhatsApp(phoneNumber, order, user) {
  try {
    const formattedNumber = `${phoneNumber.replace("+", "")}@c.us`;
    const filePath = path.join(INVOICES_DIR, order.invoiceFile);

    // 1. Prepare PDF Media
    const media = MessageMedia.fromFilePath(filePath);

    // 2. Prepare message summary text
    // const message =
    //   `🛍️ *New Order Received - Neelkanth*\n\n` +
    //   `*Order ID:* ${order._id}\n` +
    //   `*Customer Name:* ${user.fullName || user.username}\n` +
    //   `*Phone:* ${user.phone}\n` +
    //   `*Email:* ${user.email}\n` +
    //   `*Grand Total:* ₹${order.grandTotal.toLocaleString("en-IN")}\n\n` +
    //   `📄 *Invoice PDF is attached below.*`;

    // 3. Send text message & PDF file
    // await client.sendMessage(formattedNumber, message);
    await client.sendMessage(formattedNumber, media, {
      caption: `Invoice-${order._id}.pdf`,
    });

    console.log(`✅ WhatsApp invoice sent successfully to ${phoneNumber}`);
  } catch (error) {
    console.error("❌ Failed to send WhatsApp invoice:", error.message);
  }
}