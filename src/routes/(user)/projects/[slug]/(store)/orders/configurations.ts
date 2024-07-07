import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import OrderStatus from "$lib/components/store/order-status/order-status.svelte";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { StoreOrder, StoreOrderShippingOption, StoreOrderStatus } from "$lib/models/store";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Copy, Edit, Ellipsis, Trash2 } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";

export const shippingOptions: StoreOrderShippingOption[] = [
  'delivery', 
  'pickup',
];

export const statusOptions: StoreOrderStatus[] = [
  'approved', 
  'canceled', 
  'delivered', 
  'in_progress', 
  'pending_approval',
];

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No orders found',
  action: {
    label: 'Create order',
    event: 'create',
  }
}

const rowActions: ActionMenuConfiguration<StoreOrder> = {
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
        },
        {
          label: 'Delete',
          icon: Trash2,
          event: 'delete',
          class: 'bg-destructive/10 text-destructive'
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

export const tableConfiguration: TableConfiguration<StoreOrder> = {
  columns: (dispatch: EventDispatcher<Record<string, string>>) => [
    {
      header: 'Serial number',
      dataPath: 'serial_number',
    },
    {
      header: 'Status',
      dataPath: 'status',
      cell: (c) => {
        return createRender(OrderStatus, { status: c.value });
      }
    },
    {
      header: 'Actions',
      dataPath: (client) => client,
      cell: (c) => {
        const render = createRender(ActionsMenu, { configuration: { ...rowActions, data: c.value } });
        ['copy', 'edit', 'delete'].forEach(eventType => {
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
    label: 'Create order',
    class: 'self-end'
  },
  search: {
    placeholder: 'Serial number...'
  },
};
