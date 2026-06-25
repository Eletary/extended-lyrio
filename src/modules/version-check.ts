// src/modules/version-check.ts

import { promptContent } from '../utils/dom';
import { renderMarkdown } from '../utils/markdown';

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
  console.log(lastVersion);
  if (lastVersion && lastVersion !== CURRENT_VERSION) {
    GM_setValue('last_version', CURRENT_VERSION);
    console.log(lastVersion);
    const changelog = await fetchChangelog();
    const content = changelog
      ? `<div style="white-space: pre-wrap; max-height: 60vh; overflow-y: auto;">${renderMarkdown(changelog)}</div>`
      : 'View full changelog：<a href="https://github.com/Eletary/extended-lyrio/releases/latest" target="_blank">点击这里</a>';

    promptContent(`🎉 Updated to v${CURRENT_VERSION}`, content);
  }
}