<script>
  import { alttprSettings } from "./store";
  import Select, { Option } from "@smui/select";
  import { onMount } from "svelte";

  export let selectedSettings = {};
  let preset = "default";

  const sections = [
    {
      name: "Item Placement",
      fields: [
        {
          name: "Glitches Required",
          key: "glitches_required",
        },
        {
          name: "Item Placement",
          key: "item_placement",
        },
        {
          name: "Dungeon Item Shuffle",
          key: "dungeon_items",
        },
        {
          name: "Accessibility",
          key: "accessibility",
        },
      ],
    },
    {
      name: "Goal",
      fields: [
        {
          name: "Goal",
          key: "goal",
        },
        {
          name: "Open Tower",
          key: "tower_open",
        },
        {
          name: "Ganon Vulnerable",
          key: "ganon_open",
        },
      ],
    },
    {
      name: "Gameplay",
      fields: [
        {
          name: "World State",
          key: "world_state",
        },
        {
          name: "Entrance Shuffle",
          key: "entrance_shuffle",
        },
        {
          name: "Boss Shuffle",
          key: "boss_shuffle",
        },
        {
          name: "Enemy Shuffle",
          key: "enemy_shuffle",
        },
        {
          name: "Hints",
          key: "hints",
        },
      ],
    },
    {
      name: "Difficulty",
      fields: [
        {
          name: "Swords",
          key: "weapons",
        },
        {
          name: "Item Pool",
          key: "item_pool",
        },
        {
          name: "Item Functionality",
          key: "item_functionality",
        },
        {
          name: "Enemy Damage",
          key: "enemy_damage",
        },
        {
          name: "Enemy Health",
          key: "enemy_health",
        },
      ],
    },
  ];
  onMount(() => {
    let defaultPreset = $alttprSettings.presets?.default || {};

    selectedSettings = {
      ...defaultPreset,
      pot_shuffle: "off",
      spoilers: "off",
    };
  });

  function valueChanged(a) {
    preset = "custom";
  }

  $: preset, presetChanged();
  function presetChanged() {
    if (preset !== "custom") {
      selectedSettings = {
        ...$alttprSettings.presets[preset],
        pot_shuffle: "off",
        spoilers: "off",
      };
    }
  }
</script>

<div>
  {#if $alttprSettings["presets"]}
    <Select label="Presets" bind:value="{preset}">
      {#each Object.entries($alttprSettings["presets"]) as [value, label]}
        <Option value="{value}">{value}</Option>
      {/each}
    </Select>
  {/if}
</div>

{#each sections as section}
  <div>
    <h6>{section.name}</h6>
    {#each section.fields as field}
      <Select
        label="{field.name}"
        bind:value="{selectedSettings[field.key]}"
        on:SMUI:action="{valueChanged}"
      >
        {#each Object.entries($alttprSettings[field.key]) as [value, label]}
          <Option value="{value}">{label}</Option>
        {/each}
      </Select>
    {/each}
  </div>
{/each}
