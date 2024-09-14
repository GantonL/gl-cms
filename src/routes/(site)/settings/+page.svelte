<script lang="ts">
	import LanguageSetting from "$lib/components/language-setting/language-setting.svelte";
	import FontSetting from "$lib/components/font-setting/font-setting.svelte";
	import ThemeSetting from "$lib/components/theme-setting/theme-setting.svelte";
	import { t } from "$lib/i18n/translations";

</script>
<h1 class="text-xl">{$t('common.settings')}</h1>
<div class="flex flex-col gap-4">
    <LanguageSetting />
	<ThemeSetting />
	<FontSetting />
</div>
