import type { MarkdownResource } from "$lib/models/markdown";

export const FormsMarkdowns: Record<string, MarkdownResource> = {
  ['botox_agreement_he']: {
    file: import.meta.glob('./he/botox-agreement.md', { eager: true }),
    path: './he/botox-agreement.md',
  },
  ['aesthefill_agreement_he']: {
    file: import.meta.glob('./he/aesthefill-agreement.md', { eager: true }),
    path: './he/aesthefill-agreement.md',
  },
};
