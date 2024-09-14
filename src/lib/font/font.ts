import { fonts, fontStorageKey } from "$lib/configurations/font";
import { Font } from "$lib/enums/font";
import { font } from "$lib/client/stores";

function getFontClass(font: Font):`font-${Font}` {
    return `font-${font}`;
}

export const changeFont = (newFont: Font) => {
    font.set(newFont)
    document.documentElement.classList.add(getFontClass(newFont));
    fonts.forEach(t => {
        if (t.value !== newFont) {
            document.documentElement.classList.remove(getFontClass(t.value));
        }
    });
}

export const getFont = (): Font => {
    return localStorage.getItem(fontStorageKey) as Font ?? Font.Default;
}