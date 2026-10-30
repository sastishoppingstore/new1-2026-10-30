# StackCP Deployment Guide

Aapka project StackCP hosting per deploy karne ke liye bilkul tayar hai!

## 📦 Zip File Location
- **Path**: `/home/wafa-tech/new1/stackcp_deploy.zip`
- **File Size**: ~653 KB

---

## 🚀 StackCP per Upload Kaise Karein (Step-by-Step):

1. **StackCP Control Panel** me login karein.
2. **File Manager** open karein.
3. Apne domain ke root directory me jayein (aam tor per `public_html`).
4. Agar `public_html` ke andar purani default files (e.g., `index.html`, `hosting-start.html`) hain to unka backup le kar delete/move kar dein.
5. **Upload** button per click karein aur `stackcp_deploy.zip` ko upload karein.
6. Upload complete hone ke baad file per right-click karein aur **Extract / Unzip** select karein.
7. Files directly `public_html` ke andar extract honi chahiye:
   ```text
   public_html/
   ├── .htaccess
   ├── index.html
   ├── favicon.svg
   ├── vite.svg
   ├── assets/
   ├── properties/
   └── api/
       ├── .htaccess
       ├── config.php
       ├── db-client.php
       ├── properties.php
       ├── inquiries.php
       ├── saved.php
       └── index.php
   ```
8. Ab apna domain browser me open karein! Website live ho jayegi.

---

## 🗄️ Database Details
- **Same Database Used**: Supabase (Project ID: `lwjncfbpknvwinkuptue`)
- Kisi bhi database import/export ki zaroorat nahi hai. PHP API seedha aapke existing Supabase database ke sath connected hai.
- Agar credentials change karne hon to `api/config.php` me update kar sakte hain.

---

## 🛠️ API Endpoints (PHP)
- `GET/POST/PUT/DELETE /api/properties` -> Managed by `api/properties.php`
- `GET/POST/DELETE /api/inquiries` -> Managed by `api/inquiries.php`
- `GET/POST/DELETE /api/saved` -> Managed by `api/saved.php`

---

## 🎨 Frontend Status
- **0% Changed**: Frontend ka design, components, styles aur animations 100% same hain.
