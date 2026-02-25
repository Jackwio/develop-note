import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type DefaultTheme } from 'vitepress'

type SidebarItem = DefaultTheme.SidebarItem

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsRoot = path.resolve(__dirname, '..')
const zhHantCollator = new Intl.Collator('zh-Hant')

// Add folder names here to make specific top-level folders expanded by default.
const expandedTopLevelDirs = new Set<string>()

function toDisplayText(name: string): string {
  return name.replace(/\.md$/i, '')
}

function toDocLink(relativeMdPath: string): string {
  const normalized = relativeMdPath.split(path.sep).join('/').replace(/\.md$/i, '')
  return normalized.endsWith('/index') ? `/${normalized.slice(0, -6)}/` : `/${normalized}`
}

function isMarkdownFile(name: string): boolean {
  return name.toLowerCase().endsWith('.md')
}

function shouldIgnoreEntry(entry: fs.Dirent): boolean {
  if (entry.name.startsWith('.')) {
    return true
  }
  return entry.isDirectory() && entry.name === '.vitepress'
}

function readVisibleEntries(directory: string): fs.Dirent[] {
  return fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => !shouldIgnoreEntry(entry))
}

function sortByZhHantName<T extends { name: string }>(a: T, b: T): number {
  return zhHantCollator.compare(a.name, b.name)
}

function buildDirectoryGroup(absoluteDirPath: string, relativeDirPath: string, isTopLevel: boolean): SidebarItem {
  const entries = readVisibleEntries(absoluteDirPath)
    .filter((entry) => entry.isDirectory() || (entry.isFile() && isMarkdownFile(entry.name)))
    .sort(sortByZhHantName)

  const groupItems: SidebarItem[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      groupItems.push(
        buildDirectoryGroup(
          path.join(absoluteDirPath, entry.name),
          path.join(relativeDirPath, entry.name),
          false
        )
      )
      continue
    }

    groupItems.push({
      text: toDisplayText(entry.name),
      link: toDocLink(path.join(relativeDirPath, entry.name))
    })
  }

  const folderName = path.basename(relativeDirPath)
  return {
    text: folderName,
    collapsed: isTopLevel ? !expandedTopLevelDirs.has(folderName) : false,
    items: groupItems
  }
}

function buildSidebar(): SidebarItem[] {
  const rootEntries = readVisibleEntries(docsRoot)
    .filter((entry) => entry.isDirectory() || (entry.isFile() && isMarkdownFile(entry.name)))
    .sort(sortByZhHantName)

  const rootFileItems: SidebarItem[] = []
  const topDirectoryGroups: SidebarItem[] = []

  for (const entry of rootEntries) {
    if (entry.isDirectory()) {
      topDirectoryGroups.push(
        buildDirectoryGroup(path.join(docsRoot, entry.name), entry.name, true)
      )
      continue
    }

    if (entry.name === 'index.md') {
      continue
    }

    rootFileItems.push({
      text: toDisplayText(entry.name),
      link: toDocLink(entry.name)
    })
  }

  const rootTreeItems: SidebarItem[] = []

  if (rootFileItems.length > 0) {
    rootTreeItems.push({
      text: '根目錄',
      collapsed: false,
      items: rootFileItems
    })
  }

  rootTreeItems.push(...topDirectoryGroups)

  return rootTreeItems
}

function normalizeBasePath(basePath: string): string {
  const trimmed = basePath.trim()
  if (!trimmed) {
    return '/'
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

function resolveBasePath(): string {
  const override = process.env.VITEPRESS_BASE
  if (override) {
    return normalizeBasePath(override)
  }

  const isGithubRuntime =
    process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true'
  if (!isGithubRuntime) {
    return '/'
  }

  const repository = process.env.GITHUB_REPOSITORY ?? ''
  const repositoryName = repository.split('/')[1] ?? ''
  if (!repositoryName || repositoryName.endsWith('.github.io')) {
    return '/'
  }

  return normalizeBasePath(repositoryName)
}

export default defineConfig({
  title: 'AI Tool Note',
  description: 'Technical notes built with VitePress',
  base: resolveBasePath(),
  themeConfig: {
    outline: 'deep',
    sidebar: buildSidebar()
  }
})
