# TODO - Seeding fix

- [ ] Update `backend/database/seeders/DemoUsersSeeder.php` to avoid UNIQUE constraint failures on `users.lxp_id` during `php artisan db:seed`.
- [ ] Make seeder idempotent by selecting existing user by `email` first, then by `lxp_id`, and *skipping* demo/admin insertion when `lxp_id` is already taken (per user request).
- [x] Re-run `php artisan db:seed --class=DatabaseSeeder` and confirm seeding completes.


