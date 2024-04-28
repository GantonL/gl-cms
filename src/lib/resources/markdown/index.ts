interface MarkdownResource {
  file: Record<string, { default: Promise<unknown>, metadata: Promise<unknown> }>;
  path: string;
}

export const MarkdownResources: Record<string, MarkdownResource> = {
  ['site-terms']: {
    file: import.meta.glob('./site-terms.md', { eager: true }),
    path: './site-terms.md',
  },
  ['privacy-policy']: {
    file: import.meta.glob('./privacy-policy.md', { eager: true }),
    path: './privacy-policy.md',
  },
  ['cookies-policy']: {
    file: import.meta.glob('./cookies-policy.md', { eager: true }),
    path: './cookies-policy.md',
  }
};
