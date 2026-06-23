// vite.config.ts

import pkg from './package.json';

import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'extended-lyrio',
        namespace: 'https://github.com/Eletary/extended-lyrio',
        version: pkg.version,
        description: 'Modern Lyrio enhancer',
        author: 'Your Name',
        match: [
          '*://nflsoi.cc/*',
          '*://www.nflsoi.cc/*'
        ],
        grant: ['GM_setClipboard', 'GM_setValue', 'GM_getValue'],
      },
    }),
  ],
});