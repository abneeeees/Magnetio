import { search } from "./src/tmdb";

async function main() {
  console.log("Starting search...");

  const data = await search("interstellar");

  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);