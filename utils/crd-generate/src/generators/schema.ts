import {
  Generator,
  transformSchema,
  compileSchema,
  OutputFile
} from "@soft-stech/generate";
import { getSchemaPath } from "../utils";
import { trimSuffix } from "@soft-stech/string-util";

const generateSchemas: Generator = async (definitions) => {
  const files: OutputFile[] = [];

  for (const def of definitions) {
    const schema = { ...transformSchema(def.schema), $id: def.schemaId };

    files.push(
      {
        path: getSchemaPath(def.schemaId),
        content: await compileSchema(schema, {
          "io.k8s.apimachinery.pkg.apis.meta.v1.ObjectMeta":
            "@soft-stech/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta"
        })
      },
      // TODO: Move this to @soft-stech/generate
      {
        path: trimSuffix(getSchemaPath(def.schemaId), ".js") + ".d.ts",
        content: `export function validate(data: unknown): boolean;`
      }
    );
  }

  return files;
};

export default generateSchemas;
