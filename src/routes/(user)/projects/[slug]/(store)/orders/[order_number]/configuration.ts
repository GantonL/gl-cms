import type { EmptyResultsConfiguration } from "$lib/models/common";
import { ShoppingCart } from "lucide-svelte";

export const emptyProductsResultsConfiguration: EmptyResultsConfiguration = {
  icon: ShoppingCart,
  label: 'No products found',
  action: {
    label: 'Add product',
    event: 'create',
  }
};
