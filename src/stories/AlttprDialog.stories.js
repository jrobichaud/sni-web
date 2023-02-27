import AlttprDialog from "../AlttprDialog.svelte";
import { injectAlttprSettings, injectSprites } from "./storeInjection";

injectAlttprSettings();
injectSprites();

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes
export default {
  title: "AlttprDialog",
  component: AlttprDialog,
  argTypes: {},
};

// More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args
const Template = (args) => ({
  Component: AlttprDialog,
  props: args,
  on: {},
});

// More on args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {
  open: true,
};
