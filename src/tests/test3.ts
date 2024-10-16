import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default function test3() {
    getCurrentTabURL().then(url => {
        fetch(url).then(console.log)
    });
    return true;
}
