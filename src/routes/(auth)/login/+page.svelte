<script lang="ts">
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import { type Auth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
  import { Separator } from "$lib/components/ui/separator";
	import { auth, setAuth } from "$lib/client/auth";
	import { user } from "$lib/client/stores";

  async function continueWithGoogle(auth: Auth) {
    const provider = new GoogleAuthProvider();
    const signInWithPopupRes = await signInWithPopup(auth, provider).catch((_error) => setAuth());
    const tokenRes = await signInWithPopupRes?.user?.getIdTokenResult();
    setAuth(tokenRes?.token)
      .then((authRes) => {
        authRes.json().then((res) => {
          if (res?.success) {
            user.set(res.user);
          }
        })
      });
    goto('/');
  }
  
</script>
<div class="flex flex-col items-center gap-4 border rounded-lg p-4">
  <h1 class="text-2xl">Login</h1>
  <Separator />
  <Button class="w-full" variant="default" on:click={() => continueWithGoogle(auth())}>
    <span class="inline-flex items-center gap-2"><img src="images/google_icon.svg" alt="Google icon" width="24" height="24" /> Continue with Google</span>
  </Button>
</div>
