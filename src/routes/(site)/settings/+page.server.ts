import type { PageServerLoad } from "./$types";
import { t } from "$lib/i18n/translations";

export const load: PageServerLoad = async () => {    
    return {
      seo: {
        title: t.get('common.settings'),
      }
    }
  }