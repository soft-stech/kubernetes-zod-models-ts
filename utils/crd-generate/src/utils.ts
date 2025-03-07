import { camelCase, upperFirst } from "@soft-stech/string-util";
import { trimSuffix } from "@soft-stech/string-util";
import { posix } from "path";

// TODO: Move to @soft-stech/generate
export function getClassName(s: string): string {
  return upperFirst(camelCase(s, ".-"));
}

// TODO: Move to @soft-stech/generate
export function getSchemaPath(id: string): string {
  return `_schemas/${getClassName(id)}.js`;
}

// TODO: Move to @soft-stech/generate
export function getRelativePath(from: string, to: string): string {
  const ext = posix.extname(to);
  const path = trimSuffix(posix.relative(posix.dirname(from), to), ext);

  if (!path.startsWith(".")) {
    return `./${path}`;
  }

  return path;
}
