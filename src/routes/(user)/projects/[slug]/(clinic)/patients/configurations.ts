import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { ClinicPatient } from "$lib/models/clinic";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Copy, Edit, Ellipsis } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import DiceBearAvatar from "$lib/components/dice-bear-avatar/dice-bear-avatar.svelte";
import * as dicebearCollections from '@dicebear/collection'; 

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No patients found',
  action: {
    label: 'Create patient',
    event: 'create',
  }
}

const rowActions: ActionMenuConfiguration<ClinicPatient> = {
  items: [
    {
      group: [
        {
          label: 'Copy ID',
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

export const tableConfiguration: TableConfiguration<ClinicPatient> = {
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
        label: 'Create patient',
        class: 'self-end'
      },
      search: {
        placeholder: 'Name or email...'
      },
};
