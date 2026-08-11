// import pkg from "whatsapp-web.js";
// const { Client, LocalAuth, MessageMedia } = pkg;
// import qrcode from "qrcode-terminal";
// import path from "path";
// import { INVOICES_DIR } from "./generateInvoice.js";

// // Initialize WhatsApp client with local session persistence
// // const client = new Client({
// //   authStrategy: new LocalAuth(),
// //   puppeteer: {
// //     args: ["--no-sandbox", "--disable-setuid-sandbox"],
// //   },
// // });
// const client = new Client({
//   authStrategy: new LocalAuth(),
//   puppeteer: {
//     headless: true,
//     executablePath: process.env.CHROME_BIN,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-gpu",
//     ],
//   },
// });

// client.on("qr", (qr) => {
//   console.log("📲 Scan this QR code in WhatsApp to link your bot:");
//   qrcode.generate(qr, { small: true });
// });

// client.on("ready", () => {
//   console.log("✅ WhatsApp Bot is ready and connected!");
// });

// client.initialize();

// /**
//  * Sends order details and the PDF invoice directly to the admin WhatsApp number.
//  */
// export async function sendInvoiceToWhatsApp(phoneNumber, order, user) {
//   try {
//     const formattedNumber = `${phoneNumber.replace("+", "")}@c.us`;
//     const filePath = path.join(INVOICES_DIR, order.invoiceFile);

//     // 1. Prepare PDF Media
//     const media = MessageMedia.fromFilePath(filePath);

//     // 2. Prepare message summary text
//     // const message =
//     //   `🛍️ *New Order Received - Neelkanth*\n\n` +
//     //   `*Order ID:* ${order._id}\n` +
//     //   `*Customer Name:* ${user.fullName || user.username}\n` +
//     //   `*Phone:* ${user.phone}\n` +
//     //   `*Email:* ${user.email}\n` +
//     //   `*Grand Total:* ₹${order.grandTotal.toLocaleString("en-IN")}\n\n` +
//     //   `📄 *Invoice PDF is attached below.*`;

//     // 3. Send text message & PDF file
//     // await client.sendMessage(formattedNumber, message);
//     await client.sendMessage(formattedNumber, media, {
//       caption: `Invoice-${order._id}.pdf`,
//     });

//     console.log(`✅ WhatsApp invoice sent successfully to ${phoneNumber}`);
//   } catch (error) {
//     console.error("❌ Failed to send WhatsApp invoice:", error.message);
//   }
// }

import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import path from "path";
import { INVOICES_DIR } from "./generateInvoice.js";

let client = null;
let initializing = false;
let readyPromise = null;

function createWhatsAppClient() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      executablePath: process.env.CHROME_BIN,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    },
  });

  client.on("qr", (qr) => {
    console.log("📲 Scan this QR code in WhatsApp:");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("✅ WhatsApp Bot is ready and connected!");
  });

  client.on("auth_failure", (message) => {
    console.error("❌ WhatsApp authentication failed:", message);
  });

  client.on("disconnected", (reason) => {
    console.log("⚠️ WhatsApp disconnected:", reason);
    client = null;
    initializing = false;
    readyPromise = null;
  });

  return client;
}

async function initializeWhatsApp() {
  if (readyPromise) {
    return readyPromise;
  }

  const whatsappClient = createWhatsAppClient();

  readyPromise = new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };

    const onAuthFailure = (message) => {
      cleanup();
      reject(new Error(`WhatsApp authentication failed: ${message}`));
    };

    const cleanup = () => {
      whatsappClient.removeListener("ready", onReady);
      whatsappClient.removeListener("auth_failure", onAuthFailure);
    };

    whatsappClient.once("ready", onReady);
    whatsappClient.once("auth_failure", onAuthFailure);

    if (!initializing) {
      initializing = true;

      whatsappClient
        .initialize()
        .catch((error) => {
          cleanup();
          readyPromise = null;
          initializing = false;
          reject(error);
        });
    }
  });

  return readyPromise;
}

/**
 * Sends the PDF invoice to the admin WhatsApp number.
 */
export async function sendInvoiceToWhatsApp(phoneNumber, order, user) {
  try {
    console.log("📱 Starting WhatsApp only because an invoice needs to be sent...");

    await initializeWhatsApp();

    const formattedNumber =
      `${phoneNumber.replace("+", "")}@c.us`;

    const filePath = path.join(
      INVOICES_DIR,
      order.invoiceFile
    );

    const media = MessageMedia.fromFilePath(filePath);

    await client.sendMessage(
      formattedNumber,
      media,
      {
        caption: `Invoice-${order._id}.pdf`,
      }
    );

    console.log(
      `✅ WhatsApp invoice sent successfully to ${phoneNumber}`
    );

  } catch (error) {
    console.error(
      "❌ Failed to send WhatsApp invoice:",
      error.message
    );
  }
}