import { loadTranslations, locale, t } from "$lib/i18n/translations";
import type { LayoutLoad } from "./$types";
import { Language } from "./api";

export const load: LayoutLoad = async (event) => {
	const languageRes = await (await event.fetch(Language, {method: 'GET'})).json();
	const localeFromCookie = languageRes.locale;
	const choosenLocal = localeFromCookie;
    locale.set(choosenLocal);
	await loadTranslations(choosenLocal);
	return { 
		local: choosenLocal,
		seo: {
			description: t.get('common.landing_page_description'),
		}
	};
}
