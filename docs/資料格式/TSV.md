TSV 是一種 **純文字表格格式**，全名是 **Tab-Separated Values**（制表符分隔值）。簡單來說，就是用 **Tab 鍵（`\t`）** 來分隔欄位的資料。

它和 CSV（Comma-Separated Values，用逗號分隔）很像，但 **TSV 用 Tab 分欄**，所以比較不容易和資料本身的逗號搞混。

---

# 📌 範例

假設有一個簡單的表格：

| 名字    | 年齡 | 國家     |
| ----- | -- | ------ |
| Alice | 25 | Taiwan |
| Bob   | 30 | Japan  |

* **CSV（逗號分隔）**：

```
名字,年齡,國家
Alice,25,Taiwan
Bob,30,Japan
```

* **TSV（Tab 分隔）**：

```
名字	年齡	國家
Alice	25	Taiwan
Bob	30	Japan
```

注意：每個欄位中間是 **Tab 字元**（`\t`），不是空格。

---

# 📌 使用場合

* 常用於資料交換、匯入匯出
* Excel、Google Sheets、程式讀取都可以用
* 如果資料裡面有逗號，但沒有 Tab，TSV 比 CSV 更安全
