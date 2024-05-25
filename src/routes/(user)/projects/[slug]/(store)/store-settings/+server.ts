import type { RequestEvent } from "./$types";
import { type StoreSettings } from "$lib/models/store";
import { error, json } from "@sveltejs/kit";
import { updateSettings } from "$lib/server/store.db";
import { getProject } from "$lib/server/projects.db";
import { getAuthenticatedUser } from "$lib/server/auth";

export async function POST(event: RequestEvent) {
  const autheticatedUser = await getAuthenticatedUser(event);
  if (!autheticatedUser) {
    error(401, 'Unauthorized');
  }
  const body = await event.request.formData();
  const settingsId = body.get('id')?.toString();
  if (settingsId === undefined) {
    return error(400, {message: 'Missing data'});
  }
  const updateObject: Pick<StoreSettings, 'id'> & Partial<Pick<StoreSettings, 'active' | 'banner' | 'global_discount'>> = {
    id: settingsId
  };
  const activeValue = body.get('active')?.toString();
  if (activeValue !== undefined) {
    const active = activeValue === 'true';
    updateObject.active = active;
  }
  const globalDiscountValue = body.get('global_discount')?.toString();
  if (globalDiscountValue !== undefined) {
    const globalDiscount = Number(globalDiscountValue);
    updateObject.global_discount = globalDiscount;
  }
  const bannerValue = body.get('banner')?.toString();
  if (bannerValue !== undefined) {
    updateObject.banner = bannerValue;
  }
  if (Object.keys(updateObject).length <= 1) {
    return error(400, {message: 'Missing data'});
  }
  const project = await getProject(event.params.slug);
  if (project === null) {
    return error(404, {message: 'Project does not exists'});
  }
  const success = await updateSettings(project, updateObject!);
  return json({success});
}
