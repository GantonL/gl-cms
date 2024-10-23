import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  const formType = event.params.form_type;
  return { formType }
}