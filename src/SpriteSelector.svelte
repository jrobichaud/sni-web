<script>
    import Select from "@smui/select/index";
    import {Option} from "@smui/select";
    import {sprites, selectedSprite} from "./store";
    import {onMount} from "svelte";

    export let selected = $selectedSprite;
    $: selected, selected && selectedSprite.set(selected);

    onMount(() => {
        selected = $selectedSprite;
    })
</script>
<Select variant="filled" bind:value={selected} label="Sprite" style="width: 100%;overflow: visible">
    {#each $sprites as sprite}
        <Option value={sprite.name}><img src={sprite.preview} alt="Not Found"/>&nbsp;{sprite.name}</Option>
    {/each}
</Select>
