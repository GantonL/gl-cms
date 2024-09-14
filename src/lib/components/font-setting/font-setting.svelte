<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Palette } from "lucide-svelte";
	import * as Card from "../ui/card";
    import * as Select from "../ui/select";
	import { font } from "$lib/client/stores";
	import { fonts, fontStorageKey } from "$lib/configurations/font";
	import { changeFont } from "$lib/font/font";
    import type { Font } from "$lib/enums/font";

    function onChangeFont(newFont: Font) {
        localStorage.setItem(fontStorageKey, newFont);
        changeFont(newFont);
    }
    $: currentFont = fonts.find(t => t.value === $font);
</script>
<Card.Root>
    <Card.Header>
        <Card.Title>
            <div class="flex flex-row gap-2 items-center">
                <Palette size=18/>
                <span>{$t('common.font')}</span>
            </div>
        </Card.Title>
        <Card.Description>{$t('common.font_settings_description')}</Card.Description>
    </Card.Header>
    <div class="px-4 pb-4">
        <Select.Root 
            selected={currentFont && {value: currentFont.value, label: t.get(currentFont.label)}}
            onSelectedChange={(v) => {
                    if (!v) { return; }
                    onChangeFont(v.value)
                }
            }>
            <Select.Trigger>
                <Select.Value />
            </Select.Trigger>
            <Select.Content>
                {#each fonts as option}              
                    <Select.Item value={option.value}>{$t(option.label)}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>
</Card.Root>