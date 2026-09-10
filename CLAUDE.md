# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

SOIS Store storefront — the customer-facing Next.js app for a jewellery e-commerce platform. Checkout is drawer-based (`src/components/drawers/CartDrawer.tsx` drives cart → shipping → review → confirmation as one component, not separate pages). Talks to the `sois-backend` Django API under `/api/v1/`.

## Deployment — commit before deploy, always

Production runs on the `sois` server (SSH alias `sois`), at `/var/www/sois-frontend`, as an actual git clone on branch `main` (remote `origin`, `github.com/Madhesh03/sois-frontend`), served by pm2 process `sois-frontend`.

**Every deploy, without exception, follows this order:**

1. Commit the change locally and `git push origin main`. Never leave a fix as an uncommitted local edit that only exists on the server, or vice versa — the two must never diverge.
2. On the server: `cd /var/www/sois-frontend && git fetch origin main && git reset --hard origin/main`.
3. `npm install` (only needed if package.json/lock changed), then `npm run build`.
4. `pm2 restart sois-frontend`.
5. Verify: `curl -s -o /dev/null -w '%{http_code}\n' https://app.soisstore.com/` should return 200.

Never skip step 1 to "save time" — a change that's live but not committed is a change that will be silently lost or contradicted the next time this repo is synced from git.

Restarting the pm2 process is a production action with brief downtime — confirm with the user before rebuilding/restarting, same as any other risky/production-affecting action.

## Related repos

This storefront talks to `sois-backend` (Django API) and shares the customer with the separate `Admin` portal (staff-facing, different auth space entirely — staff and customer JWTs are never interchangeable). Each repo has its own `CLAUDE.md` with the same deployment rule.
