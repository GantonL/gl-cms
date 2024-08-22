import type { ClinicTreatmentHistoryItem } from "$lib/models/clinic";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Edit, Ellipsis, Eye, File, ImageOff, Trash2 } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { Image } from "$lib/models/image";
import { DateFormatter, getLocalTimeZone, parseDate } from "@internationalized/date";

export const emptyTreatmentsResultsConfiguration: EmptyResultsConfiguration = {
    icon: CircleOff,
    label: 'No treatments found',
    action: {
        label: 'Add treatment',
        event: 'create',
    }
};

export const treatmentsTableRowActions: ActionMenuConfiguration<ClinicTreatmentHistoryItem> = {
    items: [
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

export const treatmentsHistoryTableConfiguration: TableConfiguration<ClinicTreatmentHistoryItem> = {
    columns: (dispatch: EventDispatcher<Record<string, string>>) => [
        {
            dataPath: 'id',
            hidden: true,
        },
        {
            header: 'Last modified',
            dataPath: 'date',
            cell: ({ value }) => {
                const dateFormatter = new DateFormatter('en-UK', { dateStyle: "long" });
                const parsedDate = parseDate(value);
                return dateFormatter.format(parsedDate.toDate(getLocalTimeZone()));
            },
        },
        {
            header: 'Documentation',
            dataPath: 'documentation',
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
            ['edit', 'delete'].forEach(eventType => {
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
    clickableRows: true,
}

export const emptyImagesResultsConfiguration: EmptyResultsConfiguration = {
    icon: ImageOff,
    label: 'No images found',
    action: {
        label: 'Add image',
        event: 'create',
    }
};

export const emptyFilesResultsConfiguration: EmptyResultsConfiguration = {
    icon: File,
    label: 'No files found',
    action: {
        label: 'Add file',
        event: 'create',
    }
};

export const filesTableRowActions: ActionMenuConfiguration<Image> = {
    items: [
      {
        group: [
          {
            label: 'View',
            icon: Eye,
            event: 'view',
          },
          {
            label: 'Delete',
            icon: Trash2,
            event: 'delete',
            class: 'bg-destructive/10 text-destructive'
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

export const filesTableConfiguration: TableConfiguration<Image> = {
    columns: (dispatch: EventDispatcher<Record<string, string>>) => [
        {
            header: 'Last modified',
            dataPath: 'date',
            cell: ({ value }) => {
                const formatted = new Intl.DateTimeFormat("en-UK").format(value);
                return formatted;
            },
        },
        {
            header: 'name',
            dataPath: 'path',
            cell: ({value}) => {
                const pathSegments = value.split('/');
                return pathSegments[pathSegments.length - 1];
            }
        },
        {
            header: 'Actions',
            dataPath: (product) => product,
            cell: (c) => {
                const render = createRender(ActionsMenu, { 
                configuration: { 
                    items: filesTableRowActions.items, 
                    trigger: filesTableRowActions.trigger, 
                    data: c.value
                } 
                });
                ['delete', 'view'].forEach(eventType => {
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
    clickableRows: true,
}