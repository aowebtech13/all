# TODO

## Fix: deposit receipt required but no upload in deposit-money step-3
- [x] Inspect backend validation requirements for `/api/deposit` (receipt required)

- [x] Update `software/components/depositMoney/StepThree.jsx` to include receipt upload UI + FormData submission
- [x] Reuse existing upload component if available (or create a minimal one)

- [x] Ensure request matches backend fields: `amount`, `method`, `description`, `receipt`
- [x] Basic client-side validation (file required, type image, max 2MB)


- [x] Test flow: submit deposit without receipt -> expect validation error; submit with receipt -> success





