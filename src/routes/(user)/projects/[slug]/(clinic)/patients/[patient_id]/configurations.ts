import type { ClinicTreatmentHistoryItem } from "$lib/models/clinic";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Edit, Ellipsis, Eye, File, HandCoins, ImageOff, Trash2 } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { Image } from "$lib/models/image";
import { DateFormatter, getLocalTimeZone, parseDateTime } from "@internationalized/date";
import { ScrollArea } from "$lib/components/ui/scroll-area";
import { locale, t } from "$lib/i18n/translations";

export const emptyTreatmentsResultsConfiguration: EmptyResultsConfiguration = {
    icon: CircleOff,
    label: 'common.no_treatments_found',
    action: {
        label: 'common.add_treatment',
        event: 'create',
    }
};

export const treatmentsTableRowActions: ActionMenuConfiguration<ClinicTreatmentHistoryItem> = {
    items: [
      {
        group: [
          {
            label: t.get('common.payment'),
            icon: HandCoins,
            event: 'payment',
            disabled: true,
          },
          {
            label: t.get('common.edit'),
            icon: Edit,
            event: 'edit',
          },
          {
            label: t.get('common.delete'),
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
            header: t.get('common.last_modified'),
            dataPath: (patient) => patient,
            cell: ({ value }) => {
                const dateFormatter = new DateFormatter(t.get(`common.date_format_type.${locale.get()}`), { dateStyle: 'long', timeStyle: 'short' });
                let dateTime = value.date;
                if (value.time) {
                    dateTime = value.date.concat(`T${value.time}`);
                }
                const parsedDate = parseDateTime(dateTime);
                return dateFormatter.format(parsedDate.toDate(getLocalTimeZone()));
            },
        },
        {
            header: t.get('common.documentation'),
            dataPath: 'documentation',
            cell: ({value}) => {
                const render = createRender(ScrollArea, {class: 'flex flex-col overflow-y-auto max-h-[150px] whitespace-pre-wrap'}); 
                render.slot(value);
                return render;
            }
        },
        {
            header: t.get('common.notes'),
            dataPath: 'notes',
            cell: ({value}) => {
                const render = createRender(ScrollArea, {class: 'flex flex-col overflow-y-auto max-h-[150px] whitespace-pre-wrap'}); 
                render.slot(value);
                return render;
            }
        },
        {
            header: t.get('common.price'),
            dataPath: 'price',
        },
        {
        header: t.get('common.actions'),
        dataPath: (patient) => patient,
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
        label: 'common.add_treatment',
        class: 'self-end'
    },
    clickableRows: true,
}

export const emptyImagesResultsConfiguration: EmptyResultsConfiguration = {
    icon: ImageOff,
    label: 'common.no_images_found',
    action: {
        label: 'common.add_image',
        event: 'create',
    }
};

export const emptyFilesResultsConfiguration: EmptyResultsConfiguration = {
    icon: File,
    label: 'common.no_files_found',
    action: {
        label: 'common.add_file',
        event: 'create',
    }
};

export const filesTableRowActions: ActionMenuConfiguration<Image> = {
    items: [
      {
        group: [
          {
            label: t.get('common.view'),
            icon: Eye,
            event: 'view',
          },
          {
            label: t.get('common.delete'),
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
            header: t.get('common.last_modified'),
            dataPath: 'date',
            cell: ({ value }) => {
                const formatted = new Intl.DateTimeFormat(t.get(`common.date_format_type.${locale.get()}`)).format(value);
                return formatted;
            },
        },
        {
            header: t.get('common.name'),
            dataPath: 'path',
            cell: ({value}) => {
                const pathSegments = value.split('/');
                return pathSegments[pathSegments.length - 1];
            }
        },
        {
            header: t.get('common.actions'),
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
        label: 'common.add_file',
        class: 'self-end'
    },
    clickableRows: true,
}