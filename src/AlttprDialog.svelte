<script>
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import SpriteSelector from "./SpriteSelector.svelte";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";
  import { downloadAndSaveFile } from "./utils";
  import GlobalLoadingSpinner from "./GlobalLoadingSpinner.svelte";

  let selectedSprite;
  export let open;

  export let directory;
  const dispatch = createEventDispatcher();

  let loading = false;

  async function saveDaily() {
    loading = true;
    try {
      await downloadAndSaveFile(
        "/pyz3r/alttpr/daily",
        { sprite: selectedSprite },
        directory
      );
      dispatch("completed");
    } catch (e) {
      console.error("daily error", e);
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
  <Title id="daily-title">Daily</Title>
  <Content id="daily-content">
    <SpriteSelector bind:selected="{selectedSprite}" />
  </Content>
  <Actions>
    <Button on:click="{() => (open = false)}">
      <Label>Cancel</Label>
    </Button>
    <Button on:click="{saveDaily}">
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>
