<script>
    import {Item, Text} from "@smui/list";
    import {BootFileRequest} from "./sni-client/sni_pb";

    export let name;
    export let indent;
    export let fileSystemClient;
    export let device;
    export let fullpath;
    function onClick() {
        let request = new BootFileRequest();
        request.setUri(device.uri);
        request.setPath(fullpath);
        fileSystemClient.bootFile(request)
    }
</script>



<Item style="padding-left: {(indent+1)*24}px" on:SMUI:action={onClick}>
    <Text>{name} ({fullpath})</Text>
</Item>
