// vite.config.ts

import pkg from './package.json';

import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  build: {
    minify: "oxc"
  },
  plugins: [
    monkey({
      entry: 'src/main.ts',
      build: {
        metaFileName: true
      },
      userscript: {
        name: 'extended-lyrio',
        namespace: 'https://github.com/Eletary/extended-lyrio',
        version: pkg.version,
        description: 'Modern Lyrio enhancer',
        author: 'ppip',
        match: [
          '*://nflsoi.cc/*',
          '*://www.nflsoi.cc/*'
        ],
        grant: ['GM_setClipboard', 'GM_setValue', 'GM_getValue', 'GM_info'],
        updateURL: 'https://github.com/Eletary/extended-lyrio/releases/latest/download/extended-lyrio.meta.js',
        downloadURL: 'https://github.com/Eletary/extended-lyrio/releases/latest/download/extended-lyrio.user.js',
        require: [
          'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
        ],
      },
    }),
  ],
});