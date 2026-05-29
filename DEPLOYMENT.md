# Astar Health Service — Deployment Guide

Static site (HTML + CSS + vanilla JS, no build step). Hosted free on **GitHub Pages**, served on the custom domain **astarhealthservice.com.au** bought from GoDaddy. Same workflow used for the Alliance site.

---

## 1. Push the code to GitHub

The local repo is already initialised and committed. Create an **empty** repository on GitHub (no README/.gitignore — they already exist locally), then push.

1. Go to https://github.com/new (sign in as **Arshdeep2705**).
2. Repository name: `astar-health-service` · Visibility: **Public** (required for free GitHub Pages) · do **not** initialise with any files.
3. Back in this folder, connect and push:

```bash
git remote add origin https://github.com/Arshdeep2705/astar-health-service.git
git branch -M main
git push -u origin main
```

---

## 2. Turn on GitHub Pages

1. Repo → **Settings** → **Pages**.
2. **Source:** "Deploy from a branch".
3. **Branch:** `main` · **Folder:** `/ (root)` → **Save**.
4. The `CNAME` file (already in the repo) sets the custom domain to `astarhealthservice.com.au`. GitHub will show it under "Custom domain".
5. Wait ~1–2 min for the first build. The site goes live at `https://arshdeep2705.github.io/astar-health-service/` first, then on the custom domain once DNS resolves (step 3).

> `.nojekyll` is included so GitHub serves the files as-is (no Jekyll processing).

---

## 3. Point the GoDaddy domain at GitHub Pages

In **GoDaddy → My Products → astarhealthservice.com.au → DNS → Manage DNS**, set these records.

**Apex domain (astarhealthservice.com.au)** — four A records to GitHub's IPs:

| Type | Name | Value          | TTL  |
|------|------|----------------|------|
| A    | @    | 185.199.108.153 | 600  |
| A    | @    | 185.199.109.153 | 600  |
| A    | @    | 185.199.110.153 | 600  |
| A    | @    | 185.199.111.153 | 600  |

**www subdomain** — CNAME to the GitHub Pages host:

| Type  | Name | Value                          | TTL |
|-------|------|--------------------------------|-----|
| CNAME | www  | arshdeep2705.github.io         | 600 |

- Delete any default GoDaddy "Parked" A record on `@` and any conflicting `www` CNAME first.
- DNS can take 10 min–48 hr to propagate (usually under an hour).

---

## 4. Enable HTTPS

Once DNS resolves, return to repo **Settings → Pages** and tick **"Enforce HTTPS"** (GitHub auto-issues a free Let's Encrypt certificate — the checkbox becomes available after the cert is provisioned, sometimes up to 24 hr).

---

## 5. Updating the site later

Edit files locally, then:

```bash
git add .
git commit -m "Describe the change"
git push
```

GitHub Pages rebuilds automatically within ~1 minute.

---

## Before go-live checklist (real data required — placeholders are in the code now)

- [ ] **Phone number** — replace placeholder `(03) 0000 0000` / `+61300000000` everywhere (header, footer, contact, CTAs, and the JSON-LD `telephone` in `index.html`). Search the repo for `0000 0000` and `61300000000`.
- [ ] **Email** — confirm `info@astarhealthservice.com.au` is a real, monitored inbox (set up email forwarding in GoDaddy if needed).
- [ ] **Contact form backend** — the form currently shows a simulated success message only; it does **not** send anything. Wire it to a handler (e.g. Formspree, Web3Forms, or Netlify Forms) — see `script.js` form-submit block.
- [ ] **NDIS registration / provider number** — add it to the contact page and footer (legally recommended for a registered provider claim).
- [ ] **Testimonial** — the home-page testimonial is illustrative. Replace with a real, consented quote or remove the section.
- [ ] **Social links** — footer Facebook/Instagram/LinkedIn icons currently point to `#`. Update to real profiles or remove.
- [ ] **Service-area suburbs** — confirm the 17 listed suburbs match the current NDIS registration.

## Compliance note
Copy has been reviewed against the NDIS Code of Conduct, ACL s18, and Meta ad policy (see the compliance check run during the build). It passed with the recommended revisions applied. Re-run the check if you materially change marketing copy, and **do not** reuse the second-person ("you/your") website copy verbatim in paid Meta ads — rewrite to third person for those placements.
