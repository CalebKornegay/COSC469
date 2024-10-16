import OpenAI from "openai";

export default async function GPTQuery(query:string) {
    const api_key = localStorage.getItem('api_key');

    const openai = new OpenAI({
        apiKey: api_key ?? undefined,
        dangerouslyAllowBrowser: true,
    });
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: query }],
        model: "gpt-4o",
    });
    
    console.log(completion.choices[0]);

    return completion.choices[0].message.content; // Return the response content from ChatGPT

}