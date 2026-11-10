import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env");
config({ path: envPath });
