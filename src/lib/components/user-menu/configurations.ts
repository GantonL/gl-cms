import { setAuth } from "$lib/client/auth";
import { user } from "$lib/client/stores";
import type { UserMenuItem } from "$lib/models/menu-item";
import { signOut, type Auth } from "firebase/auth";
import { LogIn, LogOut } from "lucide-svelte";
 
export const LoggedOutUserMenuConfiguration: UserMenuItem[] = [
  {
    group: [
      { label: 'Login', icon: LogIn, link: '/login' },
    ]
  }
];

export const LoggedInUserMenuConfiguration: UserMenuItem[] = [
  {
    group: [
      { label: 'Logout', icon: LogOut, link: '/login',
       onClick: (auth: Auth) => {
        setAuth();
        user.set(undefined);
        return signOut(auth);
      } },
    ]
  }
];
