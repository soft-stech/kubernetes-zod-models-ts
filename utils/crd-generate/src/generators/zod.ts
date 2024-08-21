import {
  Definition,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  GroupVersionKind,
  Import,
  OutputFile,
  transformSchema
} from "@soft-stech/generate";
import { formatComment, trimSuffix } from "@soft-stech/string-util";
import { generate } from "ts-to-zod";

function getFieldType(key: string[]): string | undefined {
  if (key.length === 1 && key[0] === "metadata") {
    return "IObjectMeta";
  }
}

function generateDefinition(
  gvk: GroupVersionKind,
  def: Definition
): OutputFile {
  const apiVersion = getAPIVersion(gvk);
  const className = gvk.kind;
  const interfaceName = `I${className}`;
  const imports: Import[] = [];
  const inputOutputMappings: { input: string; output: string }[] = [];
  const interfaceContent = generateInterface(def.schema, {
    includeDescription: true,
    getFieldType
  });
  //   let classContent = generateInterface(def.schema, {
  //     getFieldType(key) {
  //       if (key.length === 1) {
  //         return `${interfaceName}${JSON.stringify(key)}`;
  //       }
  //     }
  //   });
  let comment = "";

  //   classContent =
  //     trimSuffix(classContent, "}") +
  //     `
  //   static apiVersion: ${interfaceName}["apiVersion"] = ${JSON.stringify(
  //     apiVersion
  //   )};
  //   static kind: ${interfaceName}["kind"] = ${JSON.stringify(gvk.kind)};
  //   static is = createTypeMetaGuard<${interfaceName}>(${className});

  //   constructor(data?: ModelData<${interfaceName}>) {
  //     super({
  //       apiVersion: ${className}.apiVersion,
  //       kind: ${className}.kind,
  //       ...data
  //     } as ${interfaceName});
  //   }
  //   }
  //   `;

  imports.push({
    name: "IObjectMeta",
    path: "@soft-stech/apimachinery/apis/meta/v1/ObjectMeta"
  });
  inputOutputMappings.push({
    input: "@soft-stech/apimachinery/apis/meta/v1/ObjectMeta",
    output: "@soft-stech/apimachinery/apis/meta/v1/ObjectMeta.schema"
  });

  imports.push({
    name: "addSchema",
    path: "@soft-stech/apimachinery/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta"
  });

  imports.push({
    name: "Model",
    path: "@soft-stech/base"
  });

  imports.push({
    name: "setSchema",
    path: "@soft-stech/base"
  });

  imports.push({
    name: "ModelData",
    path: "@soft-stech/base"
  });

  imports.push({
    name: "createTypeMetaGuard",
    path: "@soft-stech/base"
  });

  imports.push({
    name: "register",
    path: "@soft-stech/validate"
  });

  if (def.schema.description) {
    comment = formatComment(def.schema.description, {
      deprecated: /^deprecated/i.test(def.schema.description)
    });
  }

  const schema = transformSchema(def.schema);

  const tsContent = `${generateImports(imports)}
 const schemaId = ${JSON.stringify(def.schemaId)};
const schema = ${JSON.stringify(schema, null, "  ")};

${comment}export interface ${interfaceName} ${interfaceContent}
 `;
  const schemaGenerator = generate({
    sourceText: tsContent,
    keepComments: true,
    inputOutputMappings,
    getSchemaName(identifier) {
      return identifier + "Schema";
    }
  });

  const zodSchema = schemaGenerator.getZodSchemasFile(
    "./${apiVersion}/${className}.schema.ts"
  );

  const content = `${zodSchema}`;
  console.log("generating zod schema for", def.schemaId);
  return {
    path: `${apiVersion}/${className}.schema.ts`,
    content: `
    ${content}
`
  };
}

const generateDefinitions: Generator = async (definitions) => {
  const output: OutputFile[] = [];

  for (const def of definitions) {
    const gvks = def.gvk;

    if (gvks && gvks.length) {
      output.push(generateDefinition(gvks[0], def));
    }
  }

  return output;
};

export default generateDefinitions;
