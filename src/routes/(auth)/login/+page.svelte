<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { type Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { Separator } from "$lib/components/ui/separator";
	import { auth, setAuth } from "$lib/client/auth";
	import { user } from "$lib/client/stores";
	import { LoaderCircle } from "lucide-svelte";
	import { t } from "$lib/i18n/translations";

  let authenticationInProgress = false;

  async function continueWithGoogle(auth: Auth) {
    authenticationInProgress = true;
    const provider = new GoogleAuthProvider();
    const signInWithPopupRes = await signInWithPopup(auth, provider).catch((_error) => setAuth());
    const tokenRes = await signInWithPopupRes?.user?.getIdTokenResult();
    setAuth(tokenRes?.token)
      .then((authRes) => {
        authRes.json().then((res) => {
          if (res?.success) {
            user.set(res.user);
            goto('/');
          }
          authenticationInProgress = false;
        }, (_) => authenticationInProgress = false);
      }, (_) => authenticationInProgress = false);
  }
  
</script>
<div class="flex flex-col items-center gap-4 border rounded-lg p-4">
  <h1 class="text-2xl">{$t('common.login')}</h1>
  <Separator />
  <Button class="w-full" disabled={authenticationInProgress} variant="default" on:click={() => continueWithGoogle(auth())}>
    <span class="inline-flex items-center gap-2">
      {#if authenticationInProgress}
        <LoaderCircle class="animate-spin" size=16/>
      {:else}
        <img src="images/google_icon.svg" alt="Google icon" width="24" height="24" />
      {/if}
      {$t('common.continue_with_google')}
    </span>
  </Button>
</div>
