---
name: sph-generator
description: Generate a Surat Penawaran Harga (SPH) / Price Quotation Letter as a structured Markdown file that converts cleanly to .docx (via Pandoc) or .pdf. Supports two output languages — Bahasa Indonesia and English — and two modes — goods (barang) and services (jasa, e.g. web development, interior design, consulting). Use this skill whenever the user asks to create, draft, or generate an SPH, surat penawaran, surat penawaran harga, quotation letter, price quote, price offer, business quotation, project proposal with pricing, or any formal price proposal document for goods or services. Trigger this skill even when the user does not explicitly say "SPH" — phrases like "buatkan penawaran untuk klien", "buat penawaran jasa pembuatan website", "draft a quote for the interior design project", "buat surat penawaran", "I need a price offer document", or "tolong buatkan dokumen penawaran harga" all qualify.
---

# SPH Generator — Surat Penawaran Harga / Price Quotation Letter

Generate a clean, business-ready **Surat Penawaran Harga (SPH)** as a single Markdown file. The output is intentionally formatted so it converts well to `.docx` or `.pdf` via Pandoc, Typora, or similar tools — no exotic syntax, no HTML soup, just portable Markdown.

The skill supports two output languages:
- **Bahasa Indonesia** (default for Indonesian context)
- **English**

…and two modes:
- **Goods mode (barang)** — concise template for physical/product quotations (e.g. supply alat, hardware, ATK).
- **Services mode (jasa)** — richer template for project-based services (web/app development, desain interior, branding, konsultan, event organizer, dll). Adds Lingkup Pekerjaan, Tahapan & Termin, Asumsi & Pengecualian, dan Revisi — bagian-bagian yang biasanya jadi sumber sengketa kalau tidak dieksplisitkan.

## When to use

Trigger this skill when the user wants to produce a formal price quotation document, including phrasings like:
- "buat SPH ...", "buatkan surat penawaran harga", "draft penawaran untuk ..."
- "create a quotation", "draft a price offer", "I need a quote document"
- Any request that involves sending a vendor's offered price to a prospective client in letter form

If the user is just asking for a casual price estimate (no letter, no recipient, no terms), this skill is overkill — clarify whether they want a full SPH document or just a price breakdown.

## Workflow

### 1. Choose the language and mode

**Language** — ask once **unless** obvious from context (request ditulis dalam Bahasa Indonesia, pihak-pihak lokal → ID).

> "Mau dibuat dalam Bahasa Indonesia atau English?"

**Mode (barang vs jasa)** — infer from the items first; only ask if genuinely ambiguous. Heuristic:

- Kata kunci **jasa**: pembuatan, pengembangan, development, desain, design, konsultasi, consulting, perancangan, instalasi (kalau termasuk pengerjaan), audit, training, maintenance, retainer, project, proyek, event organizer.
- Kata kunci **barang**: supply, pengadaan, unit, pcs, lusin, kg, hardware, alat, peralatan, ATK, mesin, furniture (jadi).

Kalau campuran (mis. supply + instalasi), pakai **services mode** dan masukkan barangnya sebagai line item di dalam scope — services mode adalah superset.

### 2. Gather the required information

Collect what you need to fill the template. Don't over-interrogate — ask for the missing pieces in one batch. Required fields:

| Field | Indonesian label | English label |
|---|---|---|
| Letter number | Nomor Surat | Reference No. |
| Date | Tanggal | Date |
| Sender (your company) | Pengirim / Perusahaan | Sender / Company |
| Recipient | Kepada Yth. | To |
| Recipient address | Alamat | Address |
| Subject | Perihal | Subject |
| Item / service lines | Rincian Barang/Jasa | Items / Services |
| Currency | Mata Uang (default IDR) | Currency (default IDR) |
| Tax (PPN) | PPN (umumnya 11%) | VAT (commonly 11% in ID) |
| Validity period | Masa Berlaku Penawaran | Quotation Validity |
| Payment terms | Syarat Pembayaran | Payment Terms |
| Delivery terms | Syarat Pengiriman | Delivery Terms |
| Signatory name & title | Nama & Jabatan Penanda Tangan | Signatory Name & Title |

**Tambahan untuk services mode:**

| Field | Indonesian label | English label |
|---|---|---|
| Project background | Latar Belakang Proyek | Project Background |
| Executive summary | Ringkasan Eksekutif | Executive Summary |
| Product type, users, platform, tech stack | Tipe Produk, Pengguna, Platform, Teknologi | Product Type, Users, Platform, Tech |
| Pain points / challenges | Tantangan / Masalah yang Diselesaikan | Pain Points / Challenges |
| Solution overview | Solusi Sistem | Solution Overview |
| Scope of work | Scope of Work | Scope of Work |
| Project deliverables | Project Deliverables | Project Deliverables |
| Payment terms (termin) | Termin Pembayaran | Payment Milestones |
| Warranty | Garansi | Warranty |

If the user supplies only some of these, fill the rest with sensible placeholders (e.g., `[Nama Klien]`, `[YYYY-MM-DD]`) so the document is still usable as a draft.

### 3. Build the cost table

**Goods mode** — each row: `No. | Deskripsi | Qty | Satuan | Harga Satuan | Subtotal`. Compute subtotals, PPN, and grand total inline.

**Services mode** — each row: `No. | Deskripsi Pekerjaan | Waktu | Biaya (IDR)`. This reflects how service work is scoped — by effort/duration, not unit price. Rules:
- "Waktu" = duration, e.g. `10 Hari Kerja`, `2 Minggu`
- "Biaya" = lump sum for that work package
- Grand total row: `**TOTAL INVESTASI** | | **X Hari Kerja** | **Rp X**`
- PPN / tax goes in the **Keterangan** below the table (not as a separate table row) — common practice in Indonesian service proposals. State whether price is inclusive or exclusive of tax.
- Termin pembayaran also goes in Keterangan as a numbered list: DP %, mid %, final %

Format currency cleanly:
- IDR → `Rp 90.000.000` (titik sebagai pemisah ribuan, tanpa desimal)
- USD/EUR → `$90,000.00` / `€90,000.00`

Verify the total before writing. Also verify that payment termin percentages add up to 100%.

### 4. Write the Markdown file

Save to a sensible filename:
- ID: `SPH-[Nomor]-[NamaKlien].md` (e.g., `SPH-001-PT-Maju-Jaya.md`)
- EN: `Quotation-[RefNo]-[ClientName].md`

Use the appropriate template below. Keep it portable: standard headings, GFM tables, no raw HTML, no Mermaid, no fancy admonitions. This is what makes the file convert cleanly with `pandoc input.md -o output.docx` or `pandoc input.md -o output.pdf --pdf-engine=xelatex`.

### 5. Tell the user how to convert

After writing the file, mention briefly that they can convert it with Pandoc:

```
pandoc SPH-001-Klien.md -o SPH-001-Klien.docx
pandoc SPH-001-Klien.md -o SPH-001-Klien.pdf --pdf-engine=xelatex
```

Don't lecture — one short line is enough.

---

## Template — Bahasa Indonesia

```markdown
# SURAT PENAWARAN HARGA

**Nomor:** {{nomor_surat}}
**Tanggal:** {{tanggal}}
**Perihal:** {{perihal}}

---

**Kepada Yth.**
{{nama_penerima}}
{{jabatan_penerima}}
{{nama_perusahaan_penerima}}
{{alamat_penerima}}

---

Dengan hormat,

Sehubungan dengan {{konteks_singkat}}, bersama ini kami **{{nama_perusahaan_pengirim}}** dengan senang hati menyampaikan penawaran harga untuk {{ringkasan_lingkup}} sebagai berikut:

## Rincian Barang/Jasa

| No. | Deskripsi | Qty | Satuan | Harga Satuan | Subtotal |
|----:|-----------|----:|:------:|-------------:|---------:|
| 1   | {{deskripsi_1}} | {{qty_1}} | {{satuan_1}} | {{harga_1}} | {{subtotal_1}} |
| 2   | {{deskripsi_2}} | {{qty_2}} | {{satuan_2}} | {{harga_2}} | {{subtotal_2}} |

|  | **Subtotal** | **{{subtotal_total}}** |
|--|--:|--:|
|  | PPN (11%) | {{ppn}} |
|  | Diskon | {{diskon}} |
|  | **Total** | **{{total}}** |

*Terbilang: {{total_terbilang}} rupiah.*

## Syarat dan Ketentuan

1. **Masa Berlaku Penawaran:** {{masa_berlaku}} sejak tanggal surat ini.
2. **Syarat Pembayaran:** {{syarat_pembayaran}}.
3. **Waktu Pengiriman/Pengerjaan:** {{waktu_pengerjaan}} setelah PO/DP diterima.
4. **Garansi:** {{garansi}}.
5. Harga sudah termasuk PPN (kecuali disebutkan lain).
6. Ketentuan lain dapat dirundingkan lebih lanjut.

## Penutup

Demikian penawaran ini kami sampaikan. Besar harapan kami untuk dapat bekerja sama. Apabila Bapak/Ibu memerlukan informasi tambahan, jangan ragu untuk menghubungi kami.

Atas perhatian dan kerja samanya, kami ucapkan terima kasih.

Hormat kami,
**{{nama_perusahaan_pengirim}}**

<br><br><br>

**{{nama_penanda_tangan}}**
{{jabatan_penanda_tangan}}
{{kontak_penanda_tangan}}
```

---

## Template — English

```markdown
# PRICE QUOTATION

**Reference No.:** {{ref_no}}
**Date:** {{date}}
**Subject:** {{subject}}

---

**To:**
{{recipient_name}}
{{recipient_title}}
{{recipient_company}}
{{recipient_address}}

---

Dear {{recipient_salutation}},

Following {{brief_context}}, **{{sender_company}}** is pleased to submit the following price quotation for {{scope_summary}}:

## Items / Services

| No. | Description | Qty | Unit | Unit Price | Subtotal |
|----:|-------------|----:|:----:|-----------:|---------:|
| 1   | {{description_1}} | {{qty_1}} | {{unit_1}} | {{price_1}} | {{subtotal_1}} |
| 2   | {{description_2}} | {{qty_2}} | {{unit_2}} | {{price_2}} | {{subtotal_2}} |

|  | **Subtotal** | **{{subtotal_total}}** |
|--|--:|--:|
|  | Tax / VAT ({{tax_rate}}%) | {{tax}} |
|  | Discount | {{discount}} |
|  | **Total** | **{{total}}** |

## Terms and Conditions

1. **Quotation Validity:** {{validity}} from the date of this letter.
2. **Payment Terms:** {{payment_terms}}.
3. **Delivery / Lead Time:** {{lead_time}} after PO / down payment is received.
4. **Warranty:** {{warranty}}.
5. Prices are inclusive of applicable taxes unless stated otherwise.
6. Other terms are negotiable upon request.

## Closing

We hope this quotation meets your requirements and look forward to the opportunity to work with you. Please feel free to reach out if you need further clarification.

Thank you for your kind attention.

Sincerely,
**{{sender_company}}**

<br><br><br>

**{{signatory_name}}**
{{signatory_title}}
{{signatory_contact}}
```

---

## Template — Bahasa Indonesia (Services / Jasa)

Use this for jasa pembuatan website/aplikasi, desain interior, branding, konsultasi, event organizer, dll. Struktur ini mengikuti format proposal penawaran jasa yang umum digunakan di Indonesia — lengkap dengan latar belakang, executive summary, pain points, solusi, scope, deliverables, dan tabel biaya berbasis waktu pengerjaan.

Sections yang bersifat opsional (ditandai `[opsional]`) boleh dihilangkan kalau konteks proyek tidak relevan — misalnya, "Technical Architecture" tidak perlu ada untuk proyek desain interior.

```markdown
**Proposal Penawaran Harga Jasa {{nama_perusahaan_pengirim}}**

**{{nama_proyek}}**

No: {{nomor_surat}} &nbsp;&nbsp;&nbsp; **{{kota_pengirim}}, {{tanggal}}**

**Kepada Yth.**
{{nama_divisi_penerima}}
**{{nama_perusahaan_penerima}}**

---

**{{nama_proyek}}**

**Latar Belakang Proyek**

Dengan hormat,

{{paragraf_latar_belakang_proyek}}

**Ringkasan Eksekutif & Sekilas Pandang**

{{paragraf_ringkasan_eksekutif}}

- **Tipe Produk:** {{tipe_produk}}
- **Pengguna:** {{segmen_pengguna}}
- **Platform:** {{platform}}
- **Teknologi:** {{teknologi_utama}}

**Tantangan yang Diselesaikan**

- {{tantangan_1}}
- {{tantangan_2}}
- {{tantangan_3}}

**Solusi Sistem Kami**

{{paragraf_solusi}}

**Ruang Lingkup Pekerjaan**

1. **{{modul_1_nama}}**
   - {{modul_1_fitur_1}}
   - {{modul_1_fitur_2}}
2. **{{modul_2_nama}}**
   - {{modul_2_fitur_1}}
   - {{modul_2_fitur_2}}
3. **{{modul_3_nama}}**
   - {{modul_3_fitur_1}}
   - {{modul_3_fitur_2}}

**Arsitektur Teknis** [opsional — hapus untuk proyek non-teknis]

{{paragraf_arsitektur_teknis}}

**Deliverable Proyek**

- {{deliverable_1}}
- {{deliverable_2}}
- {{deliverable_3}}

**Struktur Biaya Proyek**

Berikut adalah estimasi investasi untuk pengembangan dan implementasi **{{nama_proyek}}**:

| **No** | **Deskripsi Pekerjaan** | **Waktu** | **Biaya (IDR)** |
|-------:|-------------------------|:---------:|----------------:|
| 1 | **{{paket_1_nama}}** *{{paket_1_deskripsi_singkat}}* | {{paket_1_waktu}} | {{paket_1_biaya}} |
| 2 | **{{paket_2_nama}}** *{{paket_2_deskripsi_singkat}}* | {{paket_2_waktu}} | {{paket_2_biaya}} |
| 3 | **{{paket_3_nama}}** *{{paket_3_deskripsi_singkat}}* | {{paket_3_waktu}} | {{paket_3_biaya}} |
| **TOTAL INVESTASI** | | **{{total_waktu}}** | **{{total_biaya}}** |

Keterangan:

1. Biaya yang diajukan {{status_pajak}} *(contoh: "tidak termasuk Pajak (PPN 11%)" atau "sudah termasuk PPN 11%")*
2. Termin pembayaran:
   1. Termin ke-1: {{termin_1_persen}}% sebagai DP
   2. Termin ke-2: {{termin_2_persen}}% {{termin_2_kondisi}}
   3. Termin ke-3: {{termin_3_persen}}% {{termin_3_kondisi}}

**Garansi**

{{paragraf_intro_garansi_singkat}}

1. {{ketentuan_garansi_1}}
2. {{ketentuan_garansi_2}}
3. {{ketentuan_garansi_3}}
4. Perubahan dan/atau penambahan di luar lingkup yang tertera akan didiskusikan biaya dan waktunya secara terpisah.

**Penutup**

{{paragraf_penutup}}

Demikian surat penawaran ini kami sampaikan. Kami sangat menantikan kesempatan untuk berdiskusi lebih lanjut.

Hormat Kami,

<br><br><br>

**{{nama_penanda_tangan}}**
[{{jabatan_penanda_tangan}}]
```

---

## Template — English (Services)

Same structure as the Indonesian services template, adapted for English-language proposals.

```markdown
**Service Proposal — {{sender_company}}**

**{{project_name}}**

Ref: {{ref_no}} &nbsp;&nbsp;&nbsp; **{{sender_city}}, {{date}}**

**To:**
{{recipient_division}}
**{{recipient_company}}**

---

**{{project_name}}**

**Project Background**

Dear Sir/Madam,

{{project_background_paragraph}}

**Executive Summary**

{{executive_summary_paragraph}}

- **Product Type:** {{product_type}}
- **Users:** {{user_segments}}
- **Platform:** {{platform}}
- **Technology:** {{key_technologies}}

**Challenges We Address**

- {{challenge_1}}
- {{challenge_2}}
- {{challenge_3}}

**Our Solution**

{{solution_overview_paragraph}}

**Scope of Work**

1. **{{module_1_name}}**
   - {{module_1_feature_1}}
   - {{module_1_feature_2}}
2. **{{module_2_name}}**
   - {{module_2_feature_1}}
   - {{module_2_feature_2}}
3. **{{module_3_name}}**
   - {{module_3_feature_1}}
   - {{module_3_feature_2}}

**Technical Architecture** [optional — remove for non-technical projects]

{{technical_architecture_paragraph}}

**Project Deliverables**

- {{deliverable_1}}
- {{deliverable_2}}
- {{deliverable_3}}

**Project Cost Structure**

The following is the estimated investment for the development and implementation of **{{project_name}}**:

| **No** | **Work Package** | **Duration** | **Cost (IDR)** |
|-------:|------------------|:------------:|---------------:|
| 1 | **{{package_1_name}}** *{{package_1_short_desc}}* | {{package_1_duration}} | {{package_1_cost}} |
| 2 | **{{package_2_name}}** *{{package_2_short_desc}}* | {{package_2_duration}} | {{package_2_cost}} |
| 3 | **{{package_3_name}}** *{{package_3_short_desc}}* | {{package_3_duration}} | {{package_3_cost}} |
| **TOTAL INVESTMENT** | | **{{total_duration}}** | **{{total_cost}}** |

Notes:

1. Quoted prices {{tax_status}} *(e.g. "exclude VAT (11%)" or "include VAT (11%)")*
2. Payment milestones:
   1. Milestone 1: {{milestone_1_pct}}% as down payment
   2. Milestone 2: {{milestone_2_pct}}% {{milestone_2_condition}}
   3. Milestone 3: {{milestone_3_pct}}% {{milestone_3_condition}}

**Warranty**

{{warranty_intro_sentence}}

1. {{warranty_term_1}}
2. {{warranty_term_2}}
3. {{warranty_term_3}}
4. Any changes or additions outside the defined scope will be discussed and agreed upon separately in terms of cost and timeline.

**Closing Remarks**

{{closing_paragraph}}

We look forward to the opportunity to discuss this proposal further.

Sincerely,

<br><br><br>

**{{signatory_name}}**
[{{signatory_title}}]
```

---

## Notes on Pandoc-friendly Markdown

A few small choices in the templates above keep conversion smooth:

- **No raw HTML except `<br>`** — most converters handle line breaks but choke on arbitrary tags. Three `<br>` for signature space is the safest portable trick.
- **GFM tables only** — no merged cells, no colspan tricks. If you need more complex layouts in `.docx`, post-process there.
- **No emoji anywhere** — this is a formal business document. No emoji in headings, bullets, or body text. Use bold labels instead of icons.
- **Use `**bold**` and `*italic*`** — avoid `__` and `_` underscores around words containing numbers/IDs (Pandoc occasionally treats them as subscripts in some modes).
- **Currency formatting is plain text**, not a code block — code blocks survive conversion but render in monospace, which looks wrong in a formal letter.

If the user later asks for a fancier visual layout, that's a `.docx` template / Typora theme problem — not a Markdown problem.

## Common pitfalls

- **Don't invent line items.** If the user hasn't given specifics, leave bracket placeholders (`[Deskripsi item]`) rather than guessing — a wrong item is worse than a placeholder.
- **Don't forget the tax assumption.** In Indonesia, PPN is 11% as of 2026. If the quote is for an export client or the user explicitly says "tanpa PPN", set tax to 0 and remove the line.
- **Match the language end-to-end.** Don't mix "Subtotal" headings in English with "Hormat kami" in Indonesian. Pick one and commit.
- **Verify arithmetic.** Recompute totals once before writing the file. This is the single biggest failure mode for quotation documents.
- **Scope of Work harus konkret.** Tulis fitur/modul sebagai daftar yang bisa dicentang ("Sistem RBAC dengan 3 role: Admin, Editor, Viewer" — bukan "manajemen pengguna yang canggih"). Scope yang ambigu = revisi tak berujung.
- **Deliverables ≠ Scope.** Scope = apa yang dikerjakan. Deliverables = apa yang diserahkan ke klien (dokumen, source code, akun staging, manual book, dll). Keduanya harus ada di template jasa.
- **Tabel biaya jasa pakai kolom Waktu + Biaya, bukan Qty/Satuan/Harga Satuan.** Jangan campur format tabel goods ke services — tampilannya janggal dan tidak sesuai ekspektasi klien.
- **Persentase termin harus = 100%.** Cek DP% + mid% + final% sebelum menulis file.
- **Warranty jangan salin-tempel generik.** Sesuaikan dengan jenis proyek: "bugfix selama perusahaan berdiri" cocok untuk software; untuk desain interior mungkin lebih relevan "garansi revisi minor 30 hari setelah serah terima".
