import type { ClinicPatient } from "$lib/models/clinic";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Edit, Ellipsis, File, Trash2 } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";

export const emptyTreatmentsResultsConfiguration: EmptyResultsConfiguration = {
    icon: CircleOff,
    label: 'No treatments found',
    action: {
        label: 'Add treatment',
        event: 'create',
    }
};


export const treatmentsTableRowActions: ActionMenuConfiguration<ClinicPatient['treatments_history']> = {
    items: [
      {
        group: [
          {
            label: 'Edit',
            icon: Edit,
            event: 'edit',
          },
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


export const treatmentsHistoryTableConfiguration: TableConfiguration<ClinicPatient> = {
    columns: (dispatch: EventDispatcher<Record<string, string>>) => [
        {
            dataPath: 'id',
            hidden: true,
        },
        {
            header: 'Last modified',
            dataPath: 'date',
            cell: ({ value }) => {
                const formatted = new Intl.DateTimeFormat("en-UK", {'hour': '2-digit'}).format(value);
                return formatted;
            },
        },
        {
            header: 'Type',
            dataPath: 'type',
        },
        {
            header: 'Notes',
            dataPath: 'notes',
        },
        {
            header: 'Price',
            dataPath: 'price',
        },
        {
        header: 'Actions',
        dataPath: (product) => product,
        cell: (c) => {
            const render = createRender(ActionsMenu, { 
            configuration: { 
                items: treatmentsTableRowActions.items, 
                trigger: treatmentsTableRowActions.trigger, 
                data: c.value
            } 
            });
            ['edit'].forEach(eventType => {
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
        label: 'Add treatment',
        class: 'self-end'
    },
}


export const emptyFilesResultsConfiguration: EmptyResultsConfiguration = {
    icon: File,
    label: 'No files found',
    action: {
        label: 'Add file',
        event: 'create',
    }
};

export const filesTableRowActions: ActionMenuConfiguration<ClinicPatient['treatments_history']> = {
    items: [
      {
        group: [
          {
            label: 'Delete',
            icon: Trash2,
            event: 'delete',
          },
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


export const filesTableConfiguration: TableConfiguration<ClinicPatient> = {
    columns: (dispatch: EventDispatcher<Record<string, string>>) => [
        {
            header: 'Last modified',
            dataPath: 'date',
            cell: ({ value }) => {
                const formatted = new Intl.DateTimeFormat("en-UK", {'hour': '2-digit'}).format(value);
                return formatted;
            },
        },
        {
            header: 'name',
            dataPath: 'path',
        },
        {
            header: 'Actions',
            dataPath: (product) => product,
            cell: (c) => {
                const render = createRender(ActionsMenu, { 
                configuration: { 
                    items: treatmentsTableRowActions.items, 
                    trigger: treatmentsTableRowActions.trigger, 
                    data: c.value
                } 
                });
                ['delete'].forEach(eventType => {
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
        label: 'Add file',
        class: 'self-end'
    },
}