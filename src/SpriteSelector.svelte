<style>
  .icon {
    padding-left: 8px;
    padding-right: 8px;
  }
</style>

<script>
  import Select from "@smui/select";
  import { Option } from "@smui/select";
  import { sprites, selectedSprite, previewSprite } from "./store";
  import { onMount } from "svelte";

  export let selected = $selectedSprite;
  $: selected, selected && selectedSprite.set(selected);

  onMount(() => {
    selected = $selectedSprite;
  });
</script>

<Select
  variant="filled"
  bind:value="{selected}"
  label="Sprite"
  style="width: 100%;overflow: visible"
  withLeadingIcon
>
  <svelte:fragment slot="leadingIcon">
    <img class="icon" src="{$previewSprite}" alt="" />
  </svelte:fragment>
  {#each $sprites as sprite}
    <Option value="{sprite.name}"
      ><img
        class="icon"
        src="{sprite.preview}"
        alt="Not Found"
      />{sprite.name}</Option
    >
  {/each}
</Select>
