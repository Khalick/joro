# 🏨 JURA RESORT BOOKING SYSTEM SETUP GUIDE
## Google Sheets Integration for Website Booking Forms

This guide will help you set up a complete booking system that automatically saves all booking requests from your website to Google Sheets and sends email notifications.

---

## 📋 STEP-BY-STEP SETUP

### **Step 1: Create Google Spreadsheet**

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create a new spreadsheet**
3. **Name it**: "Jura Resort Bookings"
4. **Copy the Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```
   Example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### **Step 2: Create Google Apps Script**

1. **Go to Google Apps Script**: https://script.google.com
2. **Click "New Project"**
3. **Replace the default code** with the content from `google-apps-script.js` file
4. **Update the configuration** at the top:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'YOUR_ACTUAL_SPREADSHEET_ID', // Paste your ID here
     SHEET_NAME: 'Bookings',
     NOTIFICATION_EMAIL: 'your-email@juraresort.com', // Your email
     BUSINESS_NAME: 'Jura Resort',
     BUSINESS_PHONE: '+254 722 566 089'
   };
   ```

### **Step 3: Deploy the Web App**

1. **Click "Deploy" → "New deployment"**
2. **Type**: Choose "Web app"
3. **Execute as**: "Me"
4. **Who has access**: "Anyone" (important!)
5. **Click "Deploy"**
6. **Copy the Web App URL** (it looks like this):
   ```
   https://script.google.com/macros/s/ABC123.../exec
   ```

### **Step 4: Update Your Website**

Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` in your HTML files with the actual Web App URL:

**Files to update:**
- ✅ `RestaurantandDishes.html` (already updated)
- `pre.html`
- `IndoorGames.html` 
- Any other forms

**Find this line and replace the URL:**
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
```

**Replace with your actual URL:**
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC123.../exec';
```

### **Step 5: Test the System**

1. **Go to Google Apps Script**
2. **Run the function**: `testBookingSystem`
3. **Check your Google Sheet** - you should see a test booking
4. **Check your email** - you should receive a notification

### **Step 6: Test from Website**

1. **Open your website**
2. **Fill out a booking form**
3. **Submit it**
4. **Check Google Sheets** - new booking should appear
5. **Check email** - notification should arrive

---

## 📊 GOOGLE SHEETS FEATURES

Your booking spreadsheet will automatically include:

| Column | Description |
|--------|-------------|
| **Booking ID** | Unique ID (JR-2025-0001, JR-2025-0002, etc.) |
| **Timestamp** | Date and time of booking |
| **Name** | Customer's full name |
| **Email** | Customer's email address |
| **Contact** | Customer's phone number |
| **Message/Details** | Booking details and special requests |
| **Source** | Which form was used (Restaurant, Activities, etc.) |
| **Status** | Pending/Confirmed/Cancelled |
| **Follow-up Date** | When to follow up (manual entry) |
| **Notes** | Additional notes (manual entry) |

---

## 📧 EMAIL NOTIFICATIONS

You'll receive beautiful HTML email notifications with:
- 📋 Complete booking details
- 📞 Quick action buttons (call, email, WhatsApp)
- 🔗 Direct link to your Google Sheets dashboard
- 🎨 Professional formatting with your brand colors

---

## 📱 WHATSAPP INTEGRATION

After each booking, customers can optionally send the same details via WhatsApp for faster response:
- Automatic message formatting
- Direct link to your business WhatsApp
- Backup communication channel

---

## 🛠️ ADVANCED FEATURES

### **Auto-Response Email (Optional)**
Add this to your Google Apps Script to send confirmation emails to customers:

```javascript
function sendCustomerConfirmation(data) {
  const subject = `Booking Confirmation - ${CONFIG.BUSINESS_NAME}`;
  const htmlBody = `
    <h1>Thank you for your booking request!</h1>
    <p>Dear ${data.name},</p>
    <p>We have received your booking request and will contact you within 2 hours.</p>
    <p><strong>Your Details:</strong></p>
    <ul>
      <li>Name: ${data.name}</li>
      <li>Contact: ${data.contact}</li>
      <li>Details: ${data.message}</li>
    </ul>
    <p>For immediate assistance, call us at ${CONFIG.BUSINESS_PHONE}</p>
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody
  });
}
```

### **SMS Notifications (Optional)**
Integrate with SMS services like Twilio for instant SMS alerts.

### **Slack/Discord Notifications (Optional)**
Send booking notifications to your team chat.

---

## 🚨 TROUBLESHOOTING

### **Common Issues:**

1. **"Permission denied"**
   - Make sure deployment access is set to "Anyone"
   - Re-deploy the web app

2. **No data appearing in sheets**
   - Check the Spreadsheet ID is correct
   - Verify the sheet name matches CONFIG.SHEET_NAME

3. **No email notifications**
   - Check your Gmail account
   - Verify notification email address
   - Check spam folder

4. **Website form not working**
   - Check browser console for errors
   - Verify the Google Script URL is correct
   - Test with different browsers

### **Testing Commands:**

Run these in Google Apps Script console:
```javascript
// Test spreadsheet connection
testBookingSystem()

// Initialize spreadsheet formatting
initializeSpreadsheet()

// Check configuration
console.log(CONFIG)
```

---

## 📈 ANALYTICS & REPORTING

Your Google Sheets can be enhanced with:
- 📊 **Charts**: Booking trends over time
- 📋 **Pivot tables**: Bookings by source, status, etc.
- 🔄 **Conditional formatting**: Color-code booking status
- 📱 **Google Data Studio**: Advanced dashboards

---

## 🔒 SECURITY & PRIVACY

- ✅ All data stored in your Google account
- ✅ HTTPS encryption for all transfers
- ✅ No third-party services required
- ✅ Full control over data access
- ✅ GDPR compliant (with proper privacy policy)

---

## 📞 SUPPORT

If you need help with setup:
1. Check this guide thoroughly
2. Test each step individually
3. Check Google Apps Script logs for errors
4. Verify all URLs and IDs are correct

**Happy booking management! 🎉**

---

## 🔄 UPDATE LOG

- **v1.0**: Initial setup with Google Sheets integration
- **v1.1**: Added email notifications and WhatsApp integration
- **v1.2**: Enhanced form validation and error handling