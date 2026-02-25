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
