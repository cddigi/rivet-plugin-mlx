// usage: generate.py [-h] [--model MODEL] [--trust-remote-code] [--eos-token EOS_TOKEN] [--prompt PROMPT]
//                    [--max-tokens MAX_TOKENS] [--temp TEMP] [--seed SEED] [--ignore-chat-template] [--colorize]
//
// LLM inference script
//
// options:
//   -h, --help            show this help message and exit
//   --model MODEL         The path to the local model directory or Hugging Face repo.
//   --trust-remote-code   Enable trusting remote code for tokenizer
//   --eos-token EOS_TOKEN
//                         End of sequence token for tokenizer
//   --prompt PROMPT       Message to be processed by the model
//   --max-tokens MAX_TOKENS, -m MAX_TOKENS
//                         Maximum number of tokens to generate
//   --temp TEMP           Sampling temperature
//   --seed SEED           PRNG seed
//   --ignore-chat-template
//                         Use the raw prompt without the tokenizer's chat template.
//   --colorize            Colorize output based on T[0] probability

import type {
  ChartNode,
  ChatMessage,
  ChatMessageMessagePart,
  EditorDefinition,
  NodeId,
  NodeInputDefinition,
  NodeOutputDefinition,
  NodeUIData,
  Outputs,
  PluginNodeImpl,
  PortId,
  Rivet,
} from "@ironclad/rivet-core";

export type MLXGenerateNodeData = {
  model: string;
  useModelInput?: boolean;

  eosToken?: string;
  useEosToken?: boolean;

  maxTokens?: number;
  useMaxTokens?: boolean;

  temp?: number;
  useTemp?: boolean;

  seed?: number;
  useSeed?: boolean;

  ignoreChatTemplate?: boolean;
  useIgnoreChatTemplate?: boolean;

  colorize?: boolean;
  useColorize?: boolean;
};

export type MLXGenerateNode = ChartNode<"mlxGenerate", MLXGenerateNodeData>;

export const mlxGenerate = (rivet: typeof Rivet) => {
  const impl: PluginNodeImpl<MLXGenerateNode> = {
    create(): MLXGenerateNode {
      const node: MLXGenerateNode = {
        id: rivet.newId<NodeId>(),
        data: {
          model: "",
          useModelInput: false,
          maxTokens: 1024,
        },
        title: "MLX Generate",
        type: "mlxGenerate",
        visualData: {
          x: 0,
          y: 0,
          width: 250,
        },
      };
      return node;
    },

    getInputDefinitions(data): NodeInputDefinition[] {
      const inputs: NodeInputDefinition[] = [];

      if (data.useModelInput) {
        inputs.push({
          id: "model" as PortId,
          dataType: "string",
          title: "Model",
        });
      }

      return inputs;
    },

    getOutputDefinitions(data): NodeOutputDefinition[] {
      let outputs: NodeOutputDefinition[] = [
        {
          id: "output" as PortId,
          dataType: "string",
          title: "Output",
          description: "The output from MLX.",
        },
        {
          id: "prompt" as PortId,
          dataType: "string",
          title: "Prompt",
          description:
            "The full prompt, with formattting, that was sent to MLX.",
        },
        {
          id: "messages-sent" as PortId,
          dataType: "chat-message[]",
          title: "Messages Sent",
          description: "The messages sent to MLX, including the system prompt.",
        },
        {
          id: "all-messages" as PortId,
          dataType: "chat-message[]",
          title: "All Messages",
          description: "All messages, including the reply from MLX.",
        },
      ];

      return outputs;
    },

    getEditors(): EditorDefinition<MLXGenerateNode>[] {
      return [
        {
          type: "string",
          dataKey: "model",
          label: "Model",
          useInputToggleDataKey: "useModelInput",
          helperMessage: "The LLM model to use in MLX.",
        },
      ];
    },

    getBody(data) {
      return rivet.dedent`
        Model: ${data.useModelInput ? "(From Input)" : data.model || "Unset!"}
      `;
    },

    getUIData(): NodeUIData {
      return {
        contextMenuTitle: "MLX Generate",
        group: "MLX",
        infoBoxBody: "This is an MLX Generate node using /v1/chat/completions.",
        infoBoxTitle: "MLX Generate Node",
      };
    },

    async process(data, inputData, context): Promise<Outputs> {
      let outputs: Outputs = {};
      const host = context.getPluginConfig("host") || "http://127.0.0.1";
      if (!host.trim()) {
        throw new Error("No host set!");
      }

      const port = context.getPluginConfig("port") || "8080";
      if (!port.trim()) {
        throw new Error("No port set!");
      }

      const model = rivet.getInputOrData(data, inputData, "model");
      if (!model.trim()) {
        throw new Error("No model set!");
      }

      return outputs;
    },
  };

  return rivet.pluginNodeDefinition(impl, "MLX Generate");
};
