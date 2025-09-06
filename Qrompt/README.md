## Qrompt

Chrome extension + proxy server to prompt AI and paste results.

### Extension (Manifest V3)
1. Open Chrome → go to `chrome://extensions` → enable Developer mode.
2. Click "Load unpacked" and select the `extension` folder.
3. Click the Qrompt icon to open the popup.
4. Right-click selected text → "Qrompt: Send selection to AI".

### Server (Node.js)
Requirements: Node 18+

```bash
cd server
copy .env.example .env  # On Windows PowerShell: copy .env.example .env
npm install
npm run dev
```

Server runs on `http://localhost:8787` by default.

### Configure Extension
1. Open the extension's Settings (Options page).
2. Set Server URL to `http://localhost:8787`.
3. If you set `AUTH_TOKEN` in `.env`, paste the same token into "Auth Token".

### How It Works
- Popup sends a prompt to background.
- Background calls the proxy server (`/v1/generate`).
- Output is shown in popup and copied to clipboard; content script can insert into fields.

### Subscription (Stub)
- `GET /v1/subscription/check` returns `{ active: true }` for now.
- Replace with real checks (Stripe) when ready.

