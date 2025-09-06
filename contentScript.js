/* Qrompt overlay for AI websites */

const AI_SITES = ['chatgpt.com', 'claude.ai', 'deepseek.com'];

function isAISite() {
  const hostname = window.location.hostname.toLowerCase();
  return AI_SITES.some(site => hostname.includes(site));
}

// Inject overlay if on AI site
if (isAISite()) {
  injectOverlay();
}

function injectOverlay() {
  // Remove existing overlay if any
  const existing = document.getElementById('qrompt-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'qrompt-overlay';
  overlay.innerHTML = `
    <div class="qrompt-container">
      <div class="qrompt-header">
        <img src="${chrome.runtime.getURL('logo.png')}" alt="Qrompt" class="qrompt-logo" />
        <span class="qrompt-title">Qrompt</span>
        <button class="qrompt-close">&times;</button>
      </div>
      <div class="qrompt-content">
        <div class="qrompt-input-group">
          <select id="qrompt-model" class="qrompt-select">
            <option value="dev-basic">Dev Basic</option>
            <option value="image-basic">Image Basic</option>
          </select>
          <textarea id="qrompt-text" placeholder="Ask anything..." class="qrompt-textarea"></textarea>
        </div>
        <div class="qrompt-actions">
          <button id="qrompt-run" class="qrompt-btn qrompt-btn-primary">
            <span class="qrompt-icon">⚡</span>
            Generate
          </button>
          <button id="qrompt-clear" class="qrompt-btn qrompt-btn-secondary">Clear</button>
        </div>
        <div id="qrompt-output" class="qrompt-output"></div>
      </div>
    </div>
  `;

  // Add styles with Poppins font
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    #qrompt-overlay {
      position: fixed;
      top: 20px;
      right: 20px;
      width: 350px;
      max-height: 80vh;
      background: #1A1A1A;
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      border: 1px solid #444444;
    }
    
    .qrompt-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .qrompt-header {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #444444;
      background: #03A9F4;
      color: #FFFFFF;
      border-radius: 12px 12px 0 0;
    }
    
    .qrompt-logo {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    
    .qrompt-title {
      font-weight: 600;
      font-size: 14px;
      flex: 1;
    }
    
    .qrompt-close {
      background: none;
      border: none;
      color: #FFFFFF;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .qrompt-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .qrompt-input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .qrompt-select {
      padding: 8px 12px;
      border: 1px solid #555555;
      border-radius: 6px;
      font-size: 12px;
      background: #333333;
      color: #FFFFFF;
      font-family: 'Poppins', sans-serif;
    }
    
    .qrompt-textarea {
      min-height: 80px;
      padding: 12px;
      border: 1px solid #555555;
      border-radius: 8px;
      resize: vertical;
      font-size: 14px;
      background: #333333;
      color: #FFFFFF;
      font-family: 'Poppins', sans-serif;
    }
    
    .qrompt-textarea:focus {
      outline: none;
      border-color: #03A9F4;
      box-shadow: 0 0 0 3px rgba(3, 169, 244, 0.2);
    }
    
    .qrompt-textarea::placeholder {
      color: #666666;
    }
    
    .qrompt-actions {
      display: flex;
      gap: 8px;
    }
    
    .qrompt-btn {
      padding: 10px 16px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      font-family: 'Poppins', sans-serif;
    }
    
    .qrompt-btn-primary {
      background: #03A9F4;
      color: #FFFFFF;
      flex: 1;
    }
    
    .qrompt-btn-primary:hover {
      transform: translateY(-1px);
      background: #0288D1;
      box-shadow: 0 4px 12px rgba(3, 169, 244, 0.3);
    }
    
    .qrompt-btn-secondary {
      background: #333333;
      color: #AAAAAA;
      border: 1px solid #555555;
    }
    
    .qrompt-btn-secondary:hover {
      background: #555555;
      color: #FFFFFF;
    }
    
    .qrompt-icon {
      font-size: 14px;
    }
    
    .qrompt-output {
      background: #333333;
      border: 1px solid #444444;
      border-radius: 8px;
      padding: 12px;
      min-height: 40px;
      font-size: 13px;
      line-height: 1.4;
      white-space: pre-wrap;
      max-height: 200px;
      overflow-y: auto;
      color: #FFFFFF;
      font-family: 'Poppins', sans-serif;
    }
    
    .qrompt-output:empty::before {
      content: "Output will appear here...";
      color: #666666;
      font-style: italic;
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(overlay);

  // Add event listeners
  setupOverlayEvents(overlay);
}

function setupOverlayEvents(overlay) {
  const closeBtn = overlay.querySelector('.qrompt-close');
  const runBtn = overlay.querySelector('#qrompt-run');
  const clearBtn = overlay.querySelector('#qrompt-clear');
  const textarea = overlay.querySelector('#qrompt-text');
  const modelSelect = overlay.querySelector('#qrompt-model');
  const output = overlay.querySelector('#qrompt-output');

  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });

  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    output.textContent = '';
  });

  runBtn.addEventListener('click', async () => {
    const prompt = textarea.value.trim();
    const model = modelSelect.value;
    
    if (!prompt) {
      output.textContent = 'Please enter a prompt';
      return;
    }

    output.textContent = 'Generating...';
    runBtn.disabled = true;

    try {
      const res = await chrome.runtime.sendMessage({ 
        type: 'QROMPT_GENERATE', 
        payload: { prompt, model } 
      });
      
      if (res?.ok) {
        output.textContent = res.output;
        // Auto-focus on the main textarea of the AI site
        focusAITextarea(res.output);
      } else {
        output.textContent = 'Error: ' + (res?.error || 'Unknown error');
      }
    } catch (err) {
      output.textContent = 'Error: ' + err.message;
    } finally {
      runBtn.disabled = false;
    }
  });

  // Auto-resize textarea
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  });
}

function focusAITextarea(output) {
  // Try to find and focus the main textarea on the AI site
  const textareas = document.querySelectorAll('textarea');
  const mainTextarea = Array.from(textareas).find(ta => 
    ta.offsetHeight > 50 && ta.offsetWidth > 200
  );
  
  if (mainTextarea) {
    mainTextarea.focus();
    // Insert the output at cursor position
    const start = mainTextarea.selectionStart || 0;
    const end = mainTextarea.selectionEnd || 0;
    const val = mainTextarea.value || '';
    mainTextarea.value = val.slice(0, start) + output + val.slice(end);
    mainTextarea.selectionStart = mainTextarea.selectionEnd = start + output.length;
    mainTextarea.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(output).catch(() => {});
  }
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === 'QROMPT_SELECTION') {
    const text = message.payload?.text || '';
    if (isAISite()) {
      // If overlay exists, populate it
      const overlay = document.getElementById('qrompt-overlay');
      if (overlay) {
        const textarea = overlay.querySelector('#qrompt-text');
        if (textarea) {
          textarea.value = `Transform this selection:\n${text}`;
        }
      } else {
        // Inject overlay and populate
        injectOverlay();
        setTimeout(() => {
          const newOverlay = document.getElementById('qrompt-overlay');
          if (newOverlay) {
            const textarea = newOverlay.querySelector('#qrompt-text');
            if (textarea) {
              textarea.value = `Transform this selection:\n${text}`;
            }
          }
        }, 100);
      }
    } else {
      // Handle non-AI sites as before
      void handleSelection(text);
    }
  }
});

async function handleSelection(text) {
  const prompt = `Transform this selection:\n${text}`;
  const res = await chrome.runtime.sendMessage({ type: 'QROMPT_GENERATE', payload: { prompt, model: 'dev-basic' } });
  if (!res?.ok) return;
  insertAtCursor(res.output);
}

function insertAtCursor(text) {
  const active = document.activeElement;
  if (!active) return alertCopy(text);
  const isInput = active.tagName === 'TEXTAREA' || (active.tagName === 'INPUT' && active.type === 'text');
  if (isInput) {
    const start = active.selectionStart || 0;
    const end = active.selectionEnd || 0;
    const val = active.value || '';
    active.value = val.slice(0, start) + text + val.slice(end);
    active.selectionStart = active.selectionEnd = start + text.length;
    active.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  alertCopy(text);
}

function alertCopy(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

