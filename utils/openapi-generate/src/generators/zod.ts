import {
  collectRefs,
  generateImports,
  generateInterface,
  Generator,
  Import,
  Schema
} from "@kubernetes-models/generate";
import { formatComment, trimPrefix } from "@kubernetes-models/string-util";
import { camel } from "case";
import { mapValues, omit } from "lodash";
// eslint-disable-next-line node/no-extraneous-import
import * as prettier from "prettier";
import { generate } from "ts-to-zod";
import { Context } from "../context";
import {
  getInterfaceName,
  getShortInterfaceName,
  trimRefPrefix
} from "../string";
import { getRelativePath, isAPIMachineryID } from "../utils";

function omitTypeMetaDescription(schema: Schema): Schema {
  const { properties, ...rest } = schema;
  if (!properties) return schema;

  return {
    ...rest,
    properties: mapValues(properties, (prop, key) => {
      if (["apiVersion", "kind"].includes(key)) {
        return omit(prop, "description");
      }

      return prop;
    })
  };
}

export default function ({
  getDefinitionPath,
  externalAPIMachinery
}: Context): Generator {
  return async (definitions) => {
    return await Promise.all(
      definitions.map(async (def) => {
        function getRefType(ref: string): string {
          const id = trimRefPrefix(ref);

          // Return the shortInterfaceName if it is a self reference.
          if (id === def.schemaId) {
            return shortInterfaceName;
          }

          return getInterfaceName(id);
        }

        // IIoK8sKubeAggregatorPkgApisApiregistrationV1ServiceReference
        const interfaceName = getInterfaceName(def.schemaId);

        // IServiceReference
        const shortInterfaceName = getShortInterfaceName(def.schemaId);

        // {
        //   refs: [
        //     "io.k8s.kube-aggregator.pkg.apis.apiregistration.v1.APIServiceCondition"
        //   ];
        // }

        const refs = collectRefs(def.schema)
          .map(trimRefPrefix)
          .filter((ref) => ref !== def.schemaId);
        const imports: Import[] = [];
        const inputOutputMappings: { input: string; output: string }[] = [];
        const gvk = def.gvk?.[0];
        const typing = generateInterface(
          gvk ? omitTypeMetaDescription(def.schema) : def.schema,
          {
            getRefType,
            includeDescription: true
          }
        );
        const defPath = getDefinitionPath(def.schemaId).replace(
          ".ts",
          ".schema.ts"
        );

        const importPath = getDefinitionPath(def.schemaId)
          .replace(".ts", "")
          .split("/")
          .at(-1);

        let content = "";
        let interfaceContent = "";
        let comment = "";

        if (def.schema.description) {
          comment = formatComment(`${def.schema.description}`, {
            deprecated: /deprecated/i.test(def.schema.description)
          });
        }

        for (const ref of refs) {
          const name = getInterfaceName(ref);

          if (externalAPIMachinery && isAPIMachineryID(ref)) {
            const relPath = `@kubernetes-models/apimachinery/${trimPrefix(
              ref,
              "io.k8s.apimachinery.pkg."
            )
              .split(".")
              .join("/")}`;
            const relPathSchema = relPath + ".schema";

            imports.push({
              name,
              path: relPathSchema
            });

            inputOutputMappings.push({
              input: relPath,
              output: relPathSchema
            });
          } else {
            const relPath = getRelativePath(defPath, getDefinitionPath(ref));
            const relPathSchema = relPath + ".schema";
            imports.push({
              name,
              path: relPathSchema
            });

            inputOutputMappings.push({
              input: relPath,
              output: relPathSchema
            });
          }
        }

        if (def.schema.type === "object") {
          if (gvk) {
            imports.push({
              name: "TypeMeta",
              path: "@kubernetes-models/base"
            });

            inputOutputMappings.push({
              input: "@kubernetes-models/base",
              output: "@kubernetes-models/base"
            });
          }

          if (imports.length) {
            interfaceContent = generateImports(imports) + "\n" + content;
          }

          interfaceContent += `
${comment}interface ${shortInterfaceName}${
            gvk ? " extends TypeMeta " : " "
          }${typing}
`;

          const schemaGenerator = generate({
            sourceText: interfaceContent,
            keepComments: true,
            inputOutputMappings
          });

          const schema = schemaGenerator.getZodSchemasFile(`./${importPath}`);
          content += `
${schema}`;
        } else {
          interfaceContent += `
${comment}type ${shortInterfaceName} = ${typing};
`;

          const schemaGenerator = generate({
            sourceText: interfaceContent,
            keepComments: true
          });

          const schema = schemaGenerator.getZodSchemasFile(`./${importPath}`);
          content += `
${schema}`;
        }

        content += `
export {
  ${camel(shortInterfaceName)}Schema,
  ${camel(shortInterfaceName)}Schema as ${camel(interfaceName)}Schema,
};
`;

        const formattedContent = await prettier.format(content, {
          semi: true,
          parser: "typescript",
          trailingComma: "none"
        });

        return {
          path: defPath,
          content: formattedContent
        };
      })
    );
  };
}
