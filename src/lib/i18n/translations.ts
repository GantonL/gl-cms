import i18n, {type Config} from 'sveltekit-i18n';
import { Language } from '../../routes/api';

/** @type {import('sveltekit-i18n').Config} */
const config: Config = ({
  loaders: [
    {
      locale: 'he',
      key: 'common',
      loader: async () => (
        await import('./he/common.json')
      ).default,
    },
    {
      locale: 'he',
      key: 'seo',
      loader: async () => (
        await import('./he/seo.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'common',
      loader: async () => (
        await import('./en/common.json')
      ).default,
    },
    {
      locale: 'en',
      key: 'seo',
      loader: async () => (
        await import('./en/seo.json')
      ).default,
    },
  ],
});

export const { t, locale, locales, loading, loadTranslations, initialized } = new i18n(config);

export const changeLocale = (newLocale: string) => {
  locale.set(newLocale);
  const formData = new FormData();
  formData.append('locale', newLocale);
  fetch(Language, {method: 'POST', body: formData});
}
