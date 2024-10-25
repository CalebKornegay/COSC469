import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function CheckAgainstDatabase(): Promise<boolean> {

    try {
        const currenturl = await getCurrentTabURL();
        let httpurl = currenturl.replace("https://", "http://");

        const response = await fetch(`${BASEURL}/db/?url=${httpurl}`);
        const data = await response.json();

        if (data["error"]) return true;
        if (data["isKnownPhishingSite"] === 0) return true;
        return false;
    } catch (error) {
        console.error("Error:", error);
        return true;
    }
}
