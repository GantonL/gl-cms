import type { Project } from "$lib/models/project";
import type { User } from "$lib/models/user";
import { writable } from "svelte/store";

export const user = writable<User | null | undefined>();
export const currentProject = writable<Pick<Project, 'name' | 'type' | 'id'> | null | undefined>();