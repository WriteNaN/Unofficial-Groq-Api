export interface History {
    user_prompt: string;
    assistant_response: string;
}

export interface SendOptions {
    temperature: number;
    seed: number;
    maxInputTokens: number;
    maxTokens: number;
    topK: number;
    topP: number;
}

export interface ChatOptions {
    model: 'mixtral-8x7b-32768' | 'llama2-70b-4096';
    systemPrompt?: string;
}

export interface CompletionOptions {
    model: 'mixtral-8x7b-32768' | 'llama2-70b-4096';
    prompt: string;
    seed?: number;
    maxTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
    maxInputTokens?: number;
    history?: History[];
    systemPrompt?: string;
}