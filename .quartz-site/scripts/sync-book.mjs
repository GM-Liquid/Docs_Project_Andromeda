import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(scriptDir, "..")
const repoRoot = resolve(siteRoot, "..")

const sourcePath = resolve(repoRoot, "Книга правил", "Проект Андромеда v0.4.md")
const targetPath = resolve(siteRoot, "content", "index.md")

export async function syncBook() {
  const source = (await readFile(sourcePath, "utf8")).replace(/^\uFEFF/, "").trimEnd()
  const generated = ["---", "title: Проект Андромеда", "---", "", source, ""].join("\n")

  await mkdir(dirname(targetPath), { recursive: true })

  let current = ""
  try {
    current = await readFile(targetPath, "utf8")
  } catch {
    current = ""
  }

  if (current !== generated) {
    await writeFile(targetPath, generated, "utf8")
  }

  return { sourcePath, targetPath }
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  const { sourcePath: source, targetPath: target } = await syncBook()
  console.log(`Synced ${source} -> ${target}`)
}
