// src/nodes/MLXPluginNode.ts
function mlxPluginNode(rivet) {
  const MLXPluginNodeImpl = {
    // This should create a new instance of your node type from scratch.
    create() {
      const node = {
        // Use rivet.newId to generate new IDs for your nodes.
        id: rivet.newId(),
        // This is the default data that your node will store
        data: {
          someData: "Hello World"
        },
        // This is the default title of your node.
        title: "MLX Plugin Node",
        // This must match the type of your node.
        type: "mlxPlugin",
        // X and Y should be set to 0. Width should be set to a reasonable number so there is no overflow.
        visualData: {
          x: 0,
          y: 0,
          width: 200
        }
      };
      return node;
    },
    // This function should return all input ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getInputDefinitions(data, _connections, _nodes, _project) {
      const inputs = [];
      if (data.useSomeDataInput) {
        inputs.push({
          id: "someData",
          dataType: "string",
          title: "Some Data"
        });
      }
      return inputs;
    },
    // This function should return all output ports for your node, given its data, connections, all other nodes, and the project. The
    // connection, nodes, and project are for advanced use-cases and can usually be ignored.
    getOutputDefinitions(_data, _connections, _nodes, _project) {
      return [
        {
          id: "someData",
          dataType: "string",
          title: "Some Data"
        }
      ];
    },
    // This returns UI information for your node, such as how it appears in the context menu.
    getUIData() {
      return {
        contextMenuTitle: "MLX Plugin",
        group: "MLX",
        infoBoxBody: "This is an mlx plugin node.",
        infoBoxTitle: "MLX Plugin Node"
      };
    },
    // This function defines all editors that appear when you edit your node.
    getEditors(_data) {
      return [
        {
          type: "string",
          dataKey: "someData",
          useInputToggleDataKey: "useSomeDataInput",
          label: "Some Data"
        }
      ];
    },
    // This function returns the body of the node when it is rendered on the graph. You should show
    // what the current data of the node is in some way that is useful at a glance.
    getBody(data) {
      return rivet.dedent`
        MLX Plugin Node
        Data: ${data.useSomeDataInput ? "(Using Input)" : data.someData}
      `;
    },
    // This is the main processing function for your node. It can do whatever you like, but it must return
    // a valid Outputs object, which is a map of port IDs to DataValue objects. The return value of this function
    // must also correspond to the output definitions you defined in the getOutputDefinitions function.
    async process(data, inputData, _context) {
      const someData = rivet.getInputOrData(
        data,
        inputData,
        "someData",
        "string"
      );
      return {
        ["someData"]: {
          type: "string",
          value: someData
        }
      };
    }
  };
  const mlxPluginNode2 = rivet.pluginNodeDefinition(
    MLXPluginNodeImpl,
    "MLX Plugin Node"
  );
  return mlxPluginNode2;
}

// src/index.ts
var plugin = (rivet) => {
  const mlxNode = mlxPluginNode(rivet);
  const mlxPlugin = {
    // The ID of your plugin should be unique across all plugins.
    id: "mlx-plugin",
    // The name of the plugin is what is displayed in the Rivet UI.
    name: "MLX Plugin",
    // Define all configuration settings in the configSpec object.
    configSpec: {
      mlxSetting: {
        type: "string",
        label: "MLX Setting",
        description: "This is an mlx setting for the mlx plugin.",
        helperText: "This is an mlx setting for the mlx plugin."
      }
    },
    // Define any additional context menu groups your plugin adds here.
    contextMenuGroups: [
      {
        id: "mlx",
        label: "MLX"
      }
    ],
    // Register any additional nodes your plugin adds here. This is passed a `register`
    // function, which you can use to register your nodes.
    register: (register) => {
      register(mlxNode);
    }
  };
  return mlxPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
