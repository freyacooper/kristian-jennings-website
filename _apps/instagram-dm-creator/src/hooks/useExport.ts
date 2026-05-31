import { useState } from 'react'
import { toPng } from 'html-to-image'
import type { AspectRatio } from '../types'
import { ASPECT_RATIOS } from '../types'

export function useExport() {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportPng = async (node: HTMLElement | null, aspect: AspectRatio) => {
    if (!node) return
    setExporting(true)
    setError(null)
    try {
      const dims = ASPECT_RATIOS[aspect]
      const dataUrl = await toPng(node, {
        width: dims.width,
        height: dims.height,
        canvasWidth: dims.width,
        canvasHeight: dims.height,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: 'none' },
      })
      const link = document.createElement('a')
      link.download = 'instagram-dm.png'
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
      setError((err as Error).message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return { exportPng, exporting, error }
}
