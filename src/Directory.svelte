<script>
    import List, {Item, Text} from "@smui/list";
    import {DirEntryType, ReadDirectoryRequest} from "./sni-client/sni_pb";
    import File from "./File.svelte";

    export let directory;
    export let fileSystemClient;
    export let device;
    export let indent;
    let counter = 1;
    export let expanded = false;
    //let entries;
    export let parent;

    let promise;
    $: expanded, expanded ? loadFiles() : promise = null;

    function loadFiles() {
        if (!fileSystemClient || !device)
            return;

        const request = new ReadDirectoryRequest()
        request.setUri(device.uri);
        request.setPath(directory.fullpath)
        promise = new Promise(resolve => {
            fileSystemClient.readDirectory(request, {}, (err, res) => {
                console.log("response read", res.getEntriesList());
                let entries = res.getEntriesList().map((e) => ({
                    type: e.getType(),
                    name: e.getName(),
                    fullpath: directory.fullpath + (directory.fullpath!=="/"?"/":"") + e.getName(),
                })).sort(function(a, b){
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                });
                console.log("directory", directory);
                counter++;
                resolve(entries);
            });
        })
    }
</script>

<Item wrapper>
    <Item style="padding-left: {indent*24}px" on:SMUI:action={()=>expanded = !expanded}>
        <Text>{directory.name}</Text>
    </Item>

    <List class="sub-list">
        {#await promise}
        {:then entries}
            {#if entries}
                {#each entries as child}
                    {#if !child.name.match(/^\..*/) && child.name !== "sd2snes"}
                        {#if child.type === DirEntryType.DIRECTORY}
                            <svelte:self
                                    style="padding-left: {(indent+1)*24}px"
                                    directory={child}
                                    device={device}
                                    fileSystemClient={fileSystemClient}
                                    indent={indent+1}
                                    parent={child.fullpath}
                            />
                        {/if}
                        {#if child.type === DirEntryType.FILE}
                            <File name={child.name} indent={indent+1} fileSystemClient={fileSystemClient} device={device} fullpath={child.fullpath}/>
                        {/if}
                    {/if}
                {/each}
            {/if}
        {/await}
    </List>
</Item>


