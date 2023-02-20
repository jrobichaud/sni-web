<script>
    import {DeviceFilesystemClient} from "./sni-client/sni_pb_service";
    import {DirEntryType} from "./sni-client/sni_pb";
    import List from '@smui/list';
    import Directory from "./Directory.svelte";

    export let url;
    export let device;
    let fileSystemClient;
    let root;
    $: device, root = {name: "/", type: DirEntryType.DIRECTORY, fullpath: "/"}

    fileSystemClient = new DeviceFilesystemClient(url);

</script>

<List>
    {#if device && root}
        <Directory directory={root} fileSystemClient={fileSystemClient} device={device} indent={0} expanded/>
    {/if}
</List>
