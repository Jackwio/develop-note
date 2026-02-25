# AI Tool Note

使用 VitePress 建立的技術筆記站，所有筆記內容放在 `docs/`，並透過 GitHub Actions 自動部署到 GitHub Pages。

## 專案結構

```text
.
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.ts
│  │  └─ theme/
│  │     ├─ index.ts
│  │     └─ style.css
│  ├─ index.md
│  ├─ markdown-examples.md
│  └─ api-examples.md
├─ .github/
│  └─ workflows/
│     └─ deploy-docs.yml
├─ package.json
└─ LICENSE
```

`index.md`
```ts
# AI Tool Note

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
const notesEntryPath = withBase('/markdown-examples')

onMounted(() => {
  router.go(notesEntryPath)
})
</script>

正在導向筆記頁面...

若沒有自動跳轉，請點擊 <a :href="notesEntryPath">開始閱讀</a>。
```

`style.css`
```css
.vp-doc img {
  cursor: zoom-in;
}

.medium-zoom-overlay {
  z-index: 30;
}

.medium-zoom-image--opened {
  z-index: 31;
}

/* Sidebar: 強化成接近 VS Code explorer 的單一樹狀視覺 */
.VPSidebar .group + .group {
  border-top: 0;
  padding-top: 0;
}

.VPSidebar .VPSidebarItem.level-0 {
  padding-bottom: 8px;
}

.VPSidebar .VPSidebarItem.collapsed.level-0 {
  padding-bottom: 8px;
}

.VPSidebar .VPSidebarItem.level-1 > .items,
.VPSidebar .VPSidebarItem.level-2 > .items,
.VPSidebar .VPSidebarItem.level-3 > .items,
.VPSidebar .VPSidebarItem.level-4 > .items,
.VPSidebar .VPSidebarItem.level-5 > .items {
  border-left: 1px solid var(--vp-c-divider);
  margin-left: 8px;
  padding-left: 12px;
}

.VPSidebar .VPSidebarItem .caret {
  display: none;
}

.VPSidebar .VPSidebarItem.collapsible > .item > .text::before {
  content: '▾';
  display: inline-block;
  width: 14px;
  margin-right: 4px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  transform: translateY(-1px);
}

.VPSidebar .VPSidebarItem.collapsible.collapsed > .item > .text::before {
  content: '▸';
}

.VPSidebar .VPSidebarItem.is-link > .item > .link > .text::before {
  content: '·';
  display: inline-block;
  width: 14px;
  margin-right: 4px;
  color: var(--vp-c-text-3);
}

.VPSidebar .VPSidebarItem.is-active > .item {
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft);
}
```

## 筆記站實作方式

- 所有 Markdown 筆記皆放在 `docs/`。
- VitePress 設定檔在 `docs/.vitepress/config.ts`。
- `config.ts` 會在啟動與 build 時掃描檔案系統，自動產生 sidebar。
- `config.ts` 會自動依 GitHub Actions 環境計算 `base`，避免 GitHub Pages 子路徑部署時發生 CSS/JS 404。
- `config.ts` 的 `themeConfig.outline` 設為 `'deep'`，讓右側大綱深度設定全域生效。
- GitHub Actions 會在 `main` 有新 commit 時，自動 build 與部署到 GitHub Pages（`.github/workflows/deploy-docs.yml`）。
- `docs/index.md` 改成會在進入時自動導向筆記畫面。
- `docs/.vitepress/theme/index.ts` 透過 `medium-zoom` 全域啟用「點擊圖片放大」。
- `docs/.vitepress/theme/style.css` 會覆寫預設 sidebar 視覺，讓目錄層級更接近 VS Code Explorer。

## 全域圖片放大設定

對應檔案：

- `docs/.vitepress/theme/index.ts`
- `docs/.vitepress/theme/style.css`

目前行為：

- 所有筆記內容區（`.vp-doc`）中的圖片，都可點擊放大。
- 切換頁面後會自動重新綁定，不需要每篇手動設定。
- 若圖片在連結內（`<a><img /></a>`）或帶有 `.no-zoom`，會自動排除放大。

若某張圖不想啟用放大，請在 Markdown 中改用 HTML 並加上 `no-zoom`：

```html
<img src="./image.png" alt="示意圖" class="no-zoom" />
```

## Sidebar Item 形成規則

對應檔案：`docs/.vitepress/config.ts`

1. 掃描 `docs/`，忽略隱藏檔案/資料夾與 `.vitepress`。
2. 支援遞迴子資料夾（多層資料夾）。
3. 每個資料夾都會建立成一個群組（即使只有 `overview.md`），並包在單一 root 樹狀結構。
4. 每個資料夾內的 `.md` 會變成 item 連結。
5. 根目錄 `index.md` 不放入 sidebar（首頁仍由 `/` 進入）。
6. 根目錄其他 `.md`（例如 `promptfile.md`）會放在「根目錄」群組。
7. 目錄與檔案以 `zh-Hant` locale 排序。
8. 根層資料夾群組預設收合（collapsed）。

## VS Code 風格層級導覽與全域大綱

對應檔案：

- `docs/.vitepress/config.ts`
- `docs/.vitepress/theme/style.css`

目前行為：

- 左側 sidebar 以單一樹狀結構呈現，減少分段感。
- 以縮排線、箭頭與檔案標記強化層級辨識，體驗更接近 VS Code 的檔案總管。
- `themeConfig.outline = 'deep'` 為全域設定，所有文件頁面（不只特定 frontmatter）都會在右側顯示較深層標題。

## 資料夾收合設定

位置：`docs/.vitepress/config.ts`

- 變數：`expandedTopLevelDirs`
- 預設：根層資料夾全部收合

若要讓特定資料夾預設展開，可改成：

```ts
const expandedTopLevelDirs = new Set<string>(['Copilot'])
```

## 安裝與執行

### 環境需求

- Node.js 18+
- npm

### 安裝

```bash
npm ci
```

### 本機開發

```bash
npm run docs:dev
```

啟動後可在終端機顯示的本機網址瀏覽。

### Build

```bash
npm run docs:build
```

輸出目錄為：`docs/.vitepress/dist`

### Build 後預覽

```bash
npm run docs:preview
```

## 如何使用

1. 在 `docs/` 新增或編輯 `.md` 筆記。
2. 若要分門別類，直接建立子資料夾並放入 `.md`。
3. 重新啟動或重新整理開發站後，sidebar 會依規則自動更新。
4. `docs/index.md` 作為首頁，不會出現在 sidebar。

## 自動部署

- Workflow：`.github/workflows/deploy-docs.yml`
- 觸發條件：push 到 `main`
- 流程：`npm ci` -> 計算 `VITEPRESS_BASE` -> `npm run docs:build` -> 部署 `docs/.vitepress/dist` 到 GitHub Pages
- `base` 行為：
  - GitHub Actions 會先設定 `VITEPRESS_BASE`：
    - 專案頁面（例如 `owner/ai-tool-note`）為 `/<repo>/`
    - 使用者/組織頁面 repo（`*.github.io`）為 `/`
  - 本機環境未設定 `VITEPRESS_BASE` 時，使用 `/`。

## GitHub Pages 靜態資源 404 問題與解法

### 問題現象

- 網站 HTML 可開啟，但 CSS/JS 載入失敗。
- 瀏覽器 Network 顯示 `*.css`、`*.js` 回傳 404。
- 常見請求路徑錯誤：
  - 實際應為：`https://<owner>.github.io/<repo>/assets/...`
  - 卻請求成：`https://<owner>.github.io/assets/...`

### 主要原因

1. `base` 設定與 GitHub Pages 部署路徑不一致（最常見）。
2. Workflow 觸發分支與實際開發分支不同，導致最新版本沒有被部署。
3. GitHub Pages 設定未使用 `GitHub Actions` 作為部署來源。

### 解法

1. 確認 `docs/.vitepress/config.ts` 支援 `VITEPRESS_BASE` 覆寫並具備自動判斷（本專案已實作）：

```ts
function resolveBasePath(): string {
  const override = process.env.VITEPRESS_BASE
  if (override) return normalizeBasePath(override)

  const isGithubRuntime =
    process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true'
  if (!isGithubRuntime) return '/'

  const repository = process.env.GITHUB_REPOSITORY ?? ''
  const repositoryName = repository.split('/')[1] ?? ''
  if (!repositoryName || repositoryName.endsWith('.github.io')) return '/'

  return `/${repositoryName}/`
}
```

2. 確認 `.github/workflows/deploy-docs.yml` 在 build 前有設定 `VITEPRESS_BASE`。
3. 確認 workflow 的 `on.push.branches` 與你實際推送分支一致（目前設定為 `main`）。
4. 到 GitHub Repository 的 `Settings > Pages`，確認 `Source` 為 `GitHub Actions`。
5. 推送後確認 Actions 成功執行並重新部署，再強制重新整理瀏覽器（`Ctrl+F5`）清除快取影響。

### 快速檢查清單

- 專案頁面 repo（例如 `owner/ai-tool-note`）：
  - `base` 應為 `/<repo>/`
- 使用者/組織頁面 repo（`*.github.io`）：
  - `base` 應為 `/`
- Workflow 是否真的有在最新 commit 觸發並成功 deploy
- Pages 的部署來源是否為 `GitHub Actions`

## License

本專案採用 [MIT License](LICENSE)。

