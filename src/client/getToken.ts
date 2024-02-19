import axios from "axios";

/** might want to proxy */
export default async function getGuestToken(): Promise<{ auth: string; expiry: Date }> {
    const response = (await axios.get("https://api.groq.com/v1/auth/anon_token")).data;
    return {
        auth: `Bearer ${response.access_token}`,
        expiry: response.expiry
    };
}