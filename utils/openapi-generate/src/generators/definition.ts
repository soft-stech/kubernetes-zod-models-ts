// eslint-disable-next-line node/no-extraneous-import
import * as prettier from "prettier";
import {
  collectRefs,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  Import,
  Schema
} from "@soft-stech/generate";
import { formatComment, trimPrefix, trimSuffix } from "@soft-stech/string-util";
import { mapValues, omit } from "lodash";
import { Context } from "../context";
import {
  getClassName,
  getInterfaceName,
  getShortClassName,
  getShortInterfaceName,
  trimRefPrefix
} from "../string";
import { getRelativePath, getSchemaPath, isAPIMachineryID } from "../utils";

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
        const interfaceName = getInterfaceName(def.schemaId);
        const className = getClassName(def.schemaId);
        const shortInterfaceName = getShortInterfaceName(def.schemaId);
        const shortClassName = getShortClassName(def.schemaId);
        const refs = collectRefs(def.schema)
          .map(trimRefPrefix)
          .filter((ref) => ref !== def.schemaId);
        const imports: Import[] = [];
        const gvk = def.gvk?.[0];
        const typing = generateInterface(
          gvk ? omitTypeMetaDescription(def.schema) : def.schema,
          {
            getRefType,
            includeDescription: true
          }
        );
        const path = getDefinitionPath(def.schemaId);
        const schemaPath = getRelativePath(path, getSchemaPath(def.schemaId));
        let content = "";
        let comment = "";

        function getRefType(ref: string): string {
          const id = trimRefPrefix(ref);

          // Return the shortInterfaceName if it is a self reference.
          if (id === def.schemaId) {
            return shortInterfaceName;
          }

          return getInterfaceName(id);
        }

        if (def.schema.description) {
          comment = formatComment(def.schema.description, {
            deprecated: /deprecated/i.test(def.schema.description)
          });
        }

        for (const ref of refs) {
          const name = getInterfaceName(ref);

          if (externalAPIMachinery && isAPIMachineryID(ref)) {
            imports.push({
              name,
              path: `@soft-stech/apimachinery/${trimPrefix(
                ref,
                "io.k8s.apimachinery.pkg."
              )
                .split(".")
                .join("/")}`
            });
          } else {
            imports.push({
              name,
              path: getRelativePath(path, getDefinitionPath(ref))
            });
          }
        }

        if (def.schema.type === "object") {
          let classContent = generateInterface(def.schema, {
            getRefType,
            getFieldType(key) {
              // Rewrite types of apiVersion/kind to the interface type.
              switch (key[0]) {
                case "apiVersion":
                case "kind":
                  return `${shortInterfaceName}["${key[0]}"]`;
              }
            }
          });

          imports.push({
            name: "ModelData",
            path: "@soft-stech/base"
          });

          if (gvk) {
            imports.push({
              name: "TypeMeta",
              path: "@soft-stech/base"
            });

            imports.push({
              name: "createTypeMetaGuard",
              path: "@soft-stech/base"
            });

            classContent = `${trimSuffix(classContent, "}")}
  static apiVersion: ${shortInterfaceName}["apiVersion"] = "${getAPIVersion(
    gvk
  )}";
  static kind: ${shortInterfaceName}["kind"] = "${gvk.kind}";
  static is = createTypeMetaGuard<${shortInterfaceName}>(${shortClassName});

  constructor(data?: ModelData<${shortInterfaceName}>) {
    super();

    this.setDefinedProps({
      apiVersion: ${shortClassName}.apiVersion,
      kind: ${shortClassName}.kind,
      ...data
    } as ${shortInterfaceName});
  }
  }`;
          } else {
            classContent = `${trimSuffix(classContent, "}")}
  constructor(data?: ModelData<${shortInterfaceName}>) {
    super();

    this.setDefinedProps(data);
  }
  }`;
          }

          imports.push({ name: "Model", path: "@soft-stech/base" });
          imports.push({
            name: "setValidateFunc",
            path: "@soft-stech/base"
          });
          imports.push({
            name: "ValidateFunc",
            path: "@soft-stech/validate"
          });
          imports.push({ name: "validate", path: schemaPath });

          content += `
  ${comment}export interface ${shortInterfaceName}${
    gvk ? " extends TypeMeta " : " "
  }${typing}

  ${comment}export class ${shortClassName} extends Model<${shortInterfaceName}> implements ${shortInterfaceName} ${classContent}

  setValidateFunc(${shortClassName}, validate as ValidateFunc<${shortInterfaceName}>);
  `;
        } else {
          content += `
  ${comment}export type ${shortInterfaceName} = ${typing};

  export type ${shortClassName} = ${shortInterfaceName};
  `;
        }

        content += `
  export {
    ${shortInterfaceName} as ${interfaceName},
    ${shortClassName} as ${className}
  };
  `;

        if (imports.length) {
          content = generateImports(imports) + "\n" + content;
        }

        const formattedContent = await prettier.format(content, {
          semi: true,
          parser: "typescript",
          trailingComma: "none"
        });

        return {
          path,
          content: formattedContent
        };
      })
    );
  };
}
