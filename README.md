# Kuisioner AI untuk Penelitian

Situs ini adalah kuisioner statis yang bisa di-host gratis dan dikirim ke Google Sheets untuk pengumpulan data penelitian. Versi ini juga menambahkan proxy server agar URL Web App Google Apps Script tidak muncul di browser publik.

## Struktur

- `index.html`: situs kuisioner utama.
- `rekap.html`: halaman admin untuk melihat rekap data terpusat.
- `api/submit.js`: endpoint server untuk meneruskan submit ke Google Apps Script menggunakan env.
- `api/rekap.js`: endpoint server untuk mengambil rekap Google Sheets dengan proteksi kunci akses.
- `google-apps-script/Code.gs`: backend gratis untuk menerima respons dan menyimpannya ke Google Sheets.

## Opsi hosting gratis

Ada dua opsi yang cocok untuk proyek ini:

- GitHub Pages
- Vercel

Menurut dokumentasi GitHub, GitHub Pages dapat mem-publish file HTML/CSS/JS langsung dari repository GitHub, dan tersedia untuk repository publik pada GitHub Free. Sumber:

- [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)
- [GitHub Pages Quickstart](https://docs.github.com/en/pages/quickstart?library=true)

Menurut dokumentasi Vercel, project yang menghasilkan konten HTML statis juga bisa langsung di-import dan di-deploy, baik dari Git repository maupun CLI. Sumber:

- [Import an existing project](https://vercel.com/docs/getting-started-with-vercel/import)
- [Deploying to Vercel](https://vercel.com/docs/deployments/deployment-methods)
- [vercel deploy](https://vercel.com/docs/cli/deploy)

## Deploy ke GitHub Pages

1. Buat repository GitHub baru.
2. Upload seluruh isi folder ini ke repository tersebut.
3. Pastikan file utama ada di root repository dengan nama `index.html`.
4. Buka `Settings` > `Pages`.
5. Pada `Build and deployment`, pilih:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - folder: `/ (root)`
6. Simpan. GitHub akan memberi URL publik situs Anda.

Contoh hasil URL:

`https://username.github.io/nama-repo/`

## Deploy ke Vercel

Proyek ini sudah siap untuk Vercel sebagai static site. File [vercel.json](/Users/AND5661/Learn/kuisioner-ai/vercel.json) ditambahkan untuk perilaku URL yang lebih rapi.

### Cara termudah: import repository

1. Push proyek ini ke GitHub, GitLab, atau Bitbucket.
2. Login ke [Vercel](https://vercel.com).
3. Klik `Add New...` > `Project`.
4. Import repository yang berisi proyek ini.
5. Vercel akan membaca proyek sebagai situs statis.
6. Untuk proyek ini, biasanya Anda tidak perlu mengisi:
   - build command
   - output directory
7. Klik `Deploy`.

Setelah deploy selesai, Vercel akan memberi URL publik seperti:

`https://nama-project.vercel.app`

### Opsi CLI

Jika ingin deploy dari terminal, dokumentasi resmi Vercel menyarankan menjalankan `vercel` atau `vercel --prod` dari root project.

## GitHub Pages vs Vercel

- GitHub Pages sederhana dan sangat cocok untuk situs statis dasar.
- Vercel biasanya lebih nyaman untuk preview deployment setiap perubahan.
- Untuk proyek ini, mode yang lebih aman menggunakan `env` dan server function, jadi Vercel lebih cocok daripada GitHub Pages.

## Integrasi Google Sheets

Menurut dokumentasi resmi Google Apps Script, script yang memiliki `doPost(e)` bisa di-deploy sebagai web app dan menerima request dari browser. Sumber:

- [Apps Script Web Apps](https://developers.google.com/apps-script/guides/web)
- [Apps Script Deployments](https://developers.google.com/apps-script/concepts/deployments)

### Langkah setup

1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru.
2. Dari spreadsheet itu, buka `Extensions` > `Apps Script`.
3. Hapus isi default, lalu salin kode dari `google-apps-script/Code.gs`.
4. Simpan project.
5. Klik `Deploy` > `New deployment`.
6. Pilih tipe `Web app`.
7. Atur:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
8. Klik `Deploy`, lalu salin URL Web App yang berakhiran `/exec`.
9. Salin isi `google-apps-script/Code.gs` terbaru dari repo ini jika Anda juga ingin memakai halaman `rekap.html`.
10. Deploy project ini ke Vercel.
11. Di pengaturan project Vercel, tambahkan environment variables:
    - `GOOGLE_APPS_SCRIPT_URL` = URL Web App Apps Script Anda
    - `REKAP_ACCESS_KEY` = kunci admin untuk membuka halaman `/rekap`
12. Redeploy project.

Setelah itu, setiap submit baru akan:

- tetap tersimpan lokal di browser,
- diteruskan server ke Google Sheets tanpa mengekspos URL Web App,
- bisa dilihat dari halaman `/rekap` jika kunci akses benar.

## Export hasil penelitian

Ada 2 jalur export:

1. Dari halaman `/rekap`:
   - klik `Export CSV` untuk analisis di Excel, SPSS, Jamovi, atau R.
   - klik `Export JSON` bila Anda butuh format mentah.

2. Dari Google Sheets:
   - buka spreadsheet hasil.
   - pilih `File` > `Download`.
   - export sebagai `.xlsx`, `.csv`, atau format lain.

## Catatan teknis

- Menaruh URL Apps Script di frontend env tidak benar-benar menyembunyikannya, karena nilainya tetap terkirim ke browser saat runtime atau build.
- Pada versi ini, sinkronisasi ke Google Sheets dilakukan lewat Vercel Function (`/api/submit`) yang membaca `GOOGLE_APPS_SCRIPT_URL` dari env server.
- Halaman rekap mengambil data dari `/api/rekap` dan dibatasi oleh `REKAP_ACCESS_KEY`.
- Jika halaman `/rekap` menampilkan error bahwa `/api/rekap` mengembalikan HTML, itu biasanya berarti project belum dideploy di platform yang menjalankan server function, atau deployment lama belum memuat folder `api/`.
- Jika env server belum diisi atau Apps Script gagal diakses, data tetap aman di `localStorage` browser perangkat responden sebagai cadangan lokal.
- Untuk penelitian nyata, uji dulu dengan 2-3 submit percobaan sebelum membagikan link ke responden.
