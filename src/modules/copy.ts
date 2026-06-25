// src/modules/copy.ts

function showCopiedToast(message: string = 'Copied') {
  const toast = document.createElement('div');
  toast.className = 'noty_layout noty_layout__topRight';
  toast.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    max-width: 300px;
  `;

  const bar = document.createElement('div');
  bar.className = 'noty_bar noty_type__success noty_theme__semanticui noty_close_with_click noty_has_progressbar';
  bar.style.cssText = `
    background: #5cb85c !important;
    color: #fff !important;
    border-radius: 4px;
    padding: 10px 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  `;

  const body = document.createElement('div');
  body.className = 'noty_body';
  body.textContent = message;

  const progress = document.createElement('div');
  progress.className = 'noty_progressbar';
  progress.style.cssText = `
    height: 3px;
    background: rgba(255,255,255,0.4);
    border-radius: 0 0 4px 4px;
    animation: noty_progressbar 5s linear forwards;
  `;

  bar.appendChild(body);
  bar.appendChild(progress);
  toast.appendChild(bar);
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);

  if (!document.getElementById('noty-progress-keyframes')) {
    const style = document.createElement('style');
    style.id = 'noty-progress-keyframes';
    style.textContent = `
      @keyframes noty_progressbar {
        0% { width: 100%; }
        100% { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }
}

export function initCopy(): void {
  const segments = document.querySelectorAll<HTMLElement>('.ui.segment._codeBoxSegment_122zh_8');
  for (const seg of segments) {
    const pre = seg.querySelector('pre');
    if (!pre) continue;
    if (seg.closest('._codeBelowResults_1tci7_24')) {
      continue;
    }
    if (seg.querySelector('.nflsoj-copy-btn')
     || seg.querySelector('._codeBlockCopyButton_10gzm_79')) continue;
    if (getComputedStyle(seg).position === 'static') {
      seg.style.position = 'relative';
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nflsoj-copy-btn';
    btn.setAttribute('aria-label', 'Copy code');
    btn.style.cssText = `
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1;
      width: 25px;
      height: 25px;
      padding: 0;
      border: none;
      background: transparent;
      opacity: .4;
      font-size: 18px;
      line-height: 25px;
      text-align: center;
      cursor: pointer;
      color: inherit;
    `;

    btn.innerHTML = `<i class="copy icon"></i>`;
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '.6'
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.opacity = '.4';
    });

    seg.appendChild(btn);

    btn.addEventListener('click', async () => {
      const code = pre.textContent || '';
      await GM_setClipboard(code, 'text');
      showCopiedToast('Copied');
    });
  }
}