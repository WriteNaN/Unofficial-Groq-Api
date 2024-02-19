import Chat, { generateTextCompletion } from "./client";
import getGuestToken from "./client/getToken";
import EventEmitter from "events";

import type {
  ChatOptions,
  CompletionOptions,
  SendOptions,
} from "./types/client";

export default class UnofficialGroqApi extends EventEmitter {
  private auth!: string;

  constructor() {
    super();
    this._init();
  }

  private async _init() {
    const gT = await getGuestToken();
    this.auth = gT.auth;
    this.emit("ready");
    console.log(gT.expiry);
    const expiryDate = new Date(gT.expiry);
    const timeUntilExpiry = expiryDate.getTime() - Date.now();
    console.log(timeUntilExpiry);
    await new Promise((resolve) => setTimeout(resolve, timeUntilExpiry));
    await this.resetAuth();
  }

  public generateTextCompletion(options: CompletionOptions) {
    if (!this.auth) {
      throw new Error("No authentication token found");
    }
    return generateTextCompletion(options, this.auth);
  }

  public Chat(options: ChatOptions) {
    const { send } = new Chat(options, this.auth);
    const message = async (message: string, optional?: SendOptions) => {
      console.log(this.auth);
      return await send(message, { optional, auth: this.auth });
    };
    return {
      send: message,
    };
  }

  private async resetAuth() {
    const newGuestToken = await getGuestToken();
    this.auth = newGuestToken.auth;
    console.log("Authentication reset:", this.auth);
  }
}

export { Chat, generateTextCompletion, getGuestToken };
