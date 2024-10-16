import getCurrentTabURL from "../hooks/getCurrentTabURL";

export default async function MLCheck() {
    const currenturl = await getCurrentTabURL();


  return false;
}
