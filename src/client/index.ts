import { POST } from "./axios";

import type {
  ChatOptions,
  CompletionOptions,
  History,
  SendOptions,
} from "../types/client";

export async function generateTextCompletion(
  {
    model,
    prompt,
    seed,
    maxTokens,
    temperature,
    topK,
    topP,
    maxInputTokens,
    history,
    systemPrompt,
  }: CompletionOptions,
  Authorization: string
): Promise<{ stream: any; getFullText: () => Promise<string> }> {
  const payload = getFormattedPayload({
    model,
    prompt,
    seed,
    maxTokens,
    temperature,
    topK,
    topP,
    maxInputTokens,
    history,
    systemPrompt,
  });
  const response = await POST(payload, Authorization);
  let fullResponseTextified = "";
  const onData = (chunk: any) => {
    try {
      const jsonChunk = JSON.parse(chunk.toString());

      if (jsonChunk.result && jsonChunk.result.content) {
        fullResponseTextified += jsonChunk.result.content;
      }
    } catch {}
  };

  let streamEnded = false;

  const onEnd = () => {
    streamEnded = true;
    response.data.off("data", onData);
  };

  response.data.on("data", onData);
  response.data.on("end", onEnd);
  return {
    stream: response.data,
    getFullText: async () => {
      return new Promise<string>((resolve) => {
        if (streamEnded) resolve(fullResponseTextified);
        response.data.on("end", () => {
          resolve(fullResponseTextified);
        });
      });
    },
  };
}

function getFormattedPayload({
  model,
  prompt,
  seed,
  maxTokens,
  temperature,
  topK,
  topP,
  maxInputTokens,
  history,
  systemPrompt,
}: CompletionOptions): Record<string, any> {
  /** perhaps default could be way higher for smaller models (mixtral) */
  return {
    model_id: model,
    system_prompt:
      systemPrompt ||
      "Please try to provide useful, helpful and actionable answers.",
    user_prompt: prompt,
    history: history || [],
    seed: seed || 10,
    max_tokens: maxTokens || 4096,
    top_p: topP || 0.8,
    top_k: topK || 40,
    temperature: temperature || 0.2,
    max_input_tokens: maxInputTokens || 2730,
  };
}

export default class Chat {
  public history: History[];
  private model: "mixtral-8x7b-32768" | "llama2-70b-4096";
  private systemPrompt: string;
  private auth: string;

  constructor(options: ChatOptions, auth: string) {
    this.history = [];
    this.model = options.model;
    this.auth = auth;
    this.systemPrompt =
      options.systemPrompt ||
      "Please try to provide useful, helpful and actionable answers.";
    this.send = this.send.bind(this);
  }
  public async send(
    message: string,
    { optional, auth }: { optional?: SendOptions; auth?: string }
  ): Promise<{ stream: any; getFullText: () => Promise<string> }> {
    if (auth && auth.startsWith("Bearer")) {
      this.auth = auth;
    }
    const payload = {
      model: this.model,
      prompt: message,
      systemPrompt: this.systemPrompt,
      history: this.history,
      temperature: optional?.temperature,
      seed: optional?.seed,
      maxTokens: optional?.maxTokens,
      topK: optional?.topK,
      topP: optional?.topP,
      maxInputTokens: optional?.maxInputTokens,
    };
    const { getFullText, stream } = await generateTextCompletion(
      payload,
      this.auth
    );
    this.history.push({
      user_prompt: message,
      assistant_response: await getFullText(),
    });
    return { getFullText, stream };
  }
}

/** 
generateTextCompletion(
  {
    model: "llama2-70b-4096",
    systemPrompt:
      "Please try to provide useful, helpful and actionable answers.",
    prompt: "what are pokemons?",
  },
  "Bearer "
).then(async (response) => {
  response.stream.on("data", (chunk: any) => {});

  response.stream.on("end", async () => {
    console.log("Stream ended");
    console.log(await response.getFullText());
  });
});
*/
