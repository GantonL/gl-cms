<script lang="ts">
	import LanguageSetting from "$lib/components/language-setting/language-setting.svelte";
	import FontSetting from "$lib/components/font-setting/font-setting.svelte";
	import ThemeSetting from "$lib/components/theme-setting/theme-setting.svelte";
	import { t } from "$lib/i18n/translations";

</script>
<h1 class="text-xl">{$t('common.settings')}</h1>
<div class="flex flex-row flex-wrap gap-4">
    <div class="min-w-60 flex-grow">
		<LanguageSetting />
	</div>
	<div class="min-w-60 flex-grow">
		<ThemeSetting />
	</div>
	<div class="min-w-60 flex-grow">
		<FontSetting />
	</div>
</div>
