import type { Project } from "$lib/models/project";
import type { User } from "firebase/auth";
import { writable } from "svelte/store";

export const user = writable<User | null | undefined>();
export const currentProject = writable<Project['name'] | null | undefined>();