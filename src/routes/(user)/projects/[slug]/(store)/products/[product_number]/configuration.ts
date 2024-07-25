import type { EmptyResultsConfiguration } from "$lib/models/common";
import { CopySlash, ImageOff } from "lucide-svelte";

export const emptyImagesConfiguration: EmptyResultsConfiguration = {
    label: 'No Images',
    icon: ImageOff,
    action: {
        label: 'Add image',
        event: 'create',
    }
}

export const emptyVariantsConfiguration: EmptyResultsConfiguration = {
    label: 'No Variants',
    icon: CopySlash,
    action: {
        label: 'Add variant',
        event: 'create',
    }
}