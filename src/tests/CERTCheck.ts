import { BASEURL } from "../const";
import getCurrentTabURL from "../hooks/getCurrentTabURL";
import { TestState } from "../types";

export default async function CERTCheck(): Promise<TestState>{
    const url = await getCurrentTabURL();
    let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
    let place = query_url.indexOf('/');
    query_url = query_url.substring(0, place < 0 ? query_url.length : place);
    
    const resp = await fetch(`${BASEURL}/cert/url=${query_url}`);
    const json: any = await resp.json();
    return json.trusted;
}
