'use strict';

// Only checklist booleans are stored, separately from the study dashboard progress.
const storageKey = 'study-setup-checklist-v1';
const checks = [...document.querySelectorAll('[data-step]')];
let saved = {};
try {
  const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (value && typeof value === 'object' && !Array.isArray(value)) saved = value;
} catch { /* Private/restricted storage: the guide still works for this visit. */ }
for (const check of checks) check.checked = saved[check.dataset.step] === true;

function updateProgress() {
  const done = checks.filter(check => check.checked).length;
  const progress = document.getElementById('progress');
  progress.max = checks.length;
  progress.value = done;
  document.getElementById('progress-text').textContent = `${done} / ${checks.length} 단계 확인`;
  document.getElementById('reset-progress').hidden = done === 0;
}
for (const check of checks) {
  check.addEventListener('change', () => {
    const state = Object.fromEntries(checks.map(item => [item.dataset.step, item.checked]));
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Optional storage. */ }
    updateProgress();
  });
}
document.getElementById('reset-progress').addEventListener('click', () => {
  for (const check of checks) check.checked = false;
  try { localStorage.removeItem(storageKey); } catch { /* Optional storage. */ }
  updateProgress();
  checks[0].focus();
});
updateProgress();

for (const pre of document.querySelectorAll('pre')) {
  const code = pre.querySelector('code');
  if (!code) continue;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy';
  button.textContent = '복사';
  button.setAttribute('aria-label', '이 코드 블록 복사');
  button.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = '복사됨';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = '선택됨 · 직접 복사';
    }
    setTimeout(() => { button.textContent = '복사'; }, 2500);
  });
  pre.classList.add('has-copy');
  pre.append(button);
}
