import DiceBearAvatar from "$lib/components/dice-bear-avatar/dice-bear-avatar.svelte";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { StoreClient } from "$lib/models/store";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Edit, Ellipsis, MessageSquare, Trash2 } from "lucide-svelte";
import { createRender } from "svelte-headless-table";
import * as dicebearCollections from '@dicebear/collection'; 
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import { type EventDispatcher } from "svelte";

const rowActions: ActionMenuConfiguration<StoreClient> = {
  items: [
    {
      group: [
        {
          label: 'Chat',
          icon: MessageSquare,
          event: 'chat'
        },
        {
          label: 'Edit',
          icon: Edit,
          event: 'edit',
        },
        {
          label: 'Delete',
          icon: Trash2,
          event: 'delete',
          class: 'bg-destructive/10 text-destructive'
        }
      ]
    },
  ],
  trigger: {
    label: 'Table row actions menu',
    labelClass: 'sr-only',
    icon: Ellipsis,
    iconClass: 'h-4 w-4 rotate-90'
  }
}

export const tableConfiguration: TableConfiguration<StoreClient> = {
  columns: (dispatch: EventDispatcher<Record<string, string>>) => [
    {
      dataPath: 'id',
      cell: (item) => {
        return createRender(DiceBearAvatar, { 
          seed: item.value,
          style: dicebearCollections.notionists,
          fallback: '?'
        });
      }
    },
    {
      header: 'Name',
      dataPath: 'name'
    },
    {
      header: 'Email',
      dataPath: 'email'
    },
    {
      header: 'Created',
      dataPath: 'created_at',
      cell: ({ value }) => {
        const formatted = new Intl.DateTimeFormat("en-UK").format(value);
        return formatted;
      },
    },
    {
      header: 'Actions',
      dataPath: (client) => client,
      cell: (c) => {
        const render = createRender(ActionsMenu, { configuration: { ...rowActions, data: c.value } });
        ['chat', 'edit', 'delete'].forEach(eventType => {
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
    label: 'Create client',
    class: 'self-end'
  },
  search: {
    placeholder: 'Name or email...'
  },
};

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No clients found',
  action: {
    label: 'Create client',
    event: 'create',
  }
}
