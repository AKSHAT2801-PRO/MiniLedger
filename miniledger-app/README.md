# MiniLedger (Expo + React Native)

Frontend only. Track money lent to friends: phone + OTP login, loan list with overdue highlighting, summary card, add-loan form with optional receipt photo.

## Run

```bash
npm install
# edit .env and set EXPO_PUBLIC_API_URL to your backend
npx expo start -c
```

Open it in Expo Go (iOS/Android). The date picker and camera are mobile-only, so use a phone or emulator rather than the web target.

## Backend URL (`.env`)

```
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
```

| Where you run the app | Use |
| --- | --- |
| Physical phone (same Wi-Fi) | your computer's LAN IP, e.g. `http://192.168.1.10:3000` |
| Android emulator | `http://10.0.2.2:3000` |
| iOS simulator | `http://localhost:3000` |

Restart with `npx expo start -c` after changing it.

## API contract the app expects

All calls are in `src/api.ts`, so this is the one file to edit if your routes differ. There's no JWT: after OTP verification the phone number is saved on the device and sent as an `x-phone-number` header on every request.

| Action | Request |
| --- | --- |
| Send OTP | `POST /auth/send-otp` `{ phone }` |
| Verify OTP | `POST /auth/verify-otp` `{ phone, otp }` (any 2xx = logged in) |
| List loans | `GET /loans/:phone` → array of `{ id, friendName, amount, dueDate, isRepaid, receiptUrl? }` |
| Add loan | `POST /loans` JSON `{ friendName, phone, amount, dueDate }`, or multipart with `friendName`, `phone`, `amount`, `dueDate`, and an optional `receipt` file |
| Mark repaid | `PATCH /loans/:phone/:friend/repay` |
| Summary | `GET /summary/:phone` → `{ totalLent, totalRepaid, overdueAmount }` |

`dueDate` is `YYYY-MM-DD`. snake_case fields (`friend_name`, `due_date`, `is_repaid`, `receipt_url`, `total_lent`, ...) and numeric strings from Postgres are also accepted.

## Structure

```
app/            Expo Router screens: login, index (home), add (modal)
src/api.ts      all backend calls + env URL
src/auth.tsx    saved-login context (AsyncStorage)
src/validation.ts  phone / OTP / name / amount checks, date helpers
src/components/ SummaryCard, LoanItem, Button + Field
```
