* **`GITHUB_TOKEN`** 是 **GitHub 自動提供的內建 token**，每個 repo 的 GitHub Actions workflow 都可以直接使用。
* 你只要在 workflow 裡用它，就能做很多操作，例如：發佈 package、push code、開 issue。
* 它的好處是：

  * **不用自己產生 PAT**（Personal Access Token）
  * **自動過期、安全**
  * 會自動依 workflow 作用範圍給權限

✅ 小結：只要在 Actions workflow 裡用 `${{ secrets.GITHUB_TOKEN }}` 就行，不用手動建立。
