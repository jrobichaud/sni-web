<script>
    import {DeviceFilesystemClient} from "./sni-client/sni_pb_service";
    import {DirEntryType} from "./sni-client/sni_pb";
    import List from '@smui/list';
    import Directory from "./Directory.svelte";

    import {fileSystemClient, device} from './store';
    import {onMount} from "svelte";

    export let url;
    let root;
    $: $device, root = {name: "/", type: DirEntryType.DIRECTORY, fullpath: "/"}

    onMount(()=>{
        fileSystemClient.set(new DeviceFilesystemClient(url));
    })

</script>

<List>
    {#if $device && $fileSystemClient && root}
        <Directory directory={root} indent={0} expanded/>
    {/if}
</List>
