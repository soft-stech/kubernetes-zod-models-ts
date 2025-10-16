import fs from "node:fs";
import path from "node:path";
import { consola } from "consola";
import yaml from "js-yaml";

// Describes crds + defaults snapshot
const REF = "v3.0.0-rc.64";
const BOOTSMAN_VERSION = "v99.9.9-dev";

type Config = {
  crdsDir: string;
  defaultsDir: string;
  baseUrl: string | undefined;
  token: string | undefined;
  projectId: string | undefined;
  ref: string;
};

type GitLabFile = {
  id: string;
  name: string;
  type: string;
  path: string;
  mode: string;
};

const CRDS_PATH = "src/crds";
export const DEFAULTS_PATH = "src/defaults";

const createConfig = (): Config => {
  const config = {
    baseUrl: process.env.GITLAB_URL,
    token: process.env.GITLAB_TOKEN,
    projectId: process.env.GITLAB_PROJECT_ID,
    ref: REF
  };

  if (!config.baseUrl || !config.token || !config.projectId) {
    throw new Error(
      "Необходимые переменные окружения не найдены. Требуются: GITLAB_URL, GITLAB_TOKEN, GITLAB_PROJECT_ID"
    );
  }

  return {
    ...config,
    crdsDir: path.join(process.cwd(), CRDS_PATH),
    defaultsDir: path.join(process.cwd(), DEFAULTS_PATH)
  };
};

async function fetchFile(config: Config, filePath: string): Promise<string> {
  if (!config.token) {
    throw new Error("Токен GitLab не указан");
  }

  const url = `${config.baseUrl}/api/v4/projects/${
    config.projectId
  }/repository/files/${encodeURIComponent(filePath)}/raw?ref=${config.ref}`;

  consola.debug(`Загрузка файла: ${filePath}`);
  const response = await fetch(url, {
    headers: { "PRIVATE-TOKEN": config.token }
  });

  if (!response.ok) {
    throw new Error(
      `Ошибка загрузки: ${response.status} ${await response.text()}`
    );
  }

  return response.text();
}

function ensureDirectories(config: Config): void {
  // Создаем базовую директорию для defaults
  if (!fs.existsSync(config.defaultsDir)) {
    fs.mkdirSync(config.defaultsDir, { recursive: true });
  }
}

async function getFile(config: Config, filePath: string): Promise<string> {
  const content = await fetchFile(config, filePath);
  return content;
}

async function fetchDirectory(
  config: Config,
  dirPath: string
): Promise<GitLabFile[]> {
  let page = 1;
  const perPage = 100;
  let allFiles: GitLabFile[] = [];

  if (!config.token) {
    throw new Error("Токен GitLab не указан");
  }

  let hasMoreFiles = true;
  while (hasMoreFiles) {
    const url = `${config.baseUrl}/api/v4/projects/${
      config.projectId
    }/repository/tree?ref=${config.ref}&path=${encodeURIComponent(
      dirPath
    )}&recursive=true&per_page=${perPage}&page=${page}`;

    const response = await globalThis.fetch(url, {
      headers: { "PRIVATE-TOKEN": config.token }
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка списка файлов: ${response.status} ${await response.text()}`
      );
    }

    const files = await response.json();
    if (files.length === 0) {
      hasMoreFiles = false;
      break;
    }

    allFiles = [...allFiles, ...files];
    page++;
  }

  return allFiles;
}

// async function fetchReleases(config) {
//   const releasesPath = "internal/provisioning/embedded/data/releases";
//   const releases = await fetchDirectory(config, releasesPath);

//   return releases
//     .filter((f) => f.type === "tree")
//     .map((f) => ({
//       version: path.basename(f.path),
//       path: f.path,
//     }));
// }

function cleanDirectories(config: Config): void {
  for (const dir of [config.crdsDir, config.defaultsDir]) {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

async function mergeYamlFiles(
  folderPath: string,
  outputFile: string,
  yamlLoad: (content: string) => unknown
): Promise<void> {
  try {
    const files = fs
      .readdirSync(folderPath)
      .filter(
        (file) =>
          file.endsWith(".yaml") ||
          file.endsWith(".yml") ||
          file.endsWith(".yaml.tmpl") ||
          file.endsWith(".yml.tmpl")
      );

    const yamlDocuments = files.map((file) => {
      const filePath = path.join(folderPath, file);
      const content = fs.readFileSync(filePath, "utf8");
      return yamlLoad(content);
      // return yaml.load(content);
    });

    const multiDocumentYaml = yamlDocuments
      .map((doc) => yaml.dump(doc))
      .join("\n---\n");
    fs.writeFileSync(outputFile, multiDocumentYaml, "utf8");

    consola.info(`Merged YAML files into ${outputFile}`);
  } catch (error) {
    console.error("Error merging YAML files:", error);
  }
}

async function getAllFiles(config: Config): Promise<void> {
  consola.start("Загрузка файлов из GitLab");
  cleanDirectories(config);
  ensureDirectories(config);

  consola.start("Загрузка CRD файлов");
  const crdFiles =
    (await fetchDirectory(config, "config/provisioning/crd/")) || [];
  const filteredCrd = crdFiles
    .filter((f) => f.type === "blob" && f.path.includes(".bootsman.tech"))
    .map((f) => ({
      path: f.path,
      targetPath: path.join(config.crdsDir, path.basename(f.path))
    }));
  consola.success("CRD файлы загружены");

  consola.start("Сохранение CRD файлов");
  for (const { path: filePath, targetPath } of filteredCrd) {
    const content = await getFile(config, filePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content);
  }
  mergeYamlFiles(CRDS_PATH, CRDS_PATH + "/crds.yaml", (content) =>
    yaml.load(content)
  );
  consola.success("CRD файлы сохранены");

  consola.start("Загрузка аддонов");
  const addonFiles =
    (await fetchDirectory(
      config,
      `internal/provisioning/embedded/data/releases/${BOOTSMAN_VERSION}/addons`
    )) || [];
  consola.success("Аддоны загружены");

  consola.start("Сохранение аддонов файлов");
  for (const { path: filePath } of addonFiles) {
    const targetPath = path.join(config.defaultsDir, path.basename(filePath));
    const content = await getFile(config, filePath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, content);
  }
  mergeYamlFiles(DEFAULTS_PATH, DEFAULTS_PATH + "/defaults.yaml", (content) => {
    const documents = yaml.loadAll(content);

    // Берем последний документ
    return documents[documents.length - 1];
  });
  consola.success("Аддоны сохранены");
  consola.success("Загрузка файлов завершена");
}

export { createConfig, getAllFiles };
