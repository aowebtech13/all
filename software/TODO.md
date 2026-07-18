# TODO

## Task: Fix Laravel admin login error (fruitcake/php-cors preg_match delimiter)

- [ ] Confirm root cause by reviewing CORS configuration and middleware usage.
- [ ] Update `backend/config/cors.php` to remove invalid wildcard/`*` usage that breaks fruitcake/php-cors.
- [ ] Run a quick sanity check by invoking PHP autoload and/or starting Laravel to ensure no CORS exceptions on login route.
- [ ] Re-test admin login route `/geyfdv/login` (or the actual failing URL you mentioned) and verify the error is gone.

