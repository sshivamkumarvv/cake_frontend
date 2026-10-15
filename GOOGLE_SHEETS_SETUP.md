# 📊 Bakeistry Studio — Google Sheets Order Tracking System (Complete Setup)

Every order placed on the website automatically pushes a clean, formatted row to your Google Sheet so you can track baking progress, confirm payments, and 1-click message customers on WhatsApp!

---

## Step 1: Create Your Google Sheet
1. Open [Google Sheets (sheets.new)](https://sheets.new) and create a new spreadsheet named **"Bakeistry Orders & Dispatch"**.
2. Rename the first sheet tab (at the bottom) to **"Orders"**.

---

## Step 2: Add Google Apps Script
1. In your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete any boilerplate text and paste the script below:

```javascript
/**
 * Bakeistry Studio — Automated Order Receiver & Formatter
 */
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Orders") || ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Auto-initialize header row if empty
    if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }
    
    // Create Clickable WhatsApp Link formula for the customer
    var waFormula = data.customerWhatsAppUrl 
      ? '=HYPERLINK("' + data.customerWhatsAppUrl + '", "💬 Chat Customer")' 
      : "";

    var newRow = [
      data.timestamp || new Date().toLocaleString(),
      "NEW",                             // Order Status (dropdown)
      data.orderId || "",               // Order ID
      data.customerName || "",          // Customer Name
      data.phone || "",                 // Phone Number
      waFormula,                        // 1-Click WhatsApp Chat
      data.deliveryDate || "",          // Delivery Date
      data.deliverySlot || "",          // Delivery Slot
      data.itemsSummary || "",          // Items & Weights
      data.cakeInscription || "None",   // Custom Message on Cake
      data.dietary || "Standard",       // Eggless / Standard
      data.address || "",               // Delivery Address (Bhiwadi)
      data.pincode || "",               // Pincode
      data.subtotal || 0,               // Subtotal
      data.deliveryFee || 0,            // Delivery Fee
      data.total || 0,                  // Total Amount (₹)
      data.paymentMethod || "",         // Payment Method
      data.paymentStatus || "Pending",  // Payment Status
      data.notes || ""                  // Special Kitchen Notes
    ];
    
    sheet.appendRow(newRow);
    
    // Format the new row nicely
    var lastRow = sheet.getLastRow();
    
    // Apply dropdown validation for Status column (Column B)
    var statusCell = sheet.getRange(lastRow, 2);
    var statusRule = SpreadsheetApp.newDataValidation()
      .requireValueInList([
        "NEW",
        "CONFIRMED (WhatsApp)",
        "IN OVEN / BAKING",
        "PACKED & READY",
        "OUT FOR DELIVERY",
        "DELIVERED",
        "CANCELLED"
      ], true)
      .build();
    statusCell.setDataValidation(statusRule);
    
    // Highlight NEW status in soft yellow
    statusCell.setBackground("#FFF9C4").setFontWeight("bold");

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Setup luxury header styling for the bakery
 */
function setupHeaders(sheet) {
  var headers = [
    "Order Date & Time",
    "Status",
    "Order ID",
    "Customer Name",
    "Phone Number",
    "WhatsApp Action",
    "Delivery Date",
    "Delivery Slot",
    "Cake(s) & Weight",
    "Message on Cake (Inscription)",
    "Dietary",
    "Delivery Address (Bhiwadi)",
    "Pincode",
    "Subtotal (₹)",
    "Delivery Fee (₹)",
    "Total Payable (₹)",
    "Payment Mode",
    "Payment Status",
    "Special Kitchen Notes"
  ];
  
  sheet.appendRow(headers);
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  
  headerRange.setBackground("#283625")  // Deep forest green
             .setFontColor("#FFFFFF")
             .setFontWeight("bold")
             .setFontSize(10)
             .setVerticalAlignment("middle");
  
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);
}
```

---

## Step 3: Deploy as Web App
1. At the top right of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon next to "Select type" and select **Web app**.
3. Fill in:
   - **Description**: `Bakeistry Order Dispatcher`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial: allows webhook from website)*
4. Click **Deploy** and authorize access with your Google account.
5. Copy the generated **Web App URL** (e.g., `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## Step 4: Add Web App URL to your `.env.local`
In `frontend/.env.local`, set:
```env
GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
```

Restart your dev server or deploy. Every order placed from the website will automatically:
- Append a row in your sheet with **all cake customization details**, **inscription**, **Bhiwadi address**, and **prices**.
- Give you a 1-click **"💬 Chat Customer"** WhatsApp link directly in the sheet!
- Give you a status dropdown (**NEW**, **IN OVEN**, **OUT FOR DELIVERY**, etc.) to manage your kitchen pipeline.
