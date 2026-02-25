## 1️⃣ Artifacts（最常用）

**用途**：儲存 build 結果、log、壓縮檔、產出檔案
**保存時間**：預設 90 天（可自訂 1–90 天）

使用官方 action：

* `actions/upload-artifact`
* `actions/download-artifact`

範例：

```yaml
- name: Upload build result
  uses: actions/upload-artifact@v4
  with:
    name: build-output
    path: dist/
    retention-days: 7
```

📌 特點：

* 儲存在 GitHub 雲端
* 只能被該 workflow run 存取
* 不適合當資料庫

---

## 2️⃣ Cache（給 dependency 用）

**用途**：快取 npm、pip、NuGet 等依賴
**保存時間**：7 天沒被用就可能被清掉

用：

```yaml
uses: actions/cache@v4
```

📌 特點：

* 只能當快取
* GitHub 會自動清理
* 不適合長期儲存資料

---

## 3️⃣ GitHub Repository 本身（最穩）

如果你要「長期保存資料」，最穩的是：

👉 直接 commit 回 repo

例如：

* 追蹤 stars 數量
* 儲存 JSON 狀態檔
* 存歷史紀錄

Workflow 裡：

```bash
git config user.name "github-actions"
git config user.email "github-actions@github.com"
git add data.json
git commit -m "update data"
git push
```

⚠️ 需要開 permissions：

```yaml
permissions:
  contents: write
```

這是做「持久資料儲存」最常見方式。

---

## 4️⃣ Environment Variables / Secrets

* `secrets` → 存 Token
* `variables` → 存固定設定值

但：
❌ 不能在 workflow 裡動態寫回
❌ 不是儲存資料用

---

## 5️⃣ GitHub Pages（特殊用途）

如果你有開：

👉 `gh-pages` branch
👉 或 `docs/`

其實也可以當靜態資料儲存區。
