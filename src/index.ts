// It is important that you only import types from @ironclad/rivet-core, and not
// any of the actual Rivet code. Rivet is passed into the initializer function as
// a parameter, and you can use it to access any Rivet functionality you need.
import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import { mlxPluginNode } from "./nodes/MLXPluginNode.js";

// A Rivet plugin must default export a plugin initializer function. This takes in the Rivet library as its
// only parameter. This function must return a valid RivetPlugin object.
const plugin: RivetPluginInitializer = (rivet) => {
  // Initialize any nodes in here in the same way, by passing them the Rivet library.
  const mlxNode = mlxPluginNode(rivet);

  // The plugin object is the definition for your plugin.
  const mlxPlugin: RivetPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "mlx-plugin",

    // The name of the plugin is what is displayed in the Rivet UI.
    name: "Example Plugin",

    // Define all configuration settings in the configSpec object.
    configSpec: {
      mlxSetting: {
        type: "string",
        label: "Example Setting",
        description: "This is an mlx setting for the mlx plugin.",
        helperText: "This is an mlx setting for the mlx plugin.",
      },
    },

    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "mlx",
        label: "Example",
      },
    ],

    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(mlxNode);
    },
  };

  // Make sure to return your plugin definition.
  return mlxPlugin;
};

// Make sure to default export your plugin.
export default plugin;
