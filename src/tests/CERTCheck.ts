import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function CERTCheck() {
    const url = await getCurrentTabURL();
    let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
    query_url = query_url.substring(0, query_url.indexOf('/'));
    
    const resp = await fetch(`https://phish.gannaway.co/cert/url=${query_url}`);
    const json: any = await resp.json();
    console.log(json);
}
