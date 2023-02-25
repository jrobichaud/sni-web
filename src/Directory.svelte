<script>
    import List, {Item, Text} from "@smui/list";
    import IconButton from '@smui/icon-button';
    import {DirEntryType, PutFileRequest, ReadDirectoryRequest} from "./sni-client/sni_pb";
    import File from "./File.svelte";
    import CircularProgress from '@smui/circular-progress';
    import Icon from "@smui/select/icon";
    import Dialog, {Actions, Content, Title} from "@smui/dialog";
    import Button, {Label} from "@smui/button";
    import SpriteSelector from "./SpriteSelector.svelte";
    import GlobalLoadingSpinner from "./GlobalLoadingSpinner.svelte";

    export let directory;
    export let fileSystemClient;
    export let device;
    export let indent;
    export let expanded = false;
    let fileInput;
    let files;

    let promise;
    $: expanded, expanded ? loadFiles() : promise = null;

    let dailyOpen;

    let selectedSprite;
    let loading = false;


    function saveFile(path, bytes) {
        return new Promise(resolve => {
            let request = new PutFileRequest();
            request.setUri(device.uri)
            request.setPath(path);
            request.setData(new Uint8Array(bytes))
            fileSystemClient.putFile(request, (err, res) => {
                resolve();
                files = null;
            })
        })

    }

    function saveReader(fileReader, file) {
        loading = true;
        fileReader.onload = function (e) {
            saveFile(directory.fullpath + "/" + file.name, e.target.result).finally(() => {
                loadFiles();
                loading = false;
            });
        };
        fileReader.onerror = function () {
            files = null;
            loading = false;
        }
        fileReader.readAsArrayBuffer(file);
    }

    function uploadFiles() {
        const file = files[0];
        if (!file) {
            return;
        }
        const fileReader = new FileReader()
        saveReader(fileReader, file);
    }

    function loadFiles() {
        if (!fileSystemClient || !device)
            return;

        const request = new ReadDirectoryRequest()
        request.setUri(device.uri);
        request.setPath(directory.fullpath)
        promise = new Promise(resolve => {
            fileSystemClient.readDirectory(request, {}, (err, res) => {
                if (res) {
                    let entries = res.getEntriesList().map((e) => ({
                        type: e.getType(),
                        name: e.getName(),
                        fullpath: directory.fullpath + (directory.fullpath !== "/" ? "/" : "") + e.getName(),
                    })).sort(function (a, b) {
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
                    console.error("read directory", err)
                }

            });
        })
    }

    function reload() {
        promise = null;
        loadFiles();
    }
    async function streamToArrayBuffer(stream) {
        let result = new Uint8Array(0);
        const reader = stream.getReader();
        while (true) { // eslint-disable-line no-constant-condition
            const {done, value} = await reader.read();
            if (done) {
                break;
            }

            const newResult = new Uint8Array(result.length + value.length);
            newResult.set(result);
            newResult.set(value, result.length);
            result = newResult;
        }
        return result
    }
    async function saveDaily() {
        loading = true;
        try {
            const response = await fetch('/pyz3r/alttpr/daily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sprite: selectedSprite})
            });
            const filename = response.headers.get('content-disposition')
                .split(';')
                .find(n => n.includes('filename='))
                .replace('filename=', '')
                .replaceAll('\"', '')
                .trim()
            ;
            let data = await streamToArrayBuffer(await response.body);
            await saveFile(directory.fullpath + "/" + filename, data);
            loadFiles();
        }
        catch (e) {
            console.error("daily error", e)
        }
        finally {
            loading = false;
        }
    }
</script>

<style lang="scss">
  .hidden {
    display: none;
  }

  .right {
    position: absolute;
    right: 0;
  }
  .big-modal {
    height: 100%;
  }

    :global(.daily .mdc-dialog__surface) {
      min-height: 400px;
    }
</style>

<GlobalLoadingSpinner isLoading={loading} />

<Dialog
        bind:open={dailyOpen}
        class="daily"
        aria-labelledby="daily-title"
        aria-describedby="daily-content"
>
    <Title id="daily-title">Daily</Title>
    <Content id="daily-content" >
        <SpriteSelector bind:selected={selectedSprite}></SpriteSelector>
    </Content>
    <Actions>
        <Button on:click={() => (dailyOpen = false)}>
            <Label>Cancel</Label>
        </Button>
        <Button on:click={saveDaily}>
            <Label>Yes</Label>
        </Button>
    </Actions>
</Dialog>


<input class="hidden" id="file-to-upload" type="file" accept=".smc,.sfc" bind:files bind:this={fileInput}
       on:change={uploadFiles}/>
<Item wrapper>
    <Item style="padding-left: {indent*24}px" on:SMUI:action={()=>expanded = !expanded}>
        <Icon class="material-icons">folder</Icon>
        <Text>&nbsp;{directory.name}</Text>
        <span class="right">
            <span>
            <IconButton class="material-icons" on:click={(event) => {event.stopPropagation(); dailyOpen=true;}}>
                event_repeat
            </IconButton>
            </span>
            <span>
            <IconButton class="material-icons" on:click={(event) => {event.stopPropagation(); fileInput.click()}}>
                add
            </IconButton>
            </span>
        </span>
    </Item>

    <List class="sub-list">
        {#await promise}
            <Item style="padding-left: {(indent+1)*24}px">
                <CircularProgress style="height: 32px; width: 32px;" indeterminate/>
            </Item>
        {:then entries}
            {#if entries}
                {#each entries as child}
                    {#if child.type === DirEntryType.DIRECTORY && !child.name.match(/^(sd2snes|\..*)$/)}

                        <svelte:self
                                style="padding-left: {(indent+1)*24}px"
                                directory={child}
                                device={device}
                                fileSystemClient={fileSystemClient}
                                indent={indent+1}
                                parent={child.fullpath}
                        />
                    {/if}
                    {#if child.type === DirEntryType.FILE && child.name.match(/^(?!\._).*\.(smc|sfc)$/)}
                        <File name={child.name} indent={indent+1} fileSystemClient={fileSystemClient}
                              device={device} fullpath={child.fullpath}
                              reloadParent={reload}
                        />
                    {/if}
                {/each}
            {/if}
        {/await}
    </List>
</Item>


