import {writable, derived} from 'svelte/store';

export const sprites = writable([]);

export const selectedSprite = writable(localStorage.getItem("sprite") || "Link");
selectedSprite.subscribe((value) => {
    localStorage.setItem("sprite", value)
})
