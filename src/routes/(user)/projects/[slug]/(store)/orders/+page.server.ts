import type { Project } from "$lib/models/project";
import { createOrder, getOrdersCount, updateOrder } from "$lib/server/store.db";
import { fail, superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";
import type { StoreOrder, StoreOrderStatus } from "$lib/models/store";

let currentProject: Project;

export const load: PageServerLoad = async ({parent}) => {
  const parentData = await parent();
  const project = parentData.project;
  currentProject = project;
  const totalOrders = await getOrdersCount(project);
  return {
    project,
    totalOrders,
  }
}

export const actions: Actions = {
  create: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const order: StoreOrder | undefined = await createOrder(currentProject!, {
      client_id: form.data.client_id,
      shipping_option: form.data.shipping_option,
      status: form.data.status as StoreOrderStatus,
      additional_discount: form.data.additional_discount,
      items: [],
      total_price: form.data.total_price ?? 0 //(form.data.items ?? []).reduce((acc, item) => acc += (item.price * item.amount), 0),
    });
    if (order === undefined) {
      return fail(400, {form});
    }
    return { form };
  },
  update: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    const orderUpdateObject: Partial<Omit<StoreOrder, 'id' | 'created_at' | 'serial_number'>> = {
      client_id: form.data.client_id,
      shipping_option: form.data.shipping_option,
      status: form.data.status as StoreOrderStatus,
      additional_discount: form.data.additional_discount,
      // items: form.data.items,
      // total_price: form.data.total_price ?? form.data.items.reduce((acc, item) => acc += (item.price * item.amount), 0),
    };
    const updateRes = await updateOrder(currentProject, form.data.id!, orderUpdateObject);
    if (!updateRes) {
      return fail(403, { form });
    }
    return { form };
  }
};