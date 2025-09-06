const modelEl = document.getElementById('model');
const promptEl = document.getElementById('prompt');
const runBtn = document.getElementById('run');
const outputEl = document.getElementById('output');
const openOptions = document.getElementById('open-options');

openOptions.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

runBtn.addEventListener('click', () => {
  const prompt = promptEl.value.trim();
  const model = modelEl.value;
  if (!prompt) {
    outputEl.textContent = 'Enter a prompt';
    return;
  }
  outputEl.textContent = 'Running...';
  chrome.runtime.sendMessage({ type: 'QROMPT_GENERATE', payload: { prompt, model } }, (res) => {
    if (!res || !res.ok) {
      outputEl.textContent = 'Error generating output';
      return;
    }
    outputEl.textContent = res.output;
    navigator.clipboard.writeText(res.output).catch(() => {});
  });
});

