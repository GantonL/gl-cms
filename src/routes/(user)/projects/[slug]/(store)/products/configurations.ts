import DiceBearAvatar from "$lib/components/dice-bear-avatar/dice-bear-avatar.svelte";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { StoreProduct } from "$lib/models/store";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Copy, Edit, Ellipsis } from "lucide-svelte";
import { createRender } from "svelte-headless-table";
import * as dicebearCollections from '@dicebear/collection'; 
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import { type EventDispatcher } from "svelte";
import { Avatar } from "$lib/components/ui/avatar";

const rowActions: ActionMenuConfiguration<StoreProduct> = {
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
          label: 'Edit',
          icon: Edit,
          event: 'edit',
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

export const tableConfiguration: TableConfiguration<StoreProduct> = {
  columns: (dispatch: EventDispatcher<Record<string, string>>) => [
    {
      dataPath: 'images',
      cell: (item) => {
        return createRender(Avatar, {})
      }
    },
    {
      header: 'Name',
      dataPath: 'name'
    },
    {
      header: 'Stock',
      dataPath: 'stock'
    },
    {
      header: 'Actions',
      dataPath: (client) => client,
      cell: (c) => {
        const render = createRender(ActionsMenu, { configuration: { ...rowActions, data: c.value } });
        ['copy', 'edit'].forEach(eventType => {
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
    label: 'Create product',
    class: 'self-end'
  },
  search: {
    placeholder: 'Name or serial number...'
  },
};

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No products found',
  action: {
    label: 'Create product',
    event: 'create',
  }
}
