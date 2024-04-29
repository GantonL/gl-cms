<script lang="ts">
	import { page } from '$app/stores';
	import Shell from '$lib/components/shell/shell.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.pcss';
	import SEO from '$lib/components/seo/seo.svelte';
	import CookiePreferencesBanner from '$lib/components/cookie-prefences-banner/cookie-preferences-banner.svelte';
	import { Toaster } from "$lib/components/ui/sonner";
	import { onMount } from 'svelte';
	import { auth, setAuth } from '$lib/client/auth';
	import { user } from '$lib/client/stores';
	import { browserLocalPersistence, onAuthStateChanged, setPersistence, type User } from 'firebase/auth';
	
	onMount(() => {
		const authentication = auth();
		setPersistence(authentication, browserLocalPersistence);
		onAuthStateChanged(authentication, (currentUser: User | null) => {
			currentUser?.getIdTokenResult(true)?.then((tokenRes) => {
				setAuth(tokenRes?.token);
				user.set(currentUser);
			});
		});
  });
	
	$: pageTitle = $page?.data?.seo?.title;
  $: pageDescription = $page?.data?.seo?.description;
	$: path = $page.url.pathname;
	$: cookieBannerOpen = $page?.data?.cookieBannerOpen;
	$: preferences = $page?.data?.cookiePreferences;
</script>

<ModeWatcher defaultMode='dark'/>
<SEO title={pageTitle} description={pageDescription} slug={path}/>
<div class="bg-background w-full h-full p-1 font-mono overflow-hidden">
  <div class="border rounded-lg h-full overflow-hidden">
		<Shell navigationPath={path}>
			<slot />
		</Shell>
	</div>
</div>
<CookiePreferencesBanner open={cookieBannerOpen} {preferences}/>
<Toaster />