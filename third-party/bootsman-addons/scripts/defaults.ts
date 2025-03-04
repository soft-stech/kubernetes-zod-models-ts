import { consola } from "consola";
import yaml from "js-yaml";
import fs from "node:fs";
import * as prettier from "prettier";
import { pathToFileURL } from "url";
import { z } from "zod";
import { DEFAULTS_PATH } from "./gitlabLoader";

async function loadSchema(schemaPath: string): Promise<z.ZodSchema> {
  try {
    const module = await import(pathToFileURL(schemaPath).toString()); // Ensure proper file URL
    const schema = Object.values(module).find(
      (exp) => exp instanceof z.ZodSchema
    );

    if (!schema) {
      throw new Error("No Zod schema found in the module.");
    }

    return schema as z.ZodSchema;
  } catch (error) {
    console.error("Error loading schema:", error);
    throw error;
  }
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

async function generateDefaults(): Promise<void> {
  consola.start("Аддоны (defaults) обрабатываются");

  const content = fs.readFileSync(DEFAULTS_PATH + "/defaults.yaml", "utf8");
  const defaults = yaml.loadAll(content);

  const schema = z.object({
    apiVersion: z.string(),
    kind: z.string(),
    spec: z.object({})
  });

  for (const def of defaults) {
    const result = schema.safeParse(def);

    if (result.success) {
      const [api, version] = result.data.apiVersion.split("/");
      const kind = result.data.kind;

      const json = JSON.stringify(def);
      const kindVar = `${toCamelCase(kind)}Base`;
      const content = `
// Generated default
const ${kindVar} = ${json};

// Default export
export default ${kindVar};

// Named export
export { ${kindVar} };
    `;

      const formattedContent = await prettier.format(content, {
        semi: true,
        parser: "typescript",
        trailingComma: "none"
      });

      const dir = `gen/${api}/${version}`;
      const name = kind;

      const schemaPath = `${dir}/${name}.schema.ts`;
      if (fs.existsSync(schemaPath)) {
        const schema = loadSchema(schemaPath);
        const result = (await schema).safeParse(def);
        const basePath = `${dir}/${name}.base.ts`;

        if (result.success) {
          consola.info(`${basePath} соответствует схеме`);
          fs.writeFileSync(basePath, formattedContent, "utf8");
        } else {
          consola.error(`Файл ${basePath} не соответствует схеме. Пропускаем!`);
        }
      } else {
        consola.error(`Файл ${dir}/${name}.schema.ts не найден`);
      }
    } else {
      consola.error(def);
    }
  }

  consola.success("Аддоны (defaults) обработаны");
  consola.success("Процесс успешно завершен");
}

generateDefaults();
