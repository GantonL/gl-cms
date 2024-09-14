<script lang="ts">
	import { t } from "$lib/i18n/translations";
	import { Palette } from "lucide-svelte";
	import * as Card from "../ui/card";
    import * as Select from "../ui/select";
	import { theme } from "$lib/client/stores";
	import { changeTheme } from "$lib/theme/theme";
	import { themes, themeStorageKey } from "$lib/configurations/theme";
	import type { Themes } from "$lib/enums/theme";

    function onChangeTheme(newTheme: Themes) {
        localStorage.setItem(themeStorageKey, newTheme);
        changeTheme(newTheme);
    }
    $: currentTheme = themes.find(t => t.value === $theme);
</script>
<Card.Root>
    <Card.Header>
        <Card.Title>
            <div class="flex flex-row gap-2 items-center">
                <Palette size=18/>
                <span>{$t('common.theme')}</span>
            </div>
        </Card.Title>
        <Card.Description>{$t('common.theme_settings_description')}</Card.Description>
    </Card.Header>
    <div class="px-4 pb-4">
        <Select.Root 
            selected={currentTheme && {value: currentTheme.value, label: t.get(currentTheme.label)}}
            onSelectedChange={(v) => {
                    if (!v) { return; }
                    onChangeTheme(v.value)
                }
            }>
            <Select.Trigger>
                <Select.Value />
            </Select.Trigger>
            <Select.Content>
                {#each themes as option}              
                    <Select.Item value={option.value}>{$t(option.label)}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>
</Card.Root>