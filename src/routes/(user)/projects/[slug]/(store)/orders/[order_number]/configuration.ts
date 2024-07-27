import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { StoreProduct } from "$lib/models/store";
import type { TableConfiguration } from "$lib/models/table";
import { Copy, Ellipsis, Minus, Plus, ShoppingCart, Trash2, UserRoundX } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";

export const emptyProductsResultsConfiguration: EmptyResultsConfiguration = {
  icon: ShoppingCart,
  label: 'No products found',
  action: {
    label: 'Add product',
    event: 'create',
  }
};

export const emptyProductsSearchResultsConfiguration: EmptyResultsConfiguration = {
  icon: ShoppingCart,
  label: 'No products found',
}

export const emptyClientsResultsConfiguration: EmptyResultsConfiguration = {
  icon: UserRoundX,
  label: 'No clients found',
  class: 'flex-grow',
}

export const productsTableRowActions: ActionMenuConfiguration<StoreProduct> = {
  items: [
    {
      group: [
        {
          label: 'Copy serial number',
          icon: Copy,
          event: 'copy'
        },
      ],
    },
    {
      group: [
        {
          label: 'Increase',
          icon: Plus,
          event: 'increase',
        },
        {
          label: 'Decrease',
          icon: Minus,
          event: 'decrease',
        },
        {
          label: 'Delete',
          icon: Trash2,
          event: 'delete',
        }
      ]
    }
  ],
  trigger: {
    label: 'Table row actions menu',
    labelClass: 'sr-only',
    icon: Ellipsis,
    iconClass: 'h-4 w-4 rotate-90'
  }
}


export const productTableConfiguration: TableConfiguration<StoreProduct> = {
  columns: (dispatch: EventDispatcher<Record<string, string>>) => [
    {
      dataPath: 'id',
      hidden: true,
    },
    {
      header: '#',
      dataPath: 'serial_number'
    },
    {
      header: 'Name',
      dataPath: 'name'
    },
    {
      header: 'Amount',
      dataPath: 'amount'
    },
    {
      header: 'Actions',
      dataPath: (product) => product,
      cell: (c) => {
        const render = createRender(ActionsMenu, { 
          configuration: { 
            items: productsTableRowActions.items, 
            trigger: productsTableRowActions.trigger, 
            data: c.value
          } 
        });
        ['copy', 'increase', 'decrease', 'delete'].forEach(eventType => {
          render.on(eventType, (event) => {
            dispatch(event.type, event.detail);
          })
        })
        return render; 
      },
      class: 'align-center'
    }
  ],
  pageSize: 10,
  createItemButton: {
    label: 'Add product',
    class: 'self-end'
  },
  search: {
    placeholder: 'Name or serial number...'
  }
}