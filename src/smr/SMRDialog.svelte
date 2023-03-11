<style lang="scss">
  :global(.smr .mdc-dialog__surface) {
    min-height: 400px;
  }

  :global(.smr .mdc-dialog__content) {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
</style>

<script>
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { downloadAndSaveFile } from "../utils";
  import GlobalLoadingSpinner from "../GlobalLoadingSpinner.svelte";

  export let open;

  export let directory;
  const dispatch = createEventDispatcher();

  let loading = false;
  let active = "Daily";
  let selectedSettings;

  async function saveGenerate() {
    await downloadAndSaveFile("/pyz3r/sm/generate", {}, directory);
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
  <Title id="smr-title">Super Metroid Randomizer</Title>
  <Content id="smr-content" />
  <Actions>
    <Button on:click="{() => (open = false)}">
      <Label>Cancel</Label>
    </Button>
    <Button on:click="{save}">
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>
