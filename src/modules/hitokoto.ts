// src/modules/hitokoto.ts

import { waitForElement } from '../utils/dom';

const config = {
  api: 'https://v1.hitokoto.cn/?c=a',
  sidebarSelector: '.five.wide.column',
} as const;


async function fetchHitokoto(): Promise<string> {
  const response = await fetch(config.api);
  const data = await response.json();
  
  return `${data.hitokoto}
          <div style="margin-top: 14px; text-align: right; font-size: .95em; color: #999;">
            —— ${data.from}
          </div>`;
}

export async function initHitokoto(): Promise<void> {
  try {
    const sidebar = await waitForElement(config.sidebarSelector);
    if (sidebar.querySelector('.hitokoto-module')) return;

    const html = `
      <div class="hitokoto-module" style="margin-bottom: 1em;">
        <style>
          #hitokoto-skeleton.ui.placeholder,
          #hitokoto-skeleton.ui.placeholder::before,
          #hitokoto-skeleton .image.header::after,
          #hitokoto-skeleton .line,
          #hitokoto-skeleton .line::after,
          #hitokoto-skeleton > ::before {
            background-color: var(--theme-background, #fff) !important;
          }
          #hitokoto-skeleton {
            min-height: 60px;
            margin-top: 0.3em;
          }
        </style>
        <h4 class="ui block top attached header _header_1efka_1">
          <i aria-hidden="true" class="ui quote left icon"></i>
          <div class="content">
            Hitokoto (ヒトコト)
            <i id="refresh-hitokoto" title="Refresh" class="redo icon button" style="
              opacity: .2;
              position: absolute;
              right: 20px;
              height: 19px;
              display: inline-flex;
              align-items: center;
              cursor: pointer;
            "></i>
          </div>
        </h4>
        <div class="ui bottom attached center aligned segment">
          <div id="hitokoto-text" style="display: none;"></div>
          <div id="hitokoto-skeleton" class="ui placeholder">
            <div class="paragraph">
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
              <div class="line"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    sidebar.insertAdjacentHTML('afterbegin', html);

    const moduleEl = sidebar.querySelector('.hitokoto-module')!;
    const textDisplay = moduleEl.querySelector('#hitokoto-text') as HTMLDivElement;
    const skeleton = moduleEl.querySelector('#hitokoto-skeleton') as HTMLDivElement;
    const refreshBtn = moduleEl.querySelector('#refresh-hitokoto') as HTMLElement;

    async function loadHitokoto() {
      textDisplay.style.display = 'none';
      skeleton.style.display = '';

      try {
        const html = await fetchHitokoto();
        textDisplay.innerHTML = html;
        textDisplay.style.display = '';
        skeleton.style.display = 'none';
      } catch (error) {
        textDisplay.innerHTML = '<p>一言加载失败，请稍后重试</p>';
        textDisplay.style.display = '';
        skeleton.style.display = 'none';
        console.error('[Hitokoto]', error);
      }
    }

    refreshBtn.addEventListener('click', loadHitokoto);
    await loadHitokoto();

    refreshBtn.addEventListener('mouseenter', () => refreshBtn.style.opacity = '.4');
    refreshBtn.addEventListener('mouseleave', () => refreshBtn.style.opacity = '.2');

  } catch (error) {
    console.warn('[Hitokoto]', error);
  }
}