import type { EmptyResultsConfiguration } from "$lib/models/common";
import { ShoppingCart, UserRoundX } from "lucide-svelte";

export const emptyProductsResultsConfiguration: EmptyResultsConfiguration = {
  icon: ShoppingCart,
  label: 'No products found',
  action: {
    label: 'Add product',
    event: 'create',
  }
};

export const emptyClientsResultsConfiguration: EmptyResultsConfiguration = {
  icon: UserRoundX,
  label: 'No clients found',
  class: 'flex-grow',
}