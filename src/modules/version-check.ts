// src/modules/version-check.ts

import { promptContent } from '../utils/dom';

const CURRENT_VERSION = GM_info.script.version;

async function fetchChangelog(): Promise<string | null> {
  const repo = 'Eletary/extended-lyrio';
  const url = `https://api.github.com/repos/${repo}/releases/latest`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.body || '暂无更新日志。';
  } catch {
    return null;
  }
}

export async function initVersionCheck() {
  const lastVersion = GM_getValue('last_version', '');

  if (lastVersion && lastVersion !== CURRENT_VERSION) {
    const changelog = await fetchChangelog();
    const content = changelog
      ? `<div style="white-space: pre-wrap; max-height: 60vh; overflow-y: auto;">${changelog}</div>`
      : '查看完整更新日志：<a href="https://github.com/Eletary/extended-lyrio/releases/latest" target="_blank">点击这里</a>';

    promptContent(`🎉 已更新至 v${CURRENT_VERSION}`, content);
  }

  GM_setValue('last_version', CURRENT_VERSION);
}