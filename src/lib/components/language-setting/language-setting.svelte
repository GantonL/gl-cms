<script lang="ts">
	import { changeLocale, locale, locales, t } from "$lib/i18n/translations";
	import { Languages } from "lucide-svelte";
	import * as Card from "../ui/card";
    import * as Select from "../ui/select";

    function onLocaleChanged(newLocale: string) {
        if (!newLocale) {return;}
        if (newLocale !== $locale) {
            changeLocale(newLocale);
        }
    }
</script>
<Card.Root>
    <Card.Header>
        <Card.Title>
            <div class="flex flex-row gap-2 items-center">
                <Languages size=18/>
                <span>{$t('common.language')}</span>
            </div>
        </Card.Title>
        <Card.Description>{$t('common.language_settings_description')}</Card.Description>
    </Card.Header>
    <Select.Root 
        selected={{value: $locale, label: $t(`common.locales.${$locale}`)}}
        onSelectedChange={(v) => {
                if (!v) { return; }
                onLocaleChanged(v.value)
            }
        }>
        <Select.Trigger>
            <Select.Value />
        </Select.Trigger>
        <Select.Content>
            {#each $locales as localeOption}              
                <Select.Item value={localeOption} label={$t(`common.locales.${localeOption}`)} />
            {/each}
        </Select.Content>
    </Select.Root>
</Card.Root>