import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";
import { TestState } from "../types";

export default async function MLCheck(): Promise<TestState> {
    const currenturl = await getCurrentTabURL();
    const response = await fetch(`${BASEURL}/ml/?url=${currenturl}`);
    const data = await response.json();
    if (data["error"]) return TestState.DISABLED;
    if (data["isPhishing"] >= 0.80) return TestState.FAIL;
    return TestState.PASS;
}
