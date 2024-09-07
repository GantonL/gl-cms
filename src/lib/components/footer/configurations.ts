import type { NavigationLink } from "$lib/models/navigation-link";
import { Cookie, Handshake, ShieldCheck } from "lucide-svelte";

export const PoliciesLinksConfiguration: NavigationLink[] = [
  { label: 'common.terms_and_conditions', link: '/policies/terms-and-conditions', icon: Handshake },
  { label: 'common.privacy', link: '/policies/privacy', icon: ShieldCheck },
  { label: 'common.manage_cookies', link: '/manage-cookies', icon: Cookie },
];

