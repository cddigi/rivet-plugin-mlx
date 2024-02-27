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

// src/nodes/MLXGenerateNode.ts
var mlxGenerate = (rivet) => {
  const impl = {
    create() {
      const node = {
        id: rivet.newId(),
        data: {
          model: "",
          useModelInput: false
        },
        title: "MLX Generate",
        type: "mlxGenerate",
        visualData: {
          x: 0,
          y: 0,
          width: 250
        }
      };
      return node;
    },
    getInputDefinitions(data) {
      const inputs = [];
      if (data.useModelInput) {
        inputs.push({
          id: "model",
          dataType: "string",
          title: "Model"
        });
      }
      return inputs;
    },
    getOutputDefinitions(data) {
      let outputs = [
        {
          id: "output",
          dataType: "string",
          title: "Output",
          description: "The output from MLX."
        },
        {
          id: "prompt",
          dataType: "string",
          title: "Prompt",
          description: "The full prompt, with formattting, that was sent to MLX."
        },
        {
          id: "messages-sent",
          dataType: "chat-message[]",
          title: "Messages Sent",
          description: "The messages sent to MLX, including the system prompt."
        },
        {
          id: "all-messages",
          dataType: "chat-message[]",
          title: "All Messages",
          description: "All messages, including the reply from MLX."
        }
      ];
      return outputs;
    },
    getEditors() {
      return [
        {
          type: "string",
          dataKey: "model",
          label: "Model",
          useInputToggleDataKey: "useModelInput",
          helperMessage: "The LLM model to use in MLX."
        }
      ];
    },
    getBody(data) {
      return rivet.dedent`
        Model: ${data.useModelInput ? "(From Input)" : data.model || "Unset!"}
      `;
    },
    getUIData() {
      return {
        contextMenuTitle: "MLX Generate",
        group: "MLX",
        infoBoxBody: "This is an MLX Generate node using /v1/chat/completions.",
        infoBoxTitle: "MLX Generate Node"
      };
    },
    async process(data, inputData, context) {
      let outputs = {};
      return outputs;
    }
  };
  return rivet.pluginNodeDefinition(impl, "MLX Generate");
};

// src/index.ts
var plugin = (rivet) => {
  const mlxPlugin = {
    id: "mlx-plugin",
    name: "MLX Plugin",
    configSpec: {
      host: {
        type: "string",
        label: "HOST",
        default: "127.0.0.1",
        description: "Host for the HTTP server (default: 127.0.0.1)",
        helperText: "Host for the HTTP server (default: 127.0.0.1)"
      },
      port: {
        type: "string",
        label: "PORT",
        default: "8080",
        description: "Port for the HTTP server (default: 8080)",
        helperText: "Port for the HTTP server (default: 8080)"
      },
      adapter_file: {
        type: "string",
        label: "ADAPTER_FILE",
        description: "Optional path for the trained adapter weights.",
        helperText: "Optional path for the trained adapter weights."
      },
      model: {
        type: "string",
        label: "MODEL",
        description: "The path to the MLX model weights, tokenizer, and config",
        helperText: "The path to the MLX model weights, tokenizer, and config"
      }
    },
    contextMenuGroups: [
      {
        id: "mlx",
        label: "MLX"
      }
    ],
    register: (register) => {
      register(mlxPluginNode(rivet));
      register(mlxGenerate(rivet));
    }
  };
  return mlxPlugin;
};
var src_default = plugin;
export {
  src_default as default
};
