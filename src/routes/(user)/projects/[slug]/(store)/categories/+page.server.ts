import type { Actions, PageServerLoad } from "./$types";
import { createCategory, getCategories, updateCategory, uploadCategoryImage } from "$lib/server/store.db";
import { fail, superValidate, withFiles } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { StoreCategory } from "$lib/models/store";
import type { Project } from "$lib/models/project";

let currentProject: Project | undefined = undefined;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const categories = await getCategories(project)
  return {
    form: await superValidate(zod(formSchema)),
    categories,
    project
  }
}

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, 
        withFiles({ form }),
      );
    }
    const category: StoreCategory | undefined = await createCategory(currentProject!, {
      title: form.data.title,
      display_location: form.data.display_location,
      discount: form.data.discount
    });
    if (category === undefined) {
      return fail(400, withFiles({form}));
    }
    if (form.data.imageFile) {
      const image = await uploadCategoryImage(currentProject!, category.id, form.data.imageFile);
      if (image) {
        await updateCategory(currentProject!, category.id, { image });
      } else {
        return {
          form,
          error: {
            message: `Failed to upload image for category ${category.title}`
          }
        }
      }
    }
    return withFiles({ form });
  },
};