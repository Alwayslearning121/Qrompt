/* Qrompt service worker - handles context menus and messaging */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "qrompt-selection",
    title: "Qrompt: Send selection to AI",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "qrompt-selection" && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: "QROMPT_SELECTION",
      payload: { text: info.selectionText || "" }
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "QROMPT_GENERATE") {
    generateViaServer(message.payload)
      .then((output) => sendResponse({ ok: true, output }))
      .catch((err) => {
        console.error('Qrompt generate error:', err);
        sendResponse({ ok: false, error: String(err?.message || err) });
      });
    return true; // async response
  }
});

async function generateViaServer(payload) {
  const { prompt, model } = payload || {};
  const { serverUrl, authToken } = await chrome.storage.sync.get(['serverUrl', 'authToken']);
  if (!serverUrl) {
    // Fallback local echo if server not configured
    return `Qrompt (local): ${prompt || ''}`;
  }
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(new URL('/v1/generate', serverUrl).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ prompt, model }),
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.output || '';
  } finally {
    clearTimeout(id);
  }
}

// Keep service worker alive while responding
export {}; // type=module hint

