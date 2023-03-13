<style lang="scss">
  :global(.smr .mdc-dialog__surface) {
    min-height: 400px;
  }

  :global(.smr .mdc-dialog__content) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 400px;
  }
</style>

<script>
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { downloadAndSaveFile } from "../utils";
  import GlobalLoadingSpinner from "../GlobalLoadingSpinner.svelte";
  import Select, { Option } from "@smui/select";
  import Icon from "@iconify/svelte";

  export let open;

  export let directory;
  const dispatch = createEventDispatcher();

  let loading = false;
  let active = "Daily";
  let selectedSettings;
  let preset = "regular";
  let presets = [
    ["newbie", "newbie"],
    ["casual", "casual"],
    ["regular", "regular"],
    ["veteran", "veteran"],
    ["expert", "expert"],
    ["master", "master"],
  ];

  let randoPreset = "default";
  let randoPresets = [
    ["default", "Standard presets", "VARIA randomizer default settings"],
    [
      "Chozo_Speedrun",
      "Standard presets",
      "speedrun progression speed with Chozo split",
    ],
    ["free", "Standard presets", "easiest possible settings"],
    [
      "haste",
      "Standard presets",
      "inspired by DASH randomizer with Nerfed Charge / Progressive Suits",
    ],
    [
      "vanilla",
      "Standard presets",
      "closest possible to vanilla Super Metroid",
    ],
    [
      "hud",
      "Hud presets",
      "Full rando with remaining major upgrades in the area shown in the HUD",
    ],
    [
      "hud_hard",
      "Hud presets",
      "Low resources and VARIA HUD enabled to help you track of actual items count",
    ],
    ["hud_start", "Hud presets", "Non-vanilla start with Major or Chozo split"],
    ["scavenger_hard", "Scavenger presets", "Pretty hostile Scavenger mode"],
    [
      "scavenger_random",
      "Scavenger presets",
      "Randomize everything within Scavenger mode",
    ],
    ["scavenger_speedrun", "Scavenger presets", "Quickest Scavenger settings"],
    [
      "scavenger_vanilla_but_not",
      "Scavenger presets",
      "Items are vanilla, but area and bosses are not",
    ],
    ["way_of_chozo", "Area presets", "chozo split with boss randomization"],
    [
      "where_am_i",
      "Area presets",
      "Area mode with random start location and early morph",
    ],
    ["where_is_morph", "Area presets", "Area mode with late Morph"],
    [
      "doors_long",
      "Doors presets",
      "be prepared to hunt for beams and ammo to open doors",
    ],
    [
      "doors_short",
      "Doors presets",
      "uses Chozo/speedrun settings for a quicker door color rando",
    ],
    [
      "minimizer",
      "Minimizer presets",
      "Typical 'boss rush' settings with random start and nerfed charge",
    ],
    [
      "minimizer_hardcore",
      "Minimizer presets",
      "Have fun 'rushing' bosses with no equipment on a tiny map",
    ],
    ["minimizer_maximizer", "Minimizer presets", "No longer a boss rush"],
    [
      "objectives_all_bosses",
      "Objectives presets",
      "Kill all bosses/minibosses",
    ],
    [
      "objectives_clear_areas",
      "Objectives presets",
      "Clear 5 random areas and end with fast Tourian",
    ],
    [
      "objectives_memes",
      "Objectives presets",
      "Do all the memes and rush to the ship",
    ],
    [
      "objectives_short",
      "Objectives presets",
      "3 random short objectives and Disabled Tourian",
    ],
    [
      "objectives_long",
      "Objectives presets",
      "5 random long objectives and Vanilla Tourian",
    ],
    [
      "objectives_robots_notweaks",
      "Objectives presets",
      "Collect Bomb and Space Jump to activate the robots, then rush to the ship",
    ],
    ["hardway2hell", "Hard presets", "harder highway2hell"],
    ["highway2hell", "Hard presets", "favors suitless seeds"],
    ["stupid_hard", "Hard presets", "hardest possible settings"],
    [
      "objectives_hard_heat",
      "Hard presets",
      "All Norfair-related objectives, possibly without a suit",
    ],
    [
      "objectives_hard_water",
      "Hard presets",
      "All Maridia-related objectives, possibly without a suit",
    ],
    ["all_random", "Random presets", "all the parameters set to random"],
    [
      "quite_random",
      "Random presets",
      "randomizes a few significant settings to have various seeds",
    ],
    [
      "surprise",
      "Random presets",
      "quite_random with Area/Boss/Doors/Start settings randomized",
    ],
    [
      "Season_Races",
      "Tournament presets",
      "rando league races (Majors/Minors split)",
    ],
    [
      "SMRAT2021",
      "Tournament presets",
      "Randomizer Accessible Tournament 2021",
    ],
    ["VARIA_Weekly", "Tournament presets", "Casual logic community races"],
    ["RLS4W2", "Tournament presets", "Rando League Season 4 week 2"],
    ["RLS4W3", "Tournament presets", "Rando League Season 4 week 3"],
    ["RLS4W4", "Tournament presets", "Rando League Season 4 week 4"],
    ["RLS4W5", "Tournament presets", "Rando League Season 4 week 5"],
    ["RLS4W7", "Tournament presets", "Rando League Season 4 week 7"],
    [
      "Torneio_SGPT3_stage1",
      "Tournament presets",
      "SG Português Tournament 2022 group stage",
    ],
    [
      "Torneio_SGPT3_stage2",
      "Tournament presets",
      "SG Português Tournament 2022 playoff stage",
    ],
    [
      "SGLive2022_Game_1",
      "Tournament presets",
      "SGLive 2022 Randomizer Tournament race 1",
    ],
    [
      "SGLive2022_Game_2",
      "Tournament presets",
      "SGLive 2022 Randomizer Tournament race 2",
    ],
    [
      "SGLive2022_Game_3",
      "Tournament presets",
      "SGLive 2022 Randomizer Tournament race 3",
    ],
    ["Boyz_League_SM_Rando", "Tournament presets", "Boyz League Tournament"],
  ];

  async function saveGenerate() {
    await downloadAndSaveFile(
      "/pyz3r/sm/generate",
      {
        race: false,
        skills_preset: preset,
        settings_preset: randoPreset,
      },
      directory
    );
  }

  async function save() {
    loading = true;
    try {
      await saveGenerate();
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
  class="smr"
  aria-labelledby="smr-title"
  aria-describedby="smr-content"
>
  <Title id="smr-title">
    <Icon icon="game-icons:metroid" />
    <span>&nbsp;Super Metroid Randomizer</span>
  </Title>
  <Content id="smr-content">
    <Select label="Difficulty" bind:value="{preset}">
      {#each presets as [value, label]}
        <Option value="{value}">{label}</Option>
      {/each}
    </Select>

    <Select label="Presets" bind:value="{randoPreset}">
      {#each randoPresets as [value, category, label]}
        <Option value="{value}">
          <div style="display: flex; flex-direction: column;">
            <div class="mdc-typography--body2">
              <strong>{value}&nbsp;({category})</strong>
            </div>
            <div
              style="white-space: nowrap;"
              class="mdc-typography--caption overflow-ellipsis"
            >
              {label}
            </div>
          </div></Option
        >
      {/each}
    </Select>
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
