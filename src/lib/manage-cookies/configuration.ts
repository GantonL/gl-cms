import { AppName } from "$lib/consts";
import type { ManageCookiesConfiguration } from "$lib/models/manage-cookies-configuration";

export const CookieManagerConfiguration: ManageCookiesConfiguration = {
  'user-preference-cookie-name': `${AppName.split(' ').join('-')}-user-preferences`,
  'show-manage-cookies-banner': true,
  'user-preference-cookies-expiry-days': 365,
  'cookies-categories': [
    {
      name: "essential",
      optional: false,
      accepted: true,
      cookies: [
        "essential-cookie",
      ],
    },
    {
      name: "analytics",
      optional: true,
      accepted: true,
      cookies: [
        "_ga",
        "_gtm"
      ]
    },
    {
      name: "advertising",
      optional: true,
      accepted: true,
      cookies: [
        "advertising-cookie"
      ]
    } 
  ]
}