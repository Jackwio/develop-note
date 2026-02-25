# API 範例

這頁用來示範技術筆記中常見的 API 說明格式。

## `GET /notes`

取得筆記清單。

### 回應

```json
{
  "items": [
    {
      "id": "note-1",
      "title": "VitePress Sidebar"
    }
  ]
}
```

## `POST /notes`

建立新筆記。

### 請求 Body

```json
{
  "title": "New Note",
  "content": "..."
}
```
