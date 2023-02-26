import AlttprRandomizer from '../AlttprRandomizer.svelte';
import {injectAlttprSettings} from "./storeInjection";

injectAlttprSettings()

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes
export default {
    title: 'AlttprRandomizer',
    component: AlttprRandomizer,
    argTypes: {},
};

// More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args
const Template = (args) => ({
    Component: AlttprRandomizer,
    props: args,
    on: {},
});

// More on args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {};
