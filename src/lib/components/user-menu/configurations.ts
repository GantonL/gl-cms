import { setAuth } from "$lib/client/auth";
import { user } from "$lib/client/stores";
import type { UserMenuItem } from "$lib/models/menu-item";
import { signOut, type Auth } from "firebase/auth";
import { LogIn, LogOut, Settings } from "lucide-svelte";

export const LoggedOutUserMenuConfiguration: UserMenuItem[] = [
  {
    group: [
      { label: 'common.login', 
        link: '/login',
        icon: LogIn, 
      },
    ]
  }
];

export const LoggedInUserMenuConfiguration: UserMenuItem[] = [
  {
    group: [
      { 
        label: 'common.logout', 
        icon: LogOut, 
        link: '/login',
        onClick: (auth: Auth) => {
          setAuth();
          user.set(undefined);
          return signOut(auth);
        }
      },
      {
        label: 'common.settings',
        link: '/settings',
        icon: Settings,
      },
    ]
  }
];
