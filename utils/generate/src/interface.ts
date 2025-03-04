import { Schema } from "./types";
import { formatComment } from "@soft-stech/string-util";
import indentString from "indent-string";
import { omit } from "lodash";

const FALLBACK_TYPE = "any";
const WILDCARD_FIELD = "*";

export interface GenerateInterfaceOptions {
  includeDescription?: boolean;
  getRefType?(ref: string): string;
  getFieldType?(key: string[], schema: Schema): string | undefined;
}

function _generateInterface(
  schema: Schema,
  options: GenerateInterfaceOptions,
  parentKeys: string[]
): string {
  const { getRefType, getFieldType, includeDescription } = options;

  if (getFieldType) {
    const result = getFieldType(parentKeys, schema);
    if (result) return result;
  }

  if (typeof schema.$ref === "string") {
    if (!getRefType) throw new Error("options.getRefType is undefined");

    return getRefType(schema.$ref);
  }

  if (schema.enum && schema.enum.length) {
    return schema.enum.map((x) => JSON.stringify(x)).join(" | ");
  }

  if (schema.not) {
    return `Exclude<${_generateInterface(
      omit(schema, ["not"]),
      options,
      parentKeys
    )}, ${_generateInterface(
      { ...omit(schema, ["not"]), ...schema.not },
      options,
      parentKeys
    )}>`;
  }

  const compileRegExp = (str: string): RegExp | undefined => {
    try {
      return new RegExp(str);
    } catch {
      console.warn("invalid regex", str);
      return undefined;
    }
  };

  const result = (() => {
    switch (schema.type) {
      case "object": {
        const { required = [], properties = {}, additionalProperties } = schema;
        let output = "";

        for (const key of Object.keys(properties)) {
          const prop = properties[key];

          if (includeDescription) {
            let pattern = {};
            let schema = {};

            if (prop.pattern) {
              const regexpString = compileRegExp(prop.pattern);

              if (
                prop.anyOf &&
                prop["x-kubernetes-int-or-string"] &&
                regexpString
              ) {
                const optional = !required.includes(key) ? `.optional()` : ``;
                const union = `union([z.number(), z.string().regex(${regexpString.toString()})])`;
                const defaultValue = prop.default
                  ? `.default(${JSON.stringify(prop.default)})`
                  : ``;

                schema = {
                  [`schema ${union}${optional}${defaultValue}`]: true
                };
              } else if (prop.type === "array") {
                console.warn("Skipping array regexp:", prop.pattern);
              } else {
                if (prop.pattern.includes("*/")) {
                  console.warn(
                    "Skipping regexp, breaks comment */:",
                    prop.pattern
                  );
                } else if (regexpString) {
                  pattern = {
                    [`pattern ${regexpString.toString().slice(1, -1)}`]: true
                  };
                } else {
                  console.warn("Invalid regex pattern:", prop.pattern);
                }
              }
            }

            // skip defaults if they are objects
            // TODO default objects (records)
            const options = {
              ...(prop.default && typeof prop.default !== "object"
                ? { [`default ${JSON.stringify(prop.default)}`]: true }
                : {}),
              ...(prop.minLength && { [`minLength ${prop.minLength}`]: true }),
              ...(prop.maxLength && { [`maxLength ${prop.maxLength}`]: true }),
              ...(prop.minimum && { [`minimum ${prop.minimum}`]: true }),
              ...(prop.maximum && { [`maximum ${prop.maximum}`]: true }),
              ...(prop.format && { [`format ${prop.format}`]: true }),
              ...pattern,
              ...schema
            };

            if (prop.description || Object.keys(options).length) {
              output += formatComment(prop.description || "", options);
            }
          }

          output += `${JSON.stringify(key)}`;
          if (!required.includes(key)) output += "?";
          output +=
            ": " +
            _generateInterface(prop, options, [...parentKeys, key]) +
            ";\n";
        }

        if (additionalProperties) {
          output += `Record<string, ${_generateInterface(
            additionalProperties,
            options,
            [...parentKeys, WILDCARD_FIELD]
          )}>\n`;

          return output;
        }

        return "{\n" + indentString(output, 2) + "}";
      }

      case "number":
      case "integer":
        return "number";

      case "string":
        switch (schema.format) {
          case "int-or-string":
            return "string | number";

          case "date-time":
            return "string | null";

          default:
            return "string";
        }

      case "boolean":
        return "boolean";

      case "array":
        if (schema.items) {
          return `Array<${_generateInterface(schema.items, options, [
            ...parentKeys,
            WILDCARD_FIELD
          ])}>`;
        }

        return `${FALLBACK_TYPE}[]`;

      case "null":
        return "null";
    }

    return "";
  })();

  if (schema.oneOf) {
    return intersectType(
      result,
      schema.oneOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["oneOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" | ")
    );
  }

  if (schema.anyOf) {
    return intersectType(
      result,
      schema.anyOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["anyOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" | ")
    );
  }

  if (schema.allOf) {
    return intersectType(
      result,
      schema.allOf
        .map((x) =>
          _generateInterface(
            { ...omit(schema, ["allOf"]), ...x },
            options,
            parentKeys
          )
        )
        .join(" & ")
    );
  }

  return result || FALLBACK_TYPE;
}

function intersectType(base: string, patch: string): string {
  if (base) {
    return `${base} & (${patch})`;
  }

  return patch;
}

export function generateInterface(
  schema: Schema,
  options: GenerateInterfaceOptions = {}
): string {
  return _generateInterface(schema, options, []);
}
