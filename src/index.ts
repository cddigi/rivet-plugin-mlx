// usage: server.py [-h] --model MODEL [--adapter-file ADAPTER_FILE] [--host HOST] [--port PORT]
//
// MLX Http Server.
//
// options:
//   -h, --help            show this help message and exit
//   --model MODEL         The path to the MLX model weights, tokenizer, and config
//   --adapter-file ADAPTER_FILE
//                         Optional path for the trained adapter weights.
//   --host HOST           Host for the HTTP server (default: 127.0.0.1)
//   --port PORT           Port for the HTTP server (default: 8080)

import type { RivetPlugin, RivetPluginInitializer } from "@ironclad/rivet-core";

import { mlxPluginNode } from "./nodes/MLXPluginNode";
import { mlxGenerate } from "./nodes/MLXGenerateNode";

const plugin: RivetPluginInitializer = (rivet) => {
  const mlxPlugin: RivetPlugin = {
    id: "mlx-plugin",
    name: "MLX Plugin",
    configSpec: {
      host: {
        type: "string",
        label: "HOST",
        default: "127.0.0.1",
        description: "Host for the HTTP server (default: 127.0.0.1)",
        helperText: "Host for the HTTP server (default: 127.0.0.1)",
      },
      port: {
        type: "string",
        label: "PORT",
        default: "8080",
        description: "Port for the HTTP server (default: 8080)",
        helperText: "Port for the HTTP server (default: 8080)",
      },
    },

    contextMenuGroups: [
      {
        id: "mlx",
        label: "MLX",
      },
    ],

    register: (register) => {
      register(mlxPluginNode(rivet));
      register(mlxGenerate(rivet));
    },
  };

  return mlxPlugin;
};

export default plugin;
