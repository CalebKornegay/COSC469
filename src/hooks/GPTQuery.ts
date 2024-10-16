export default async function GPTQuery(query: string) {
    const api_key = localStorage.getItem('api_key'); // Retrieve the API key from local storage

    if (!api_key) {
        throw new Error("API key is missing from local storage");
    }

    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${api_key}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o', // or 'gpt-4' if you're using GPT-4
                messages: [{ role: 'user', content: query }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content; // Return the response content from ChatGPT
    } catch (error) {
        console.error('Error querying ChatGPT:', error);
        throw error; // You can handle this error in the calling function
    }

}
