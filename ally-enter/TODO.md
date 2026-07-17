# TODO - Rename routes to `/auth/*`

## Plan confirmation
- [x] Enforce auth via `enterprise/components/AuthGuard.js`
- [x] Improve API login error JSON handling in `backend/app/Http/Controllers/Auth/AuthenticatedSessionController.php`

## Route rename refactor (`/pay` -> `/auth/pay`, etc.)
- [ ] Create mapping for all top-level pages under `enterprise/app/**`
- [ ] Move/duplicate Next.js page folders to `enterprise/app/auth/**` equivalents
- [ ] Update all `router.push(...)` and `<Link href="...">` references across `enterprise/components/**` and `enterprise/app/**`
- [ ] Update any guard logic relying on pathname prefixes
- [ ] Validate build by searching for old route strings
- [ ] Smoke test key routes: `/auth/login`, `/auth/pay-step/step-1`, `/auth/pay/step-3`, `/auth/dashboard`

