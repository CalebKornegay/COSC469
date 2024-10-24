import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function MLCheck() {
    const baseurl = "https://phish.gannaway.co/ml/?url=";
    const currenturl = await getCurrentTabURL();
    const strippedurl = currenturl.replace(/https?:\/\//, "");
    const response = await fetch(baseurl + strippedurl);
    const data = await response.json();
    if (data["error"]) return true;
    if (data["isPhishing"] >= 0.80) return false;
    return true;
}
