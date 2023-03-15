<style>
  .right {
    position: absolute;
    right: 0;
  }
</style>

<script>
  import { Item, Text, Graphic } from "@smui/list";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import { BootFileRequest, RemoveFileRequest } from "./sni-client/sni_pb";
  import IconButton from "@smui/icon-button";
  import Button, { Icon, Label } from "@smui/button";
  import MenuSurface from "@smui/menu-surface";

  import { fileSystemClient, device } from "./store";

  export let name;
  export let indent;
  export let fullpath;
  export let reloadParent;

  let open;
  let surface;
  let anchor;

  function onClick() {
    let request = new BootFileRequest();
    request.setUri($device.uri);
    request.setPath(fullpath);
    $fileSystemClient.bootFile(request);
  }
  function deleteFile() {
    let request = new RemoveFileRequest();
    request.setUri($device.uri);
    request.setPath(fullpath);
    open = false;
    $fileSystemClient.removeFile(request, (err, res) => {
      reloadParent();
    });
  }
</script>

<Dialog
  bind:open="{open}"
  aria-labelledby="simple-title"
  aria-describedby="simple-content"
>
  <Title id="simple-title">Delete?</Title>
  <Content id="simple-content">{fullpath}</Content>
  <Actions>
    <Button on:click="{() => (open = false)}">
      <Label>No</Label>
    </Button>
    <Button on:click="{() => deleteFile()}">
      <Label>Yes</Label>
    </Button>
  </Actions>
</Dialog>

<div style="overflow:visible; position:relative;">
  <Item
    style="padding-left: {(indent + 1) * 24}px; position: relative;"
    on:SMUI:action="{onClick}"
  >
    <Graphic class="material-icons">videogame_asset</Graphic>
    <Text>{name}</Text>
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
        class="material-icons"
        on:click$stopPropagation="{() => {
          open = true;
          surface.setOpen(false);
        }}"
      >
        delete
      </IconButton>
    </div>
  </MenuSurface>
</div>
