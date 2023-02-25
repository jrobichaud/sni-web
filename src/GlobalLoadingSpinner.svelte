<script>
    import Dialog, {Content} from "@smui/dialog";
    import CircularProgress from "@smui/circular-progress";
    export let isLoading;
</script>

<style lang="scss">
    :global(.loading > .mdc-dialog__container > .mdc-dialog__surface) {
        min-width: 0;
    }

    :global(.loading > .mdc-dialog__container > .mdc-dialog__surface::-webkit-scrollbar) {
        display: none;
    }

    :global(.loading > .mdc-dialog__container > .mdc-dialog__surface > .mdc-dialog__content) {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
</style>

<Dialog
        bind:open={isLoading}
        aria-labelledby="loading-title"
        aria-describedby="loading-content"
        noContentPadding
        class="loading"
        scrimClickAction=""
        escapeKeyAction=""
>
    <Content id="loading-content">
        <CircularProgress style="height: 32px; width: 32px;" indeterminate/>
    </Content>
</Dialog>
