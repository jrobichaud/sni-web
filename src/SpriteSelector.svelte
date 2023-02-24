<script>
    import Select from "@smui/select/index";
    import {Option} from "@smui/select";
    import {sprites, selectedSprite} from "./store";

    export let selected = $selectedSprite;
    $: selected, selected && selectedSprite.set(selected);
</script>
<Select variant="filled" bind:value={selected} label="Sprite" style="width: 100%;">
    {#each $sprites as sprite}
        <Option value={sprite.name}><img src={sprite.preview} alt="Not Found"/>&nbsp;{sprite.name}</Option>
    {/each}
</Select>
