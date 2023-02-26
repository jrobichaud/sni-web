<script>
    import Select from "@smui/select";
    import {Option} from "@smui/select";
    import {sprites, selectedSprite} from "./store";
    import {onMount} from "svelte";

    export let selected = $selectedSprite;
    $: selected, selected && selectedSprite.set(selected);

    onMount(() => {
        selected = $selectedSprite;
    })
</script>

<style>
    .icon {
        padding-left: 8px;
        padding-right: 8px;
    }
</style>
<Select variant="filled" bind:value={selected} label="Sprite" style="width: 100%;overflow: visible" withLeadingIcon>
    <svelte:fragment slot="leadingIcon">
        {#if selected }
            <img class="icon" src={$sprites.find(s=>selected===s.name)?.preview} alt="Not Found"/>
        {/if}
    </svelte:fragment>
    {#each $sprites as sprite}
        <Option value={sprite.name}><img class="icon" src={sprite.preview} alt="Not Found"/>{sprite.name}</Option>
    {/each}
</Select>
