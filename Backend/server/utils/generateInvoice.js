// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const INVOICES_DIR = path.join(__dirname, "../invoices");

// if (!fs.existsSync(INVOICES_DIR)) {
//   fs.mkdirSync(INVOICES_DIR, { recursive: true });
// }

// export function generateInvoicePdf(order, user) {
//   const fileName = `invoice-${order._id}.pdf`;
//   const filePath = path.join(INVOICES_DIR, fileName);

//   const doc = new PDFDocument({ size: "A4", margin: 40 });
//   const writeStream = fs.createWriteStream(filePath);
//   doc.pipe(writeStream);

//   // ---------------- BRAND HEADER ----------------
//   // Store Logo / Brand Name (Blue text)
//   doc
//     .fillColor("#2563eb")
//     .fontSize(22)
//     .font("Helvetica-Bold")
//     .text("Neelkanth", 40, 35);

//   doc
//     .fontSize(8)
//     .font("Helvetica")
//     .fillColor("#64748b")
//     .text("123, Main Road, Jamnagar, Gujarat - 361001", 40, 62)
//     .text("Phone: +91 98765 43210  |  Email: neelkanth@gmail.com", 40, 73);

//   // Header Title Right
//   doc
//     .fontSize(16)
//     .font("Helvetica-Bold")
//     .fillColor("#1e293b")
//     .text("PURCHASE ORDER", 380, 42, { align: "right" });

//   doc
//     .fontSize(8)
//     .font("Helvetica")
//     .fillColor("#64748b")
//     .text(`Order ID: #ORD-${String(order._id).slice(-8).toUpperCase()}`, 380, 62, { align: "right" })
//     .text(
//       `Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase()}`,
//       380,
//       73,
//       { align: "right" }
//     );

//   // Top Divider Line
//   doc.moveTo(40, 95).lineTo(555, 95).strokeColor("#e2e8f0").lineWidth(1).stroke();

//   // ---------------- BILLED TO SECTION ----------------
//   const boxTop = 115;
//   doc
//     .fillColor("#1e293b")
//     .fontSize(9)
//     .font("Helvetica-Bold")
//     .text("BILLED TO:", 40, boxTop);

//   doc
//     .fontSize(8)
//     .font("Helvetica")
//     .fillColor("#334155")
//     .text(user?.fullName || user?.username || "Nothings", 40, boxTop + 14)
//     .text("456, Park Avenue, Jamnagar, Gujarat - 361001", 40, boxTop + 25)
//     .text(user?.email || "nothingss121@gmail.com", 40, boxTop + 36)
//     .text(user?.phone || "+91 76003 33394", 40, boxTop + 47);

//   // ---------------- TABLE HEADER ----------------
//   const tableTop = 200;

//   // Background Light Gray Bar
//   doc.rect(40, tableTop, 515, 26).fill("#f8fafc");

//   doc
//     .fillColor("#0f172a")
//     .font("Helvetica-Bold")
//     .fontSize(8)
//     .text("Item", 50, tableTop + 8, { width: 90, align: "left" })
//     .text("Qty", 140, tableTop + 8, { width: 40, align: "center" })
//     .text("Price", 180, tableTop + 8, { width: 65, align: "right" })
//     .text("Total", 245, tableTop + 8, { width: 70, align: "right" })
//     .text(`CGST (${order.cgstRate || 9}%)`, 320, tableTop + 8, { width: 65, align: "right" })
//     .text(`SGST (${order.sgstRate || 9}%)`, 390, tableTop + 8, { width: 65, align: "right" })
//     .text("Net Total", 460, tableTop + 8, { width: 85, align: "right" });

//   // ---------------- TABLE ROWS ----------------
//   let y = tableTop + 38;
//   const items = order.items || [];

//   items.forEach((item) => {
//     const qty = item.qty || 1;
//     const price = item.price || 0;
//     const lineTotal = price * qty;
//     const lineCgst = Number(((lineTotal * (order.cgstRate || 9)) / 100).toFixed(2));
//     const lineSgst = Number(((lineTotal * (order.sgstRate || 9)) / 100).toFixed(2));
//     const netTotal = lineTotal + lineCgst + lineSgst;

//     doc
//       .fillColor("#334155")
//       .font("Helvetica")
//       .fontSize(8)
//       .text(item.name || "Item", 50, y, { width: 90, align: "left" })
//       .text(String(qty), 140, y, { width: 40, align: "center" })
//       .text(`Rs. ${price.toLocaleString("en-IN")}`, 180, y, { width: 65, align: "right" })
//       .text(`Rs. ${lineTotal.toLocaleString("en-IN")}`, 245, y, { width: 70, align: "right" })
//       .text(`Rs. ${lineCgst.toLocaleString("en-IN")}`, 320, y, { width: 65, align: "right" })
//       .text(`Rs. ${lineSgst.toLocaleString("en-IN")}`, 390, y, { width: 65, align: "right" })
//       .text(`Rs. ${netTotal.toLocaleString("en-IN")}`, 460, y, { width: 85, align: "right" });

//     y += 28;
//   });

//   // Bottom Line Under Table
//   doc.moveTo(40, y).lineTo(555, y).strokeColor("#e2e8f0").lineWidth(1).stroke();
//   y += 20;

//   // ---------------- BILL SUMMARY ----------------
//   const labelX = 360;
//   const valueX = 460;
//   const valueWidth = 85;

//   doc.fontSize(8).font("Helvetica").fillColor("#475569");

//   // Subtotal
//   doc.text("Subtotal", labelX, y, { align: "right", width: 90 });
//   doc.text(`Rs. ${(order.subTotal || 0).toLocaleString("en-IN")}`, valueX, y, { align: "right", width: valueWidth });
//   y += 18;

//   // CGST
//   doc.text(`CGST (${order.cgstRate || 9}%)`, labelX, y, { align: "right", width: 90 });
//   doc.text(`Rs. ${(order.cgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, valueX, y, { align: "right", width: valueWidth });
//   y += 18;

//   // SGST
//   doc.text(`SGST (${order.sgstRate || 9}%)`, labelX, y, { align: "right", width: 90 });
//   doc.text(`Rs. ${(order.sgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, valueX, y, { align: "right", width: valueWidth });
//   y += 22;

//   // Grand Total Light Gray/Blue Highlight Bar
//   doc.rect(340, y - 6, 215, 26).fill("#f1f5f9");
//   doc
//     .fillColor("#2563eb")
//     .font("Helvetica-Bold")
//     .fontSize(10)
//     .text("Grand Total", labelX - 10, y + 2, { align: "right", width: 100 })
//     .text(`Rs. ${(order.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, valueX, y + 2, { align: "right", width: valueWidth });

//   // ---------------- FOOTER ----------------
//   const footerTop = 750;
//   doc
//     .fillColor("#94a3b8")
//     .fontSize(8)
//     .font("Helvetica-Oblique")
//     .text("Thank you for shopping with Neelkanth!", 40, footerTop, { align: "center" });

//   doc.end();
//   return fileName;
// }
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Export INVOICES_DIR so whatsapp.js can import it
export const INVOICES_DIR = path.join(__dirname, "../invoices");

if (!fs.existsSync(INVOICES_DIR)) {
  fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

export function generateInvoicePdf(order, user) {
  const fileName = `invoice-${order._id}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // ---------------- BRAND HEADER ----------------
  doc
    .fillColor("#2563eb")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("Neelkanth", 40, 35);

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#64748b")
    .text("123, Main Road, Jamnagar, Gujarat - 361001", 40, 62)
    .text("Phone: +91 98765 43210  |  Email: neelkanth@gmail.com", 40, 73);

  // Header Title Right
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#1e293b")
    .text("PURCHASE ORDER", 380, 42, { align: "right" });

  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#64748b")
    .text(`Order ID: #ORD-${String(order._id).slice(-8).toUpperCase()}`, 380, 62, { align: "right" })
    .text(
      `Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}, ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase()}`,
      380,
      73,
      { align: "right" }
    );

  // Top Divider Line
  doc.moveTo(40, 95).lineTo(555, 95).strokeColor("#e2e8f0").lineWidth(1).stroke();

  // ---------------- DYNAMIC BILLED TO SECTION ----------------
  const boxTop = 115;
  doc
    .fillColor("#1e293b")
    .fontSize(9)
    .font("Helvetica-Bold")
    .text("BILLED TO:", 40, boxTop);

  doc
  .fontSize(8)
  .font("Helvetica")
  .fillColor("#334155")
  .text(user?.fullName || user?.username || "Valued Customer", 40, boxTop + 13);

// Address text & dynamic height calculation
const addressText = order?.shippingAddress || "No shipping address provided";
const addressY = boxTop + 24;

doc.text(addressText, 40, addressY, { width: 300 });

// Calculate dynamic height of address block to eliminate black space/gap
const addressHeight = doc.heightOfString(addressText, { width: 300 });
const emailY = addressY + addressHeight + 2; 
const phoneY = emailY + 11;

doc.text(user?.email || "N/A", 40, emailY);
doc.text(user?.phone || "N/A", 40, phoneY);

  // ---------------- TABLE HEADER ----------------
  const tableTop = Math.max(200, phoneY + 20);

  doc.rect(40, tableTop, 515, 26).fill("#f8fafc");

  doc
    .fillColor("#0f172a")
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Item", 50, tableTop + 8, { width: 90, align: "left" })
    .text("Qty", 140, tableTop + 8, { width: 40, align: "center" })
    .text("Price", 180, tableTop + 8, { width: 65, align: "right" })
    .text("Total", 245, tableTop + 8, { width: 70, align: "right" })
    .text(`CGST (${order.cgstRate || 9}%)`, 320, tableTop + 8, { width: 65, align: "right" })
    .text(`SGST (${order.sgstRate || 9}%)`, 390, tableTop + 8, { width: 65, align: "right" })
    .text("Net Total", 460, tableTop + 8, { width: 85, align: "right" });

  // ---------------- TABLE ROWS ----------------
  let y = tableTop + 38;
  const items = order.items || [];

  items.forEach((item) => {
    const qty = item.qty || 1;
    const price = item.price || 0;
    const lineTotal = price * qty;
    const lineCgst = Number(((lineTotal * (order.cgstRate || 9)) / 100).toFixed(2));
    const lineSgst = Number(((lineTotal * (order.sgstRate || 9)) / 100).toFixed(2));
    const netTotal = lineTotal + lineCgst + lineSgst;

    doc
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(8)
      .text(item.name || "Item", 50, y, { width: 90, align: "left" })
      .text(String(qty), 140, y, { width: 40, align: "center" })
      .text(`Rs. ${price.toLocaleString("en-IN")}`, 180, y, { width: 65, align: "right" })
      .text(`Rs. ${lineTotal.toLocaleString("en-IN")}`, 245, y, { width: 70, align: "right" })
      .text(`Rs. ${lineCgst.toLocaleString("en-IN")}`, 320, y, { width: 65, align: "right" })
      .text(`Rs. ${lineSgst.toLocaleString("en-IN")}`, 390, y, { width: 65, align: "right" })
      .text(`Rs. ${netTotal.toLocaleString("en-IN")}`, 460, y, { width: 85, align: "right" });

    y += 28;
  });

  doc.moveTo(40, y).lineTo(555, y).strokeColor("#e2e8f0").lineWidth(1).stroke();
  y += 20;

  // ---------------- BILL SUMMARY ----------------
  const labelX = 360;
  const valueX = 460;
  const valueWidth = 85;

  doc.fontSize(8).font("Helvetica").fillColor("#475569");

  doc.text("Subtotal", labelX, y, { align: "right", width: 90 });
  doc.text(`Rs. ${(order.subTotal || 0).toLocaleString("en-IN")}`, valueX, y, { align: "right", width: valueWidth });
  y += 18;

  doc.text(`CGST (${order.cgstRate || 9}%)`, labelX, y, { align: "right", width: 90 });
  doc.text(`Rs. ${(order.cgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, valueX, y, { align: "right", width: valueWidth });
  y += 18;

  doc.text(`SGST (${order.sgstRate || 9}%)`, labelX, y, { align: "right", width: 90 });
  doc.text(`Rs. ${(order.sgstAmount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, valueX, y, { align: "right", width: valueWidth });
  y += 22;

  doc.rect(340, y - 6, 215, 26).fill("#f1f5f9");
  doc
    .fillColor("#2563eb")
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Grand Total", labelX - 10, y + 2, { align: "right", width: 100 })
    .text(`Rs. ${(order.grandTotal || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, valueX, y + 2, { align: "right", width: valueWidth });

  // ---------------- FOOTER ----------------
  const footerTop = 750;
  doc
    .fillColor("#94a3b8")
    .fontSize(8)
    .font("Helvetica-Oblique")
    .text("Thank you for shopping with Neelkanth!", 40, footerTop, { align: "center" });

  doc.end();
  return fileName;
}