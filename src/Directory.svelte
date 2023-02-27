<style lang="scss">
  .hidden {
    display: none;
  }

  .right {
    position: absolute;
    right: 0;
  }
</style>

<script>
  import List, { Graphic, Item, Text } from "@smui/list";
  import IconButton from "@smui/icon-button";
  import { DirEntryType, ReadDirectoryRequest } from "./sni-client/sni_pb";
  import File from "./File.svelte";
  import CircularProgress from "@smui/circular-progress";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import SpriteSelector from "./SpriteSelector.svelte";
  import GlobalLoadingSpinner from "./GlobalLoadingSpinner.svelte";
  import { device, fileSystemClient } from "./store";
  import { downloadAndSaveFile, saveFile } from "./utils";
  import AlttprDialog from "./AlttprDialog.svelte";

  export let directory;
  export let indent;
  export let expanded = false;
  let fileInput;
  let files;

  let promise;
  $: expanded, expanded ? loadFiles() : (promise = null);

  let openAlttpr;

  let loading = false;

  function saveReader(fileReader, file) {
    loading = true;
    fileReader.onload = function (e) {
      saveFile(directory.fullpath + "/" + file.name, e.target.result).finally(
        () => {
          loadFiles();
          loading = false;
        }
      );
    };
    fileReader.onerror = function () {
      files = null;
      loading = false;
    };
    fileReader.readAsArrayBuffer(file);
  }

  function uploadFiles() {
    const file = files[0];
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    saveReader(fileReader, file);
  }

  function loadFiles() {
    if (!$fileSystemClient || !$device) return;

    const request = new ReadDirectoryRequest();
    request.setUri($device.uri);
    request.setPath(directory.fullpath);
    promise = new Promise((resolve) => {
      $fileSystemClient.readDirectory(request, {}, (err, res) => {
        if (res) {
          let entries = res
            .getEntriesList()
            .map((e) => ({
              type: e.getType(),
              name: e.getName(),
              fullpath:
                directory.fullpath +
                (directory.fullpath !== "/" ? "/" : "") +
                e.getName(),
            }))
            .sort(function (a, b) {
              let x = a.name.toLowerCase();
              let y = b.name.toLowerCase();
              if (x < y) {
                return -1;
              }
              if (x > y) {
                return 1;
              }
              return 0;
            });
          resolve(entries);
        } else {
          console.error("read directory", err);
        }
      });
    });
  }

  function reload() {
    promise = null;
    loadFiles();
  }
</script>

<GlobalLoadingSpinner isLoading="{loading}" />

<AlttprDialog
  bind:open="{openAlttpr}"
  directory="{directory.fullpath}"
  on:completed="{loadFiles}"
/>

<input
  class="hidden"
  id="file-to-upload"
  type="file"
  accept=".smc,.sfc"
  bind:files="{files}"
  bind:this="{fileInput}"
  on:change="{uploadFiles}"
/>
<Item wrapper>
  <Item
    style="padding-left: {indent * 24}px"
    on:SMUI:action="{() => (expanded = !expanded)}"
  >
    <Graphic class="material-icons">folder</Graphic>
    <Text>&nbsp;{directory.name}</Text>
    <span class="right">
      <span>
        <IconButton
          class="material-icons"
          on:click$stopPropagation="{() => (openAlttpr = true)}"
        >
          event_repeat
        </IconButton>
      </span>
      <span>
        <IconButton
          class="material-icons"
          on:click$stopPropagation="{() => fileInput.click()}"
        >
          add
        </IconButton>
      </span>
    </span>
  </Item>

  <List class="sub-list">
    {#await promise}
      <Item style="padding-left: {(indent + 1) * 24}px">
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
      </Item>
    {:then entries}
      {#if entries}
        {#each entries as child}
          {#if child.type === DirEntryType.DIRECTORY && !child.name.match(/^(sd2snes|\..*)$/)}
            <svelte:self
              style="padding-left: {(indent + 1) * 24}px"
              directory="{child}"
              indent="{indent + 1}"
              parent="{child.fullpath}"
            />
          {/if}
          {#if child.type === DirEntryType.FILE && child.name.match(/^(?!\._).*\.(smc|sfc)$/)}
            <File
              name="{child.name}"
              indent="{indent + 1}"
              fullpath="{child.fullpath}"
              reloadParent="{reload}"
            />
          {/if}
        {/each}
      {/if}
    {/await}
  </List>
</Item>
