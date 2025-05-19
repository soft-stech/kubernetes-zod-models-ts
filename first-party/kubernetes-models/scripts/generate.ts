/* eslint-disable node/no-unpublished-import */
import {
  generate,
  mergeOpenAPISpecs,
  isAPIMachineryID
} from "@soft-stech/openapi-generate";
import { readInput } from "@soft-stech/read-input";
import { join } from "path";
import { OpenAPIV2 } from "openapi-types";

type Document = OpenAPIV2.Document<any>;

/**
 * Older versions first. Add only versions with removed APIs and latest version.
 *
 * Removed APIs: https://kubernetes.io/docs/reference/using-api/deprecation-guide/
 * Available versions: https://github.com/tommy351/kubernetes-openapi-spec/tree/main/openapi
 */
const VERSIONS = [
  // Latest version
  "1.30.0"
];

async function fetchSpec(): Promise<Document> {
  const specs: OpenAPIV2.Document[] = [];

  for (const ver of VERSIONS) {
    const url = `./../../kubernetes-openapi-spec/openapi/${ver}.json`;

    console.log("Reading:", url);
    specs.push(JSON.parse(await readInput(url)));
  }

  return mergeOpenAPISpecs<Document>(specs);
}

function omitAPIMachineryDefinitions(doc: Document): void {
  if (!doc.definitions) return;

  doc.definitions = Object.fromEntries(
    Object.entries(doc.definitions).filter(([key]) => !isAPIMachineryID(key))
  );
}

function patchStatefulSetSpec(spec: Document): void {
  const pvcSpec =
    spec.definitions?.["io.k8s.api.core.v1.PersistentVolumeClaim"];
  if (!pvcSpec) return;

  const volumeClaimTemplates =
    spec.definitions?.["io.k8s.api.apps.v1.StatefulSetSpec"]?.properties
      ?.volumeClaimTemplates;
  if (!volumeClaimTemplates || !volumeClaimTemplates.items) return;

  volumeClaimTemplates.items = pvcSpec as any;
}

(async () => {
  const spec = await fetchSpec();

  omitAPIMachineryDefinitions(spec);
  patchStatefulSetSpec(spec);

  await generate({
    input: JSON.stringify(spec),
    outputPath: join(__dirname, "../gen"),
    externalAPIMachinery: true
  });
})();
