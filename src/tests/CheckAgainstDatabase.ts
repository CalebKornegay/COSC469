import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";
import { TestState } from "../types";

export default async function CheckAgainstDatabase(): Promise<TestState> {

    try {
        const currenturl = await getCurrentTabURL();
        let httpurl = currenturl.replace("https://", "http://");

        const response = await fetch(`${BASEURL}/db/?url=${httpurl}`);
        const data = await response.json();

        if (data["error"]) return TestState.DISABLED;
        if (data["isKnownPhishingSite"] === 0) return TestState.PASS;
        return TestState.FAIL;
    } catch (error) {
        console.error("Error:", error);
        return TestState.DISABLED;
    }
}
