// src/utils/markdown.ts

declare const marked: {
  parse: (markdown: string) => string;
};

export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  try {
    return marked.parse(markdown);
  } catch (error) {
    console.error('[extended-lyrio] Markdown failed:', error);
    return markdown;
  }
}