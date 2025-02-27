/* eslint-disable node/no-unpublished-import */
import { generate } from "../../../utils/crd-generate";
import { readInput } from "@soft-stech/read-input";
import fs from "fs";
import { join } from "path";

async function fetchSpec(): Promise<string> {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const inputs = packageJson["crd-generate"].input ?? [];
  const documents: string[] = [];

  for (const path of inputs) {
    console.log("Reading:", path);
    documents.push(await readInput(path));
  }

  return documents.join("\n---\n");
}

console.log("Generating Bootsman CRD definitions...");

(async () => {
  const spec = await fetchSpec();
  await generate({
    input: spec,
    outputPath: join(__dirname, "../gen")
  });
})();
