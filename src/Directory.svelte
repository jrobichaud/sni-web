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
  import MenuSurface from "@smui/menu-surface";
  import IconButton from "@smui/icon-button";
  import { DirEntryType, ReadDirectoryRequest } from "./sni-client/sni_pb";
  import File from "./File.svelte";
  import CircularProgress from "@smui/circular-progress";
  import GlobalLoadingSpinner from "./GlobalLoadingSpinner.svelte";
  import { device, fileSystemClient } from "./store";
  import { saveFile } from "./utils";
  import AlttprDialog from "./alttpr/AlttprDialog.svelte";
  import IconifyIcon from "@iconify/svelte";
  import { Icon } from "@smui/button";

  import SMRDialog from "./smr/SMRDialog.svelte";

  export let directory;
  export let indent;
  export let expanded = false;
  let fileInput;
  let files;

  let surface;
  let anchor;

  let promise;
  $: expanded, expanded ? loadFiles() : (promise = null);

  let openAlttpr;
  let openSMR;

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

<SMRDialog
  bind:open="{openSMR}"
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
  <div style="overflow:visible; position:relative;">
    <Item
      style="padding-left: {indent * 24}px; position: relative"
      on:SMUI:action="{() => (expanded = !expanded)}"
    >
      <Graphic class="material-icons">folder</Graphic>
      <Text>&nbsp;{directory.name}</Text>
      <div class="right" bind:this="{anchor}">
        <IconButton
          on:click$stopPropagation="{() => {
            surface.setOpen(true);
          }}"
        >
          <Icon class="material-icons">more_horiz</Icon>
        </IconButton>
      </div>
    </Item>
    <MenuSurface
      bind:this="{surface}"
      anchorCorner="BOTTOM_RIGHT"
      anchor="{false}"
      bind:anchorElement="{anchor}"
    >
      <div
        style="margin: 1em; display: flex; flex-direction: column; align-items: flex-end;"
      >
        <IconButton
          on:click$stopPropagation="{() => {
            openAlttpr = true;
            surface.setOpen(false);
          }}"
        >
          <IconifyIcon icon="mdi:triforce" />
        </IconButton>
        <IconButton
          on:click$stopPropagation="{() => {
            openSMR = true;
            surface.setOpen(false);
          }}"
        >
          <IconifyIcon icon="game-icons:metroid" />
        </IconButton>
        <IconButton
          class="material-icons"
          on:click$stopPropagation="{() => {
            fileInput.click();
            surface.setOpen(false);
          }}"
        >
          add
        </IconButton>
      </div>
    </MenuSurface>
  </div>

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
