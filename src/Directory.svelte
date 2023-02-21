<script>
    import List, {Item, Text} from "@smui/list";
    import IconButton from '@smui/icon-button';
    import {DirEntryType, PutFileRequest, ReadDirectoryRequest} from "./sni-client/sni_pb";
    import File from "./File.svelte";
    import CircularProgress from '@smui/circular-progress';

    export let directory;
    export let fileSystemClient;
    export let device;
    export let indent;
    export let expanded = false;
    let fileInput;
    let files;

    let promise;
    $: expanded, expanded ? loadFiles() : promise = null;

    function uploadFiles() {
        const file = files[0];
        if (!file) {
            return;
        }
        let request = new PutFileRequest();
        request.setUri(device.uri)
        request.setPath(directory.fullpath + "/" + file.name);
        const fileReader = new FileReader()
        fileReader.onload = function(e){
            request.setData(new Uint8Array(e.target.result) )
            fileSystemClient.putFile(request, (err, res) => {
                loadFiles();
                files = null;
            })
        };
        fileReader.onerror = function () {
            files = null;
        }
        fileReader.readAsArrayBuffer(file);
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
</script>

<style>
    .hidden {
        display: none;
    }

    .add {
        position: absolute;
        right: 0;
    }
</style>


<input class="hidden" id="file-to-upload" type="file" accept=".smc,.sfc" bind:files bind:this={fileInput}
       on:change={uploadFiles}/>
<Item wrapper>
    <Item style="padding-left: {indent*24}px" on:SMUI:action={()=>expanded = !expanded}>
        <Text>{directory.name}</Text>
        <span class="add">
            <IconButton class="material-icons" on:click={(event) => {event.stopPropagation(); fileInput.click()}}>
                add
            </IconButton>
        </span>
    </Item>

    <List class="sub-list">
        {#await promise}
            <Item style="padding-left: {(indent+1)*24}px">
                <CircularProgress style="height: 32px; width: 32px;" indeterminate />
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


