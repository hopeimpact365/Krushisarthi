# Design Specification: Pure Natural Jaggery & Payment Processing System

This document captures the complete design system, user flow, component structures, assets, and business logic of the Pure Natural Jaggery ordering application. Use this context to replicate the identical user experience and visual design in any other platform or programming language (e.g., Flutter, Vue, Swift, SwiftUI, Kotlin, etc.).

---

## 1. Design Tokens & Theme Configuration

### Color Palette (Stone & Amber Theme)
The application relies on a warm, earthy, and organic color scheme representing sugarcane and traditional jaggery production.

| Token | Light Mode Value | Dark Mode Value (Fallback) | Description / Usage |
| :--- | :--- | :--- | :--- |
| **`--background`** | `#fafaf9` (Stone 50) | `oklch(0.145 0 0)` | Overall page background |
| **`--foreground`** | `#292524` (Stone 800) | `oklch(0.985 0 0)` | Primary body text color |
| **`--primary`** | `#78350f` (Amber 900) | `oklch(0.985 0 0)` | Key CTA buttons, main accents, active highlights |
| **`--primary-foreground`**| `#fef3c7` (Amber 100) | `oklch(0.205 0 0)` | Text/icons inside primary buttons |
| **`--card`** | `#ffffff` (White) | `oklch(0.145 0 0)` | Card and form container background |
| **`--card-foreground`** | `#292524` (Stone 800) | `oklch(0.985 0 0)` | Heading/body text inside cards |
| **`--secondary`** | `#f5f5f4` (Stone 100) | `oklch(0.269 0 0)` | Secondary buttons, neutral badges |
| **`--secondary-foreground`**| `#292524` (Stone 800) | `oklch(0.985 0 0)`| Text/icons inside secondary containers |
| **`--muted`** | `#f5f5f4` (Stone 100) | `oklch(0.269 0 0)` | Disabled/unfocused elements |
| **`--muted-foreground`** | `#78716c` (Stone 500) | `oklch(0.708 0 0)` | Placeholder texts, subtitles, captions |
| **`--accent`** | `#fef3c7` (Amber 100) | `oklch(0.269 0 0)` | Highlighted banners, promo badges |
| **`--accent-foreground`** | `#78350f` (Amber 900) | `oklch(0.985 0 0)` | Text inside highlights |
| **`--destructive`** | `#dc2626` (Red 600) | `oklch(0.396 0.141 25.723)`| Error states, warnings, deletes |
| **`--destructive-foreground`**| `#ffffff` | `oklch(0.637 0.237 25.331)`| Text inside error alerts |
| **`--border`** | `#e7e5e4` (Stone 200) | `oklch(0.269 0 0)` | Borders on cards, inputs, dividers |
| **`--input-background`** | `#fafaf9` (Stone 50) | N/A | Form fields background |
| **`--switch-background`**| `#d6d3d1` (Stone 300) | N/A | Toggle switch background track |
| **`--ring`** | `#78350f` (Amber 900) | `oklch(0.439 0 0)` | Focus ring color |

### Typography Rules
* **Font Family:** Inter, System-UI, or Sans-Serif.
* **Base Font Size:** `16px` (`1rem`).
* **Weights:** Normal (`400`), Medium (`500`), Bold (`700`).

| Level | Size | Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **H1** | `1.5rem` (`24px`) to `2.25rem` (`36px`) | Medium / Bold | 1.5 |
| **H2** | `1.25rem` (`20px`) to `1.875rem` (`30px`)| Medium | 1.5 |
| **H3** | `1.125rem` (`18px`) | Medium | 1.5 |
| **H4** | `1.0rem` (`16px`) | Medium | 1.5 |
| **Body / Label / Button** | `1.0rem` (`16px`) | Normal / Medium | 1.5 |
| **Caption / Small** | `0.875rem` (`14px`) | Normal | 1.5 |

### Shapes & Shadows
* **Corner Radius:**
  * Base Radius (`--radius`): `0.5rem` (`8px`) - used for standard buttons, cards, input fields.
  * Small Radius (`--radius-sm`): `0.25rem` (`4px`).
  * Large Radius (`--radius-lg`): `0.5rem` (`8px`).
  * Extra Large Radius (`--radius-xl`): `0.75rem` (`12px`).
* **Shadows:** Subtle shadows on cards (e.g., `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`), transitions on hover to increase shadow size slightly.

---

## 2. Key Icons & Graphic Assets

### Icons (Lucide-based)
* `Leaf`: Brand logo representation, jaggery farming indicator. (Used in Headers, Cards, Buttons).
* `Award`: Represents quality assurance / certification.
* `TruckIcon` / `Truck`: Delivery indicators.
* `ShieldCheck`: Trust badge/insurance indicators.
* `Sprout`: Growth steps, farm plot metrics, farming actions.
* `MapPin`: Location indicators, shipping addresses.
* `Calendar`: Delivery estimation, time durations.
* `ShoppingCart`: Summary indicator, shopping cart icon.
* `CheckCircle2` / `CheckCircle`: Completed phases, successful states.
* `Minus`, `Plus`: Quantity controls.
* `Smartphone`: Verification step.
* `User`: Personal info section.
* `CreditCard`: Payments section.
* `Tag`: Promo code area.
* `Download`: Receipt printout icon.
* `MessageSquare`: WhatsApp/SMS/Email notifications icon.
* `Mail` / `Phone`: Customer contact fields.

### Unsplash Image Directory
Below are the exact image URLs used to display farm-fresh organic aesthetics:

| Context | Unsplash Image URL | Description |
| :--- | :--- | :--- |
| **Hero Background** | `https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920` | Sugarcane farm field, wide angle |
| **Jaggery Bars** | `/images/bars.png` | Traditional solid jaggery bars |
| **Jaggery Cubes** | `/images/cubes.png` | Refined square jaggery cubes |
| **Jaggery Powder** | `/images/powder.png` | Ground jaggery powder |
| **Farm Gallery - Plantation** | `https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200` | Green plantation rows |
| **Farm Gallery - Harvest** | `https://images.unsplash.com/photo-1709535349666-1f9eb563b3cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200` | Agricultural workers cutting cane |
| **Farming Step 1 (Planting)** | `https://images.unsplash.com/photo-1606707761801-0d68d6bdffdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400` | Sugarcane stems planted in mud |
| **Farming Step 2 (Growing)** | `https://images.unsplash.com/photo-1606707761700-86b58f251a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400` | Mid-stage growing cane stalks |
| **Farming Step 3 (Harvesting)**| `https://images.unsplash.com/photo-1709535349666-1f9eb563b3cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400` | Workers load harvested cane |
| **Farming Step 4 (Processing)**| `https://images.unsplash.com/photo-1696158971473-2aff3d515a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400` | Extracting sugarcane juice boiling |

---

## 3. Product Catalog & Pricing Logic

| Product ID | Name | Type | Price per kg | Quantity Increments | Max Weight Constraint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bar` | **Jaggery Bar** | `bar` | ₹199 / kg | 0.5 kg steps | 5.0 kg combined limit |
| `cube` | **Jaggery Cube** | `cube` | ₹249 / kg | 0.5 kg steps | 5.0 kg combined limit |
| `powder` | **Jaggery Powder** | `powder`| ₹249 / kg | 0.5 kg steps | 5.0 kg combined limit |

### Global Checkout Math
* **Subtotal** = $\sum (\text{Quantity} \times \text{PricePerKg})$
* **GST** = $5\%$ of Subtotal (represented as CGST $2.5\%$ and SGST $2.5\%$)
* **Delivery Fee** based on Zone:
  * `local` (Same city): **₹50**
  * `state` (Within state): **₹100**
  * `national` (Out of state): **₹200**
* **Coupon Discounts** (Flat deduction):
  * Code `SALES10` $\rightarrow$ **-₹100**
  * Code `SALES20` $\rightarrow$ **-₹200**
  * Code `EMPLOYEE50` $\rightarrow$ **-₹500**
* **Total Paid** = $\text{Subtotal} + \text{GST} + \text{Delivery Fee} - \text{Discount}$ (Minimum ₹0)

---

## 4. UI Layout & Page-by-Page Specifications

### Page 1: Home (`/`)
1. **Hero Section:**
   * Overlaying translucent background image of sugarcane fields (opacity: `20%`).
   * Large centered headers: "Pure Natural Jaggery" (H1, size `text-5xl`).
   * Central leaf icon (height/width: `64px`, color: `amber-900`).
   * Primary Button: "Book Your Farm Plot" (bg: `amber-900`, hover: `amber-950`).
2. **Features Grid:**
   * Three cards: "100% Pure", "Fast Delivery", "Quality Assured".
   * White backgrounds, subtle border `stone-200`, centered icons, descriptive text under titles.
3. **Product Showcase:**
   * Three columns displaying Jaggery Bar, Jaggery Cube, Jaggery Powder.
   * Images scale up on hover (`scale-105`) with a smooth 300ms transition.
   * Pricing text styled in `amber-900`.

### Page 2: Product Selection (`/select-products`)
1. **Header:** H1 "Select Your Jaggery" + Subheading about 5kg restriction limit.
2. **Product Cards Grid:**
   * Shows a square image, title, and rate (₹/kg).
   * **Quantity Control Row:** A minus button, large text displaying quantity, and a plus button. Increments/decrements in steps of `0.5`.
   * **Numeric Input Option:** A text field with placeholder "Or enter quantity (kg)" allowing manual entry up to `5.0`.
   * Real-time calculation showing subtotal for each card (e.g., `₹(qty * price)`).
3. **Sticky Summary Card:**
   * Displays subtotal, current total weight.
   * Disables checkout and warns the user with a destructive red banner (`AlertCircle` icon) if combined weight exceed `5.0 kg`.
   * Navigation links: "Back to Home" (secondary) and "Proceed to Checkout" (primary).

### Page 3: Checkout Flow (`/checkout`)
This page handles information using a 3-step progress wizard:
```
[ Step 1: Verify Mobile ] ───> [ Step 2: Delivery Details ] ───> [ Step 3: Payment ]
```

#### Step 1: Mobile OTP Verification
* Single input for a **10-digit mobile number** (cleans out non-digit characters).
* "Send OTP" button. Once clicked:
  * Shows a 6-digit OTP verification field (often styled using `InputOTP` slots).
  * Mock system accepts *any* 6-digit number to proceed.
  * Successful OTP entry automatically triggers a success toast notification and increments wizard state to Step 2.

#### Step 2: Delivery Details & Discounts
* **Personal Info Card:** Fields for "Full Name" and "Email Address".
* **Shipping Address Card:** Fields for "Street Address", "City", "State", and "Pincode".
* **Delivery Zone Selection:** Radio buttons to choose between Local (₹50), Within State (₹100), or National (₹200) shipping rates.
* **Coupon Section:** Apply field for promo codes (`SALES10`, `SALES20`, `EMPLOYEE50`) with live validation checks and success messages showing exact savings.
* **Terms Agreement:** A checkbox requiring confirmation of the terms and conditions before proceeding.
* Primary CTA: "Proceed to Payment" (redirects to Step 3).

#### Step 3: Payment Gateway Selection
* Radio cards representing payment options:
  * **UPI Payment:** GPay, PhonePe, Paytm description.
  * **Credit/Debit Card:** Visa, Mastercard, RuPay.
  * **Net Banking:** Supports major bank transfers.
  * **Cash on Delivery (COD).**
* Button text changes dynamically:
  * If COD selected: "Place Order".
  * If digital payment selected: "Pay ₹[Total Amount]".
* Clicking the button generates a mock Order ID (e.g., `JGY1700...`) and navigates to the confirmation page after a short simulated loading delay (`1500ms`).

### Page 4: Confirmation Page (`/confirmation`)
1. **Success Ceremony:** Triggers a colourful confetti explosion (`canvas-confetti` effect) upon loading.
2. **Success Header:** Displays a large green `CheckCircle2` badge alongside the unique Order ID.
3. **Notification Status Panel:** Displays confirmation indicators for Email, SMS, and WhatsApp alerts using active check indicators.
4. **Interactive Tax Invoice (GST Receipt):**
   * Pre-formatted layout featuring complete company registry details (GSTIN, PAN, Kolhapur Address).
   * Generates a printable receipt using a layout that matches real tax invoices:
     * GSTIN: `29AABCU9603R1ZX`
     * PAN: `AABCU9603R`
     * Itemized table mapping rate, quantity, and cost.
     * Taxes: Split evenly into CGST (2.5%) and SGST (2.5%).
     * Amount to Words conversion (e.g., "Five Hundred and Twenty Rupees Only").
   * CTA: **"Download Receipt"** triggers local download of `GST_Receipt_JGYxxx.txt`.
5. **Action Row:** Buttons to "View Your Farm" (primary), "Back to Home", or "Download Receipt".

### Page 5: Virtual Farm (`/my-farm`)
An educational portal visualizing the sugarcane plantation linked to the user's order.
1. **Stats Ribbon:**
   * **Farm Area:** Dynamically calculated as $10\text{ m}^2$ per kg ordered (Minimum of $50\text{ m}^2$).
   * **Order Weight:** Transferred from active context.
   * **Location:** Rural India.
   * **Est. Harvest Cycle:** 10-12 Months.
2. **Farm Gallery Cards:**
   * High-quality sugarcane plantation landscapes overlaid with dark gradients and description texts.
3. **Agricultural Timeline Process (Steps 1 to 4):**
   * **1. Planting:** Stem cuttings planted in rich soil.
   * **2. Growing:** 10-12 months of natural growth.
   * **3. Harvesting:** Hand-cut by skilled farmers.
   * **4. Processing:** Traditional boiling of sugarcane juice.
4. **CTA Row:** "Back to Home" or "Order More Jaggery" (loops user back into funnel).
