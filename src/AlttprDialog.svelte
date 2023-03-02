<style lang="scss">
  :global(.daily .mdc-dialog__surface) {
    min-height: 400px;
  }

  :global(.daily .mdc-dialog__content) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .tabContent {
    overflow: scroll;
  }
</style>

<script>
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Tab, { Label as TabLabel } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import SpriteSelector from "./SpriteSelector.svelte";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { downloadAndSaveFile } from "./utils";
  import GlobalLoadingSpinner from "./GlobalLoadingSpinner.svelte";
  import AlttprRandomizer from "./AlttprRandomizer.svelte";
  import { selectedSprite } from "./store";

  export let open;

  export let directory;
  const dispatch = createEventDispatcher();

  let loading = false;
  let active = "Daily";
  let selectedSettings;

  async function saveDaily() {
    await downloadAndSaveFile(
      "/pyz3r/alttpr/daily",
      { sprite: $selectedSprite },
      directory
    );
  }

  function deriveSettings() {
    let expected = {
      glitches: "none",
      item_placement: "advanced",
      dungeon_items: "standard",
      accessibility: "items",
      goal: "ganon",
      crystals: { ganon: "7", tower: "7" },
      mode: "open",
      entrances: "none",
      hints: "on",
      weapons: "randomized",
      item: { pool: "normal", functionality: "normal" },
      tournament: false,
      spoilers: "on",
      lang: "en",
      enemizer: {
        boss_shuffle: "none",
        enemy_shuffle: "none",
        enemy_damage: "default",
        enemy_health: "default",
      },
    };

    return {
      glitches: selectedSettings.glitches_required,
      item_placement: selectedSettings.item_placement,
      dungeon_items: selectedSettings.dungeon_items,
      accessibility: selectedSettings.accessibility,
      goal: selectedSettings.goal,
      crystals: {
        ganon: selectedSettings.ganon_open,
        tower: selectedSettings.tower_open,
      },
      mode: selectedSettings.world_state,
      entrances: selectedSettings.entrance_shuffle,
      hints: selectedSettings.hints,
      weapons: selectedSettings.weapons,
      item: {
        pool: selectedSettings.item_pool,
        functionality: selectedSettings.item_functionality,
      },
      tournament: false,
      spoilers: selectedSettings.spoilers,
      lang: "en",
      enemizer: {
        boss_shuffle: selectedSettings.boss_shuffle,
        enemy_shuffle: selectedSettings.enemy_shuffle,
        enemy_damage: selectedSettings.enemy_damage,
        enemy_health: selectedSettings.enemy_health,
      },
    };
  }
  async function saveGenerate() {
    await downloadAndSaveFile(
      "/pyz3r/alttpr/generate",
      { sprite: $selectedSprite, settings: deriveSettings() },
      directory
    );
  }

  async function save() {
    loading = true;
    try {
      if (active === "Daily") {
        await saveDaily();
      } else if (active === "Generate") {
        await saveGenerate();
      }
      dispatch("completed");
    } catch (e) {
      console.error("save error", e);
    } finally {
      loading = false;
    }
  }
</script>

<GlobalLoadingSpinner isLoading="{loading}" />
<Dialog
  bind:open="{open}"
  class="daily"
  aria-labelledby="daily-title"
  aria-describedby="daily-content"
>
  <Title id="daily-title">Alttpr</Title>
  <Content id="daily-content">
    <TabBar tabs="{['Daily', 'Generate']}" let:tab bind:active="{active}">
      <Tab tab="{tab}">
        <TabLabel>{tab}</TabLabel>
      </Tab>
    </TabBar>
    <SpriteSelector />
    <div class="tabContent">
      {#if active === "Generate"}
        <AlttprRandomizer bind:selectedSettings="{selectedSettings}" />
      {/if}
    </div>
  </Content>
  <Actions>
    <Button on:click="{() => (open = false)}">
      <Label>Cancel</Label>
    </Button>
    <Button on:click="{save}">
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>
