import { theme } from "$lib/client/stores";
import { themes } from "$lib/configurations/theme";
import type { Themes } from "$lib/enums/theme";

function getThemeClass(theme: Themes):`theme-${Themes}` {
    return `theme-${theme}`;
}

export const changeTheme = (newTheme: Themes) => {
    theme.set(newTheme);
    document.documentElement.classList.add(getThemeClass(newTheme));
    themes.forEach(t => {
        if (t.value !== newTheme) {
            document.documentElement.classList.remove(getThemeClass(t.value));
        }
    });
}