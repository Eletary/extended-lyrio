// src/modules/copy.ts

function showCopiedToast(message: string = 'Copied') {
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

  const notyContainer = document.getElementById('noty_layout__topRight');

  function createNotification() {
    const bar = document.createElement('div');
    bar.className = 'noty_bar noty_type__success noty_theme__semanticui noty_close_with_click noty_has_progressbar';
    bar.style.cssText = `
      margin-bottom: 5px;
      background: #5cb85c !important;
      color: #fff !important;
      border-radius: 4px;
      padding: 10px 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transform: translateX(calc(100% + 20px));
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
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
      animation: noty_progressbar 3s linear forwards;
    `;

    bar.append(body, progress);
    return bar;
  }

  if (notyContainer) {
    const bar = createNotification();
    notyContainer.prepend(bar);

    requestAnimationFrame(() => {
      bar.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      bar.style.transform = 'translateX(calc(100% + 20px))';
      setTimeout(() => bar.remove(), 400);
    }, 2500);
  } else {
    const existing = document.querySelector('.nflsoj-copy-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'nflsoj-copy-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 60px;
      right: 10px;
      z-index: 10000;
      background: #5cb85c;
      color: #fff;
      padding: 10px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      font-size: 14px;
      white-space: nowrap;
      transform: translateX(calc(100% + 20px));
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(calc(100% + 20px))';
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }
}

export function initCopy(): void {
  const segments = document.querySelectorAll<HTMLElement>('._codeBoxSegment_122zh_8, ._codeBoxSegment_dmlry_8');
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