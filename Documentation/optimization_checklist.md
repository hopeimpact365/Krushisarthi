# Krushi Sarthi - Optimization Checklist

This checklist outlines core areas where the website can be optimized to improve performance, search engine rankings (SEO), page load times, and accessibility.

---

## 🚀 1. Next.js & Frontend Performance

- [x] **Migrate to `next/image`**
  - **Issue:** All pages (Hero banner, story section, products, impact page) are currently using standard HTML `<img>` tags.
  - **Why:** The HTML `<img>` tag does not optimize images. It serves the full size, does not compress to modern formats like WebP or AVIF, and lacks layout shift placeholders.
  - **Solution:** Import `Image` from `"next/image"` and replace `<img>` tags. Define specific sizes or use `fill` with `object-fit: cover/contain` to serve responsive formats.

- [x] **Implement Next.js Google Font Optimization**
  - **Issue:** Google fonts are imported via `@import url(...)` at the top of `globals.css`.
  - **Why:** `@import` is render-blocking. The browser must fully fetch and parse `globals.css`, then make a new HTTP request to Google Fonts, slowing down the page rendering process.
  - **Solution:** Import `Playfair_Display` and `DM_Sans` using `next/font/google` in `layout.tsx`. Set their classes on the HTML body. This self-hosts the fonts at build time and eliminates layout shifts (CLS).

- [x] **Lazy Load Heavy Client-Side Libraries**
  - **Issue:** Large libraries like `jspdf`, `jspdf-autotable`, and `xlsx` (Excel export) are statically imported at the top of the admin page.
  - **Why:** These libraries add hundreds of kilobytes of JavaScript. Even if code-split, loading them immediately blocks or slows down page interactive speeds.
  - **Solution:** Use dynamic imports (`next/dynamic` or `await import("xlsx")`) to defer loading these libraries until the user actually clicks the "Export" or "Download PDF" buttons.

---

## 🔍 2. SEO (Search Engine Optimization)

- [ ] **Add Page-Specific Metadata**
  - **Issue:** Subpages (`/select-products`, `/our-story`, `/impact`, `/gallery`, `/track`) are missing page-specific metadata. They all fall back to the generic home page title.
  - **Why:** Custom titles and descriptions are critical for keywords and click-through rates on search engine result pages.
  - **Solution:** Export a `metadata` object in each page file:
    ```typescript
    export const metadata: Metadata = {
      title: "Shop Organic Jaggery | Krushi Sarthi",
      description: "Pre-book 100% pure, chemical-free Kolhapuri Jaggery directly from our 132-farmer cooperative.",
    };
    ```

- [ ] **Verify Header Semantic Hierarchy**
  - **Issue:** Search engine crawler bots index pages based on heading order.
  - **Why:** Ensure there is only **one** `<h1>` tag per page, followed by sequential `<h2>`, `<h3>` tags. Check pages to confirm header tags don't jump levels (e.g. going from `<h1>` directly to `<h4>`).

---

## ♿ 3. Accessibility (a11y) & UX

- [ ] **Add Image Loading Skeleton Placeholders**
  - **Issue:** On slow 3G/4G connections, images load line-by-line, causing content underneath to jump down (Layout Shift).
  - **Why:** Cumulative Layout Shift (CLS) is a major Google Web Vitals ranking factor.
  - **Solution:** Provide loading skeleton blocks or Next.js `placeholder="blur"` for key hero and product images.

- [ ] **Verify Color Contrast & Touch Target Sizes**
  - **Issue:** Ensure links/buttons (especially on mobile) have a minimum height/width of `44px` (or `48px` according to WCAG guidelines) so they are easy to click.
  - **Why:** Prevents accidental misclicks and satisfies mobile-friendly guidelines.

---

## 💻 4. Code & Build Optimization

- [x] **Strict Production Bundle Review**
  - [x] Verify `productionBrowserSourceMaps` is omitted or set to `false` in `next.config.ts` so original source code remains hidden.
  - [ ] Run `npm run build` and check the generated bundle sizes in the terminal. Identify any route that exceeds the 100kb threshold and code-split long custom components.
