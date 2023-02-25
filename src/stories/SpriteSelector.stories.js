
import SpriteSelector from '../SpriteSelector.svelte';

import {sprites} from "../store";

sprites.set(
    [
        {
            "author": "Nintendo",
            "file": "https://alttpr-assets.s3.us-east-2.amazonaws.com/001.link.1.zspr",
            "name": "Link",
            "preview": "https://alttpr-assets.s3.us-east-2.amazonaws.com/001.link.1.zspr.png",
            "tags": [
                "Link",
                "Male",
                "Legend of Zelda"
            ],
            "usage": [
                "commercial",
                "smz3"
            ],
            "version": 1
        },
        {
            "author": "RoPan",
            "file": "https://alttpr-assets.s3.us-east-2.amazonaws.com/peach.1.zspr",
            "name": "Princess Peach",
            "preview": "https://alttpr-assets.s3.us-east-2.amazonaws.com/peach.1.zspr.png",
            "tags": [
                "Mario",
                "Princess",
                "Female"
            ],
            "usage": [
                "smz3"
            ],
            "version": 1
        }
    ]
)

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
// More on argTypes: https://storybook.js.org/docs/svelte/api/argtypes
export default {
    title: 'SpriteSelector',
    component: SpriteSelector,
    argTypes: {},
};

// More on component templates: https://storybook.js.org/docs/svelte/writing-stories/introduction#using-args
const Template = (args) => ({
    Component: SpriteSelector,
    props: args,
    on: {},
});

// More on args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary = Template.bind({});
Primary.args = {};
