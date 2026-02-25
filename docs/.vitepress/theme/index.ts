import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import mediumZoom, { type Zoom } from 'medium-zoom'
import { nextTick, onMounted, watch } from 'vue'
import './style.css'

const zoomSelector = '.vp-doc img:not(a img):not(.no-zoom)'

let zoom: Zoom | null = null

function refreshZoom(): void {
  zoom?.detach()
  zoom = mediumZoom(zoomSelector, {
    background: 'var(--vp-c-bg)'
  })
}

const theme: Theme = {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const rebind = () => {
      nextTick(() => refreshZoom())
    }

    onMounted(rebind)
    watch(() => route.path, rebind)
  }
}

export default theme
