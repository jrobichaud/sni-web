import { writable, derived } from "svelte/store";

export const sprites = writable([]);

export const selectedSprite = writable(
  localStorage.getItem("sprite") || "Link"
);
selectedSprite.subscribe((value) => {
  localStorage.setItem("sprite", value);
});

export const rawAlttprSettings = writable({});

export const alttprSettings = derived(
  rawAlttprSettings,
  ($rawAlttprSettings) => {
    const copy = { ...$rawAlttprSettings };
    copy.goal = copy.goals;
    delete copy.goals;
    return copy;
  }
);

export const fileSystemClient = writable(null);
export const device = writable(null);
