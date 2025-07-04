# Cara Build SCSS ke CSS Otomatis

Agar animasi bunga berjalan penuh, pastikan file SCSS sudah terkompilasi ke CSS. Berikut instruksi build otomatis/manual:

## 1. Instalasi Node.js & npm
Pastikan Node.js dan npm sudah terinstall di komputer Anda.

## 2. Inisialisasi npm (jika belum ada)
```bash
npm init -y
```

## 3. Install package `sass`
```bash
npm install sass --save-dev
```

## 4. Tambahkan script build di `package.json`
Edit bagian `scripts` di `package.json`:
```json
"scripts": {
  "build-css": "sass assets/scss:assets/css",
  "watch-css": "sass --watch assets/scss:assets/css"
}
```

## 5. Build manual (sekali jalan)
```bash
npm run build-css
```

## 6. Build otomatis (watch mode)
```bash
npm run watch-css
```

## 7. Pastikan file hasil: `assets/css/flower-style.css` sudah terisi dari SCSS.

---

**Catatan:**
- Jalankan perintah di atas dari folder utama project (`mil`).
- Jika ingin otomatis, gunakan `watch-css` agar setiap perubahan SCSS langsung terupdate ke CSS.
- Tidak perlu mengupload file .map ke server production.

---

Jika ada error atau animasi tidak berjalan, pastikan tidak ada error di console browser dan file CSS sudah terupdate.
