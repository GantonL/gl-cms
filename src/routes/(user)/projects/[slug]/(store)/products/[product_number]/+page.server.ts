import type { Project } from "$lib/models/project";
import { createProduct, getProduct, updateProduct } from "$lib/server/store.db";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { StoreProduct, StoreProductSize } from "$lib/models/store";

let currentProject: Project;

export const load: PageServerLoad = async ({parent, params}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  let product: Partial<StoreProduct> | undefined = {};
  if (params.product_number !== 'new') {
    product = await getProduct(project, Number(params.product_number));
  }
  return {
    project,
    product,
  }
}

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const product: StoreProduct | undefined = await createProduct(currentProject!, {
      name: form.data.name,
      description: form.data.description,
      color: form.data.color,
      discount: form.data.discount,
      stock: form.data.stock,
      size: form.data.size as StoreProductSize,
    });
    if (product === undefined) {
      return fail(400, {form});
    }
    form.data.serial_number = String(product.serial_number);
    return { form };
  },
  update: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const productUpdateObject: Partial<Omit<StoreProduct, 'id' | 'created_at' | 'serial_number'>> = {
      name: form.data.name,
      description: form.data.description,
      color: form.data.color,
      discount: form.data.discount,
      stock: form.data.stock,
      size: form.data.size as StoreProductSize,
    };
    const updateRes = await updateProduct(currentProject, form.data.id!, productUpdateObject);
    if (!updateRes) {
      return fail(403, { form });
    }
    return { form };
  }
};