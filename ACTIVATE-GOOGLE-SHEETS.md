# 🚀 Google Sheets Integration - Step-by-Step Setup Guide

## ✅ **READY TO ACTIVATE**: Your booking forms are prepared for Google Sheets integration!

Follow these steps **exactly** to activate Google Sheets booking system:

---

## 📋 **STEP 1: Create Google Spreadsheet**

1. **Go to Google Sheets**: [sheets.google.com](https://sheets.google.com)
2. **Click "Create" (+)** to make a new spreadsheet
3. **Rename it**: "Jura Resort Bookings"
4. **Keep it open** - you'll need it for the next step

---

## 💻 **STEP 2: Create Google Apps Script**

1. **Go to Google Apps Script**: [script.google.com](https://script.google.com)
2. **Click "New Project"**
3. **Delete all existing code** in the editor
4. **Copy and paste** the entire code from `Google-Apps-Script-Code.js` file
5. **IMPORTANT**: Update the email address in line 73:
   ```javascript
   // CHANGE THIS LINE:
   MailApp.sendEmail('your-email@example.com', subject, body);
   
   // TO YOUR ACTUAL EMAIL:
   MailApp.sendEmail('khalick@example.com', subject, body);
   ```

---

## 🔗 **STEP 3: Connect Script to Your Spreadsheet**

1. **In Google Apps Script**, click the **settings icon** (⚙️) on the left
2. **Click "Script Properties"**
3. **Or use this method**: In your script, click **"Resources" → "Cloud Platform Project"**
4. **Better method**: 
   - Go back to your Google Sheet
   - Click **"Extensions" → "Apps Script"**
   - This automatically links them!

---

## 🚀 **STEP 4: Deploy the Script**

1. **In Google Apps Script**, click **"Deploy" → "New Deployment"**
2. **Click the gear icon** ⚙️ next to "Type"
3. **Select "Web app"**
4. **Fill in these settings**:
   - **Description**: "Jura Resort Booking System"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
5. **Click "Deploy"**
6. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXX/exec
   ```

---

## 🔧 **STEP 5: Update Your Website**

**Replace the placeholder URL in these 4 files:**

### **File 1: RestaurantandDishes.html**
- **Find line ~700**: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';`
- **Replace with**: `const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_FROM_STEP_4';`

### **File 2: pre.html**  
- **Find line ~1675**: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';`
- **Replace with**: `const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_FROM_STEP_4';`

### **File 3: IndoorGames.html**
- **Find line ~485**: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';`  
- **Replace with**: `const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_FROM_STEP_4';`

### **File 4: OutdoorActivities.html**
- **Find line ~470**: `const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec';`
- **Replace with**: `const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_FROM_STEP_4';`

---

## 🧪 **STEP 6: Test the System**

1. **Go to Google Apps Script** → **Click "testBooking" function** → **Run**
2. **Check your Google Sheet** - you should see a test entry
3. **Test a real booking** on your website
4. **Check your email** - you should receive notifications

---

## ✅ **STEP 7: Verify Everything Works**

### **What Should Happen When Someone Books:**

1. ✅ **Data saved** to Google Sheets automatically
2. ✅ **Email sent to you** with booking details  
3. ✅ **Confirmation email sent** to customer
4. ✅ **Customer sees success message** on website
5. ✅ **Optional WhatsApp backup** still available

### **Your Google Sheet Will Show:**
- Timestamp
- Customer Name  
- Email
- Phone
- Booking Details
- Source Page
- Status (New)
- Notes (empty, for your use)

---

## 🎯 **QUICK REFERENCE**

### **Your Files Structure:**
```
joro/
├── RestaurantandDishes.html    ← Update line ~700
├── pre.html                    ← Update line ~1675  
├── IndoorGames.html           ← Update line ~485
├── OutdoorActivities.html     ← Update line ~470
├── Google-Apps-Script-Code.js ← Copy to Google Apps Script
└── This guide
```

### **What to Replace:**
- **OLD**: `'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec'`
- **NEW**: `'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXX/exec'`

---

## ⚡ **INSTANT ACTIVATION**

Once you complete Step 5 (updating the URLs), your booking system will:
- ✅ **Immediately start saving** all bookings to Google Sheets
- ✅ **Send email notifications** automatically
- ✅ **Provide professional experience** for customers
- ✅ **Keep WhatsApp backup** as an option

---

## 🆘 **Need Help?**

If you encounter issues:

1. **Check the URL** is copied correctly (no extra spaces)
2. **Verify permissions** in Google Apps Script deployment
3. **Test the script** using the `testBooking()` function
4. **Check email settings** in your Google account

**The system is ready - just follow these steps and it will work perfectly!** 🚀