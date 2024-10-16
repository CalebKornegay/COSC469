import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function CheckAgainstDatabase(): Promise<boolean> {
    const baseurl = "https://phish.gannaway.co/check/?url=";

    try {
        const currenturl = await getCurrentTabURL();
        let httpurl = currenturl.replace("https", "http");

        const response = await fetch(baseurl + httpurl);
        const data = await response.json();

        if (data["error"]) return true;
        if (data["isKnown"] === 0) return true;
        return false;
    } catch (error) {
        console.error("Error:", error);
        return true;
    }
}
