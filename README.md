## Unofficial Groq Wrapper Api

They added authentication and an official api so from now you can use it! :D
~~**NOTE: THIS REPOSITORY IS CURRENTLY TAKEN DOWN UPON GROQ TEAM'S REQUEST, AND WAITING TO ADD LIMITS ON THE GUEST TOKEN. I will make it public again after they fix it.**~~

### Important Things To Note

1) This repository was made solely for educational purposes through their guest api reverse engineered. It's just a matter of time this might get patched in, through cloudflare proxying, ratelimiting, more complicated authentication system etc. I take NO RESPONSIBILITY of what you do with it.

2) If you were to continue working on this, I would suggest using additional proxies. Currently only the useragent is randomized.

## Getting Started

install [bun](https://bun.sh/) & clone this repo. and do bun run . / file. feel free to contact me for anything!

#### Importing The Lib
```ts
import UnofficialGroqApi, { Chat, generateTextCompletion, getGuestToken } from "./src/index";
```

#### Example Usage
```ts
const groqApi = new UnofficialGroqApi();

groqApi.on("ready", async () => {
  const completionOptions = {
    model: "mixtral-8x7b-32768",
    prompt: "Hello, ",
  };
  const completionResult = await groqApi.generateTextCompletion(completionOptions);
  console.log("Text Completion Result:", await completionResult.getFullText());
  // supports streaming as well! - completionResult.stream
  const chatOptions = {
    model: "mixtral-8x7b-32768",
    systemPrompt: "Please provide useful and actionable answers.",
  };
  const chat = groqApi.Chat(chatOptions);
  const response = await chat.send("Hey there!");
  console.log("Chat Response:", await response.getFullText());
});
```

#### API Methods
`generateTextCompletion(options: CompletionOptions): Promise<{ stream: any; getFullText: () => Promise<string> }>`
Generates text completion based on the provided options.

`Chat(options: ChatOptions): { send: (message: string, optional?: SendOptions) => Promise<{ stream: any; getFullText: () => Promise<string> }> }`
Starts a chat session with the specified options. Returns an object with a send method for sending messages during the chat session.

`getGuestToken(): Promise<{ auth: string; expiry: string }>`
Obtains a guest token for authentication.

### LICENSE

This project is licensed under the MIT License - see the LICENSE file for details.

Thanks to [Groq](https://groq.com/)! ^_~
