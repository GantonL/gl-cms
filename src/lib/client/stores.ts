import { Font } from "$lib/enums/font";
import { Themes } from "$lib/enums/theme";
import type { Project } from "$lib/models/project";
import type { User } from "$lib/models/user";
import { writable } from "svelte/store";

export const user = writable<User | null | undefined>();
export const currentProject = writable<Pick<Project, 'name' | 'display_name' | 'type' | 'id'> | null | undefined>();
export const direction = writable<'rtl' | 'ltr' | undefined>('rtl');
export const theme = writable(Themes.Default);
export const font = writable(Font.Default);
