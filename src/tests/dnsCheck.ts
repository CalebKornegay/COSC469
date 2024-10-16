import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function dnsCheck() {
    getCurrentTabURL().then(url => {
        console.log(url);
        let query_url = url.replace('https://', '').replace('http://', '').replace('www.', '');
        query_url = query_url.substring(0, query_url.indexOf('/'));
        fetch('https://dns.google.com/resolve?name=' + query_url + '&rr_type=ALL').then(resp => {
            return resp.json();
        }).then((json: any) => {
            json?.Status === 0 ? console.log('Good domain') : console.log('Bad domain');
        });
        fetch(url).then(console.log);
        console.log(query_url);
    });
    return true;
}
