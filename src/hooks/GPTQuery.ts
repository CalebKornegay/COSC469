import OpenAI from "openai";

export default async function GPTQuery(query:string) : Promise<string> {
    const api_key = localStorage.getItem('api_key');

    const openai = new OpenAI({
        apiKey: api_key ?? undefined,
        dangerouslyAllowBrowser: true,
    });

    return new Promise( (resolve, reject) => {
        openai.chat.completions.create({
            messages: [{ role: "system", content: query }],
            model: "gpt-4o",
        }).then((resp => {
            resolve(resp?.choices?.[0]?.message?.content ?? "");
        })).catch((_ => {
            reject("An error occured while querying OpenAI. Is your key valid?");
        }));
    });
}