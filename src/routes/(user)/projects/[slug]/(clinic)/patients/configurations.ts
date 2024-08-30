import ActionsMenu from "$lib/components/actions-menu/actions-menu.svelte";
import type { ClinicPatient } from "$lib/models/clinic";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { ActionMenuConfiguration } from "$lib/models/menu-item";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff, Copy, Edit, Ellipsis, MessageSquare } from "lucide-svelte";
import type { EventDispatcher } from "svelte";
import { createRender } from "svelte-headless-table";
import GLAvatar from "$lib/components/gl-avatar/gl-avatar.svelte";
import { DateFormatter, getLocalTimeZone, parseDate, today } from "@internationalized/date";
import PatientTableIndications from './patient-table-indications.svelte';

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
        {
          label: 'Open chat',
          icon: MessageSquare,
          event: 'open'
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
          dataPath: 'avatar',
          cell: (item) => {
            return createRender(GLAvatar, { url: item.value?.url });
          }
        },
        {
          header: 'Name',
          dataPath: 'full_name'
        },
        {
          header: 'ID',
          dataPath: 'personal_id'
        },
        {
          header: 'Birth date',
          dataPath: 'date_of_birth',
          cell: ({ value }) => {
            const dateFormatter = new DateFormatter('en-UK', { dateStyle: "long" });
            const parsedDate = parseDate(value);
            const dob = dateFormatter.format(parsedDate.toDate(getLocalTimeZone()));
            const years = today(getLocalTimeZone()).year - parsedDate.year;
            return `${dob} (${years})`
          },
        },
        {
          header: "Indications",
          dataPath: (patient) => patient,
          cell: (p) => {
            return createRender(PatientTableIndications, { indications: {...p.value} })
          }
        },
        {
          header: 'Actions',
          dataPath: (patient) => patient,
          cell: (p) => {
            const render = createRender(ActionsMenu, { configuration: { ...rowActions, data: p.value } });
            ['copy', 'edit', 'open'].forEach(eventType => {
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
        placeholder: 'Name, ID or Email...'
      },
      clickableRows: true,
};
