import { CurrencyType } from "$lib/enums/currency";
import type { CurrencyItem } from "$lib/models/common";

export const CurrencyMap: Record<CurrencyType, CurrencyItem> = {
    [CurrencyType.ILS]: {label: 'common.ILS', icon: '&#8362;'},
};