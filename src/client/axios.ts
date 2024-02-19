import axios from "axios";
import { getRandom } from "random-useragent";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

export async function POST(
  payload: Record<string, any>,
  Authorization: string,
): Promise<AxiosResponse<any, any>> {
  const PostAxios: AxiosRequestConfig = {
    method: "POST",
    url: "https://api.groq.com/v1/request_manager/text_completion",
    headers: {
      ...getDefaultHeaders(),
      Authorization
    },
    data: payload,
    responseType: 'stream',
    transformResponse: (data) => data,
  };

  return await axios(PostAxios);
}

export function getDefaultHeaders(): AxiosRequestConfig["headers"] {
  const headers: AxiosRequestConfig["headers"] = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "https://groq.com",
    "Alt-Svc": 'h3=":443"; ma=2592000, h3-29=":443"; ma=2592000',
    "Content-Encoding": "gzip",
    "Grpc-Metadata-Content-Type": "application/grpc",
    Server: "groq",
    Vary: "Accept-Encoding",
    Via: "1.1 google",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.8",
    "Content-Type": "application/json; charset=utf-8",
    Origin: "https://groq.com",
    Referer: "https://groq.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "Sec-Gpc": "1",
    "User-Agent": getRandom(),
  };
  return headers;
}
