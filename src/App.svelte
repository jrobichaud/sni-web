<svelte:head>
    <link rel="stylesheet" href="/smui.css" media="(prefers-color-scheme: light)" />
    <link
            rel="stylesheet"
            href="/smui-dark.css"
            media="screen and (prefers-color-scheme: dark)"
    />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
</svelte:head>

<script>
    import Button, {Label, Icon} from '@smui/button';
    import {grpc} from "@improbable-eng/grpc-web";

    import {
        DeviceControlClient,
        Devices,
    } from "./sni-client/sni_pb_service";
    import {DevicesRequest, ResetSystemRequest, ResetToMenuRequest} from "./sni-client/sni_pb";
    import { onMount } from "svelte";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield/helper-text";
    import Select from "@smui/select";
    import {Option} from "@smui/select";
    import FileBrowser from "./FileBrowser.svelte";
    import CircularProgress from "@smui/circular-progress";
    import IconButton from "@smui/icon-button";
    import {sprites, device} from "./store";

    let url = "/sni";
    let devices;
    let client;

    $: url, loadDevices()

    let promise;

    onMount(()=> {
        fetch("/pyz3r/alttpr/sprites")
            .then(response => response.json())
            .then(data => {
                sprites.set(data);
            }).catch(error => {
            console.log(error);
            return [];
        });
    })

    function loadDevices() {
        client = new DeviceControlClient(url);
        const req = new DevicesRequest();
        promise = new Promise((resolve) => {
            grpc.unary(Devices.ListDevices, {
                request: req,
                host: url,
                onEnd: res => {
                    const {status, statusMessage, headers, message, trailers} = res;
                    if (status === grpc.Code.OK && message) {
                        devices = message.toObject().devicesList;
                        if (devices[0]) {
                            device.set(devices[0]);
                        } else {
                            device.set(null);
                        }
                    } else {
                        devices = null;
                        device.set(null);
                    }

                    resolve(devices)
                }
            });
        })
    }


    function resetMenu() {
        if (!client)
            return;
        let resetRequest = new ResetToMenuRequest()
        resetRequest.setUri($device.uri);
        client.resetToMenu(resetRequest)
    }

    function resetSystem() {
        if (!client)
            return;
        let resetRequest = new ResetSystemRequest()
        resetRequest.setUri($device.uri);
        client.resetSystem(resetRequest)
    }

</script>

<style>
    .container {
        display: flex;
    }
</style>

<div class="container" style="flex-direction: row; justify-content:flex-start">
    <div style="flex-grow: 1">
        <Textfield
                variant="outlined"
                bind:value={url}
                label="SNI url"
                style="width: 100%;"
                helperLine$style="width: 100%;"
        >
            <HelperText slot="helper">Enter the url of the SNI service</HelperText>
        </Textfield>
    </div>
    <div>
        <IconButton class="material-icons" on:click={loadDevices}>
            refresh
        </IconButton>
    </div>
</div>
{#await promise}
    <CircularProgress style="height: 32px; width: 32px;" indeterminate/>
{:then devices}
    <div>
        <Select variant="filled" bind:value={$device} label="Device" style="width: 100%;">
            {#if devices}
                {#each devices as d}
                    <Option value={d}>{d.kind}@{d.displayname}</Option>
                {/each}
            {/if}
        </Select>
    </div>
    {#if $device}
        <div class="container" style="flex-direction: row; justify-content:center">
            <Button variant="outlined" on:click={resetMenu}>
                <Icon class="material-icons">home</Icon>
                <Label>&nbsp;Menu</Label>
            </Button>
            <Button variant="outlined" on:click={resetSystem}>
                <Icon class="material-icons">restart_alt</Icon>
                <Label>&nbsp;Reset Game</Label>
            </Button>
        </div>
        <div class="container" style="flex-direction: row; justify-content:center">
            <Button variant="outlined" href="/zt/" target="_blank">
                <Icon class="material-icons">change_history</Icon>
                <Label>&nbsp;Alttpr</Label>
            </Button>
        </div>
        <div>
            <FileBrowser url={url}></FileBrowser>
        </div>
    {/if}
{/await}

