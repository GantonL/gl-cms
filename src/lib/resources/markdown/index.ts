interface MarkdownResource {
  file: Record<string, { default: Promise<unknown>, metadata: Promise<unknown> }>;
  path: string;
}

export const MarkdownResources: Record<string, MarkdownResource> = {
  ['site-terms-en']: {
    file: import.meta.glob('./en/site-terms.md', { eager: true }),
    path: './en/site-terms.md',
  },
  ['privacy-policy-en']: {
    file: import.meta.glob('./en/privacy-policy.md', { eager: true }),
    path: './en/privacy-policy.md',
  },
  ['cookies-policy-en']: {
    file: import.meta.glob('./en/cookies-policy.md', { eager: true }),
    path: './en/cookies-policy.md',
  },
  ['site-terms-he']: {
    file: import.meta.glob('./he/site-terms.md', { eager: true }),
    path: './he/site-terms.md',
  },
  ['privacy-policy-he']: {
    file: import.meta.glob('./he/privacy-policy.md', { eager: true }),
    path: './he/privacy-policy.md',
  },
  ['cookies-policy-he']: {
    file: import.meta.glob('./he/cookies-policy.md', { eager: true }),
    path: './he/cookies-policy.md',
  }
};
