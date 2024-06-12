import DiceBearAvatar from "$lib/components/dice-bear-avatar/dice-bear-avatar.svelte";
import type { EmptyResultsConfiguration } from "$lib/models/common";
import type { StoreClient } from "$lib/models/store";
import type { TableConfiguration } from "$lib/models/table";
import { CircleOff } from "lucide-svelte";
import { createRender } from "svelte-headless-table";
import * as dicebearCollections from '@dicebear/collection'; 
import { writable } from "svelte/store";

export const tableConfiguration: TableConfiguration<StoreClient> = {
  columns: [
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
  ],
  pageSize: 10,
};

export const emptyResultsConfiguration: EmptyResultsConfiguration = {
  icon: CircleOff,
  label: 'No clients found',
  action: {
    label: 'Create client',
    event: 'create',
  }
}