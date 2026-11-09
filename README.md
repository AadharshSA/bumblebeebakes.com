# BumbleBee Bakes: home bakery website

An editorial, pastel, mobile-first one-page site for a small home bakery. It's built with **React + Vite + Tailwind CSS**, and a tiny **Node/Express** backend stores form submissions.
The type pairs Playfair Display headlines with DM Sans body text and DM Mono labels. Copy is Lorem Ipsum, and every photo slot is a camera-icon placeholder. The category illustrations are original inline SVGs.

**Page flow:** 01 Hero → 02 Lineup (categories) → 03 Bestsellers (filterable) → 04 Custom-cake banner → 05 Enquiry form (one short form: name, WhatsApp, message; the rest optional) → 06 Gallery (filters + lightbox) → 07 Our story → 08 Kind words + Instagram → 09 Contact details (WhatsApp, email, Instagram).
Each product also has its own detail view at `#product-<id>`.

## Quick start

```bash
npm install                 # frontend deps
cd server && npm install    # backend deps
cd ..

# Terminal 1: backend on :4000
npm run server

# Terminal 2: frontend on :5173 (proxies /api to :4000)
npm run dev
```

For production, run `npm run build` and then `npm run server`. The server also serves `dist/`, so one process runs the whole site.

## Where to edit things

| What | File |
|---|---|
| Bakery name, **WhatsApp number**, phone, city, Instagram link, nav | `src/config/site.js` |
| Cake form occasions | `src/config/site.js` → `cakeOptions` |
| Product & category illustrations (14 original SVGs) | `src/components/Illustrations.jsx` (pick one per product with `art:` in `products.js`) |
| Bee, logo mark, asterisk | `src/components/Art.jsx` |
| Products, categories, prices | `src/data/products.js` |
| Gallery items | `src/data/gallery.js` |
| Testimonials (**placeholders, so replace them only with real reviews**) | `src/data/testimonials.js` |
| Colours / fonts / shadows | `tailwind.config.js` |

**WhatsApp number:** use international format with digits only, for example `91XXXXXXXXXX`. You can also set `VITE_WHATSAPP_NUMBER` at build time.

**Real photos:** add `image: '/images/file.jpg'` to a product or gallery item and put the file in `public/images/`. The photo then replaces that item's illustration automatically.

## WhatsApp ordering

`src/lib/whatsapp.js` builds standard click-to-chat links (`https://wa.me/<number>?text=<message>`):
- **Product pages:** the prefilled message includes the product name, quantity and the customer's note.
- **Cake enquiry:** the full set of booking details plus a reference number.
- **Contact:** subject and message.
- There's also a floating chat button on every page.

## Forms & backend

`server/index.js`:

| Endpoint | Purpose |
|---|---|
| `POST /api/enquiries` | multipart; validates name, WhatsApp number and message, stores it, saves the optional reference photo (≤ 5 MB) |
| `GET /api/submissions?key=ADMIN_KEY` | JSON list for the owner (disabled if `ADMIN_KEY` is empty) |
| `GET /api/health` | health check |

- **Storage:** JSON Lines files in `server/data/` (`cake-enquiries.jsonl`, `contact.jsonl`, `uploads/`). To swap in SQLite, Postgres or Supabase, re-implement `save`/`list` in `server/store.js`.
- **Notifications:** copy `server/.env.example` to `server/.env` and configure any of these: SMTP email (with the reference image attached), a generic webhook (Slack/Discord/Zapier/Make/n8n), or a Telegram bot. If nothing is configured, new submissions are printed to the server log.
- **Spam protection:** basic validation, size limits and an in-memory rate limit (10 posts per 10 min per IP).
- Cake enquiries are stored with `status: "new"`. **Nothing is ever auto-confirmed.** The owner confirms availability and price on WhatsApp.

### Integration point (frontend)
`src/lib/api.js` → `submitForm(endpoint, data, file)` is the single integration point. It returns `{ stored: true, id }` only when the backend confirms the save.
If no backend is reachable (or `VITE_API_URL=off`), the UI says so honestly: *"your enquiry has not been saved"*. It then offers to send the prepared message on WhatsApp instead. It never pretends the submission was stored.

- To host the frontend separately (e.g. Netlify/Vercel), build with `VITE_API_URL=https://your-api.example.com` and set `CORS_ORIGIN` on the server.
- To use a hosted form service instead (Formspree, Supabase, Firebase, Google Sheets), replace the body of `submitForm` and keep the same return shape.

## Routing
It's a one-page site. Nav links are plain section anchors (`#products`, `#story`, `#gallery`, `#cake-form`, `#contact`), and `#product-<id>` opens a product's detail view. No rewrite rules are needed on any static host.

## Builds
- `npm run build`: a standard production build in `dist/`.
- `npm run build:single`: one self-contained `dist-single/index.html`, handy for sharing a preview. Build it with `VITE_API_URL=off` so the forms run in the honest no-backend mode.

## Accessibility & UX notes
- Skip link, semantic landmarks, a nav that highlights the section in view, and a keyboard-accessible mobile menu (Esc closes it).
- Labelled form fields, inline errors linked with `aria-describedby`, and focus moves to the first error.
- The lightbox supports Esc, arrow keys and swipe, and focus returns when it closes.
- Respects `prefers-reduced-motion`.

## Not included (by design)
There's no customer accounts, cart/checkout, inventory, delivery tracking or subscriptions.

## Going live on Netlify (bumblebeebakes.com)

The site is set up for **Netlify Forms**: enquiries are stored by Netlify and emailed to you, and no server is needed.

**Option A: drag and drop.** Build with `VITE_FORMS=netlify npm run build`, then drag the `dist` folder onto Netlify (Add new site → Deploy manually). The ready-built folder `bumblebeebakes-site/` is exactly this.
**Option B: GitHub.** Push this repo and import it in Netlify. `netlify.toml` already sets the build command, the publish folder and `VITE_FORMS=netlify`.

After the first deploy:
1. In **Forms**, enable form detection, then deploy again. Netlify reads the hidden forms in `index.html`. If you add a field to a React form, add it there too.
2. Under **Forms → Form notifications**, add an email notification for the `enquiry` form (send it to bumblebeebakes.cbe@gmail.com).
3. Under **Domain management → Add a domain**, enter `bumblebeebakes.com`. Netlify shows the DNS records to add at your registrar: an A record for the bare domain and a CNAME for `www`. HTTPS is issued automatically once DNS resolves.

Use the A/CNAME records rather than switching nameservers if you have email on the domain through your registrar, so the email keeps working.

## Enquiry delivery: WhatsApp + Gmail (`netlify/functions/send-enquiry.mjs`)

Pressing **Send enquiry** delivers the enquiry to the bakery immediately. The visitor doesn't need to open WhatsApp.

1. **WhatsApp alert** to your phone via CallMeBot. This is free, for personal use, and can only message your own number.
2. **Email to your Gmail**, sent from your own account. It includes the bee illustration, all the details, the reference photo attached, and a "Reply on WhatsApp" button. If the WhatsApp alert failed, the email is marked ⚠️ so you know the email is your only copy.
3. A **record in Netlify Forms** (the hidden form in `index.html`), saved at the same time.

The visitor sees "Your enquiry has reached us" when at least one of these worked. Only when all of them fail (for example, their internet dropped) are they asked to send it on WhatsApp, with the message already written.

Photos are shrunk in the browser (max 1600px JPEG) before upload, so they fit the 4 MB function limit.

The function needs a **Git (GitHub) or Netlify CLI deploy**. Drag-and-drop deploys don't run functions.

Environment variables (Netlify → Site configuration → Environment variables):

| Variable | Value |
|---|---|
| `GMAIL_USER` | bumblebeebakes.cbe@gmail.com |
| `GMAIL_APP_PASSWORD` | 16-character Google App Password (Google Account → Security → 2-Step Verification on → App passwords) |
| `NOTIFY_TO` | optional, where to send; defaults to `GMAIL_USER` |
| `CALLMEBOT_PHONE` | 917538877111 |
| `CALLMEBOT_APIKEY` | key CallMeBot sends you after you message it "I allow callmebot to send me messages" |
| `EMAIL_ONLY_IF_WHATSAPP_FAILS` | optional, `true` = email only as a backup; default sends the email every time |

Check **Logs → Functions → send-enquiry**. Every enquiry logs `whatsapp=sent/failed email=sent/failed`.
