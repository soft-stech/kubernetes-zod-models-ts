import "dotenv/config";
import { consola } from "consola";
import { createConfig, getAllFiles } from "./gitlabLoader";

async function main(): Promise<void> {
  try {
    consola.start("Запуск процесса обновления");
    const config = createConfig();
    await getAllFiles(config);
  } catch (error) {
    if (error instanceof Error) {
      consola.error("Критическая ошибка:", error.message);
    } else {
      consola.error("Критическая ошибка:", error);
    }
  }
}

main();
