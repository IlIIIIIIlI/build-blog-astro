// scripts/debug-content.mjs
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const contentDir = join(__dirname, "../src/content/blog");

async function scanDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        return scanDir(fullPath);
      } else if (entry.name.endsWith(".md")) {
        const content = await readFile(fullPath, "utf-8");
        const frontmatter = content.split("---")[1];
        const metadata = yaml.load(frontmatter);
        return {
          path: fullPath.replace(__dirname, ""),
          metadata,
        };
      }
    })
  );

  return files.flat().filter(Boolean);
}

console.log("Scanning content directory:", contentDir);
try {
  const files = await scanDir(contentDir);
  console.log("\nFound files:");
  files.forEach((file) => {
    console.log("\nFile:", file.path);
    console.log("Frontmatter:", JSON.stringify(file.metadata, null, 2));
  });
} catch (error) {
  console.error("Error scanning directory:", error);
}
