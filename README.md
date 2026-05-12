# Kuisioner AI untuk Penelitian

Situs ini adalah kuisioner statis yang bisa di-host gratis dan dikirim ke Google Sheets untuk pengumpulan data penelitian.

## Struktur

- `index.html`: situs kuisioner utama.
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

Proyek ini sudah siap untuk Vercel sebagai static site. File [vercel.json](/Users/AND5661/Learn/kuisioner-tentang-ai/vercel.json) ditambahkan untuk perilaku URL yang lebih rapi.

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
- Untuk proyek ini, integrasi Google Sheets tetap bekerja pada kedua platform karena submit dilakukan langsung dari browser ke Google Apps Script.

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
9. Buka website kuisioner Anda.
10. Pada bagian `Sinkronisasi Google Sheets`, tempel URL Web App tadi lalu klik `Simpan URL`.

Setelah itu, setiap submit baru akan:

- tetap tersimpan lokal di browser,
- masuk ke tabel rekap halaman,
- terkirim juga ke Google Sheets.

## Export hasil penelitian

Ada 2 jalur export:

1. Dari website:
   - klik `Export CSV` untuk analisis di Excel, SPSS, Jamovi, atau R.
   - klik `Export JSON` bila Anda butuh format mentah.

2. Dari Google Sheets:
   - buka spreadsheet hasil.
   - pilih `File` > `Download`.
   - export sebagai `.xlsx`, `.csv`, atau format lain.

## Catatan teknis

- Sinkronisasi ke Google Sheets dilakukan dari browser dengan `POST` ke Apps Script.
- Jika URL Apps Script belum diisi atau gagal diakses, data tetap aman di `localStorage` browser dan masih bisa diexport manual.
- Untuk penelitian nyata, uji dulu dengan 2-3 submit percobaan sebelum membagikan link ke responden.
