<script>
    import Button from '@smui/button';
    import {grpc} from "@improbable-eng/grpc-web";

    // Import code-generated data structures.
    import {
        DeviceControl,
        DeviceControlClient,
        DeviceFilesystemClient,
        Devices,
        DevicesClient
    } from "./sni-client/sni_pb_service";
    import {DevicesRequest, ReadDirectoryRequest, ResetSystemRequest, ResetToMenuRequest} from "./sni-client/sni_pb";
    import Textfield from "@smui/textfield/index";
    import HelperText from "@smui/textfield/helper-text";
    import Select from "@smui/select/index";
    import {Option} from "@smui/select";

    let host = "http://retro-controller.local/sni";
    let devices;
    let device;
    let client;
    let fileSystemClient;

    $: device, loadFiles()
    $: host, loadDevices()

    function loadDevices() {
        client = new DeviceControlClient(host);
        fileSystemClient = new DeviceFilesystemClient(host, {debug: true});
        const req = new DevicesRequest();
        grpc.unary(Devices.ListDevices, {
            request: req,
            host: host,
            onEnd: res => {
                const {status, statusMessage, headers, message, trailers} = res;
                console.log("response", res);
                if (status === grpc.Code.OK && message) {
                    console.log("all ok. got devices: ", message.toObject());
                    devices = message.toObject().devicesList;
                    if (devices[0]) {
                        device = devices[0];
                    } else {
                        device = null;
                    }
                } else {
                    devices = null;
                    device = null;
                }
            }
        });
    }

    function loadFiles() {
        if (!fileSystemClient || !device)
            return;

        const request = new ReadDirectoryRequest()
        request.setUri(device.uri);
        request.setPath("/")
        fileSystemClient.debug = true;
        fileSystemClient.readDirectory(request, {}, (err, res) => {
            console.log("response read", res.getEntriesList());
        });
    }

    function resetMenu() {
        if (!client)
            return;
        let resetRequest = new ResetToMenuRequest()
        resetRequest.setUri(device.uri);
        client.resetToMenu(resetRequest, {}, res => {
            console.log("response", res);
        })
    }

    function resetSystem() {
        if (!client)
            return;
        let resetRequest = new ResetSystemRequest()
        resetRequest.setUri(device.uri);
        client.resetSystem(resetRequest, {}, res => {
            console.log("response", res);
        })
    }

</script>

<div>
    <Textfield
        variant="outlined"
        bind:value={host}
        label="SNI url"
        style="width: 100%;"
        helperLine$style="width: 100%;"
    >
        <HelperText slot="helper">Enter the url of the SNI service</HelperText>
    </Textfield>
</div>

<div>
    <p>
        {JSON.stringify(device)}
    </p>
</div>

{#if devices}
    <div>
        <Select variant="filled" bind:value={device} label="Device" style="width: 100%;">
            {#each devices as d}
                <Option value={d}>{d.kind}@{d.displayname}</Option>
            {/each}
        </Select>
    </div>
    {#if device}
        <div>
            <Button variant="outlined" on:click={resetMenu}>
                Reset Menu
            </Button>
        </div>
        <div>
            <Button variant="outlined" on:click={resetSystem}>
                Reset System
            </Button>
        </div>
    {/if}
{/if}

