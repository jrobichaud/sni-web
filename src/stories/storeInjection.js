import { rawAlttprSettings, sprites } from "../store";

export function injectAlttprSettings() {
  rawAlttprSettings.set({
    accessibility: {
      items: "100% Inventory",
      locations: "100% Locations",
      none: "Not Guaranteed",
    },
    boss_shuffle: {
      full: "Full",
      none: "None",
      random: "Random",
      simple: "Simple",
    },
    dungeon_items: {
      full: "Full Shuffle",
      mc: "MC Shuffle",
      mcs: "MCS Shuffle",
      standard: "Standard",
    },
    enemy_damage: {
      default: "Default",
      random: "Random",
      shuffled: "Shuffled",
    },
    enemy_health: {
      default: "Default",
      easy: "Easy",
      expert: "Expert",
      hard: "Hard",
    },
    enemy_shuffle: { none: "None", random: "Random", shuffled: "Shuffled" },
    entrance_shuffle: {
      crossed: "Crossed",
      full: "Full",
      insanity: "Insanity",
      none: "None",
      restricted: "Restricted",
      simple: "Simple",
    },
    ganon_open: {
      0: "none",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      random: "random",
    },
    glitches_required: {
      major_glitches: "Major Glitches",
      no_logic: "No Logic",
      none: "None",
      overworld_glitches: "Overworld Glitches",
    },
    goals: {
      dungeons: "All Dungeons",
      fast_ganon: "Fast Ganon",
      ganon: "Defeat Ganon",
      pedestal: "Master Sword Pedestal",
      "triforce-hunt": "Triforce Pieces",
    },
    hints: { off: "Off", on: "On" },
    item_functionality: { expert: "Expert", hard: "Hard", normal: "Normal" },
    item_placement: { advanced: "Advanced", basic: "Basic" },
    item_pool: {
      crowd_control: "Crowd Control",
      expert: "Expert",
      hard: "Hard",
      normal: "Normal",
    },
    pot_shuffle: { off: "Off", on: "On" },
    presets: {
      beginner: {
        accessibility: "locations",
        boss_shuffle: "none",
        dungeon_items: "standard",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "none",
        ganon_open: "7",
        glitches_required: "none",
        goal: "ganon",
        hints: "off",
        item_functionality: "normal",
        item_placement: "basic",
        item_pool: "normal",
        tower_open: "7",
        weapons: "assured",
        world_state: "standard",
      },
      crosskeys: {
        accessibility: "items",
        boss_shuffle: "none",
        dungeon_items: "full",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "crossed",
        ganon_open: "7",
        glitches_required: "none",
        goal: "fast_ganon",
        hints: "on",
        item_functionality: "normal",
        item_placement: "advanced",
        item_pool: "normal",
        tower_open: "7",
        weapons: "randomized",
        world_state: "open",
      },
      custom: [],
      default: {
        accessibility: "items",
        boss_shuffle: "none",
        dungeon_items: "standard",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "none",
        ganon_open: "7",
        glitches_required: "none",
        goal: "ganon",
        hints: "on",
        item_functionality: "normal",
        item_placement: "advanced",
        item_pool: "normal",
        tower_open: "7",
        weapons: "randomized",
        world_state: "open",
      },
      nightmare: {
        accessibility: "none",
        boss_shuffle: "random",
        dungeon_items: "full",
        enemy_damage: "random",
        enemy_health: "expert",
        enemy_shuffle: "random",
        entrance_shuffle: "insanity",
        ganon_open: "7",
        glitches_required: "none",
        goal: "ganon",
        hints: "off",
        item_functionality: "expert",
        item_placement: "advanced",
        item_pool: "expert",
        tower_open: "7",
        weapons: "swordless",
        world_state: "inverted",
      },
      quick: {
        accessibility: "none",
        boss_shuffle: "none",
        dungeon_items: "standard",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "none",
        ganon_open: "0",
        glitches_required: "none",
        goal: "fast_ganon",
        hints: "off",
        item_functionality: "normal",
        item_placement: "basic",
        item_pool: "normal",
        tower_open: "0",
        weapons: "assured",
        world_state: "open",
      },
      tournament: {
        accessibility: "items",
        boss_shuffle: "none",
        dungeon_items: "standard",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "none",
        ganon_open: "7",
        glitches_required: "none",
        goal: "ganon",
        hints: "off",
        item_functionality: "normal",
        item_placement: "advanced",
        item_pool: "hard",
        tower_open: "7",
        weapons: "randomized",
        world_state: "standard",
      },
      veetorp: {
        accessibility: "locations",
        boss_shuffle: "none",
        dungeon_items: "standard",
        enemy_damage: "default",
        enemy_health: "default",
        enemy_shuffle: "none",
        entrance_shuffle: "none",
        ganon_open: "7",
        glitches_required: "overworld_glitches",
        goal: "fast_ganon",
        hints: "on",
        item_functionality: "normal",
        item_placement: "basic",
        item_pool: "normal",
        tower_open: "7",
        weapons: "randomized",
        world_state: "open",
      },
    },
    spoilers: {
      generate: "Generate",
      mystery: "Mystery",
      off: "Off",
      on: "On",
    },
    tower_open: {
      0: "none",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      random: "random",
    },
    weapons: {
      assured: "Assured",
      randomized: "Randomized",
      swordless: "Swordless",
      vanilla: "Vanilla",
    },
    world_state: {
      inverted: "Inverted",
      open: "Open",
      retro: "Retro",
      standard: "Standard",
    },
  });
}

export function injectSprites() {
  sprites.set([
    {
      author: "Nintendo",
      file: "https://alttpr-assets.s3.us-east-2.amazonaws.com/001.link.1.zspr",
      name: "Link",
      preview:
        "https://alttpr-assets.s3.us-east-2.amazonaws.com/001.link.1.zspr.png",
      tags: ["Link", "Male", "Legend of Zelda"],
      usage: ["commercial", "smz3"],
      version: 1,
    },
    {
      author: "RoPan",
      file: "https://alttpr-assets.s3.us-east-2.amazonaws.com/peach.1.zspr",
      name: "Princess Peach",
      preview:
        "https://alttpr-assets.s3.us-east-2.amazonaws.com/peach.1.zspr.png",
      tags: ["Mario", "Princess", "Female"],
      usage: ["smz3"],
      version: 1,
    },
  ]);
}
