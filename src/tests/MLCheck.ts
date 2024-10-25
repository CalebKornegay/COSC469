import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function MLCheck() {
    const currenturl = await getCurrentTabURL();
    const response = await fetch(`${BASEURL}/ml/?url=${currenturl}`);
    const data = await response.json();
    if (data["error"]) return true;
    if (data["isPhishing"] >= 0.80) return false;
    return true;
}
