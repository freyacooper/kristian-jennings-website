import { useEffect, useRef, useState } from 'react'
import { ControlsPanel } from './components/ControlsPanel'
import { ExportControls } from './components/ExportControls'
import { PhonePreview } from './components/PhonePreview'
import { useConversation } from './hooks/useConversation'
import { useExport } from './hooks/useExport'
import type { AspectRatio } from './types'
import { ASPECT_RATIOS } from './types'

function App() {
  const conv = useConversation()
  const exporter = useExport()
  const previewRef = useRef<HTMLDivElement>(null)
  const previewStageRef = useRef<HTMLDivElement>(null)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16')
  const [previewScale, setPreviewScale] = useState(0.32)

  const dims = ASPECT_RATIOS[aspectRatio]

  // Auto-scale the preview to fit the available stage space.
  useEffect(() => {
    const compute = () => {
      const stage = previewStageRef.current
      if (!stage) return
      const padding = 32
      const availW = stage.clientWidth - padding
      const availH = stage.clientHeight - padding
      if (availW <= 0 || availH <= 0) return
      const scale = Math.min(availW / dims.width, availH / dims.height, 0.5)
      setPreviewScale(Math.max(0.1, scale))
    }
    compute()
    const ro = new ResizeObserver(compute)
    if (previewStageRef.current) ro.observe(previewStageRef.current)
    window.addEventListener('resize', compute)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [dims.width, dims.height])

  const handleDownload = () => exporter.exportPng(previewRef.current, aspectRatio)

  return (
    /* On desktop the whole app is locked to the iframe's viewport — no
       outer scroll. The left aside scrolls internally; the right main
       column auto-sizes the phone to fit. On mobile, normal flow. */
    <div className="min-h-screen lg:h-screen lg:overflow-hidden">
      <div className="max-w-[1180px] mx-auto flex flex-col lg:flex-row gap-6 p-5 lg:p-8 lg:h-full">
        {/* Left: controls — single glass card, scrolls internally on
            desktop so the card boundary stays visible as the user scrolls. */}
        <aside className="kj-card lg:w-[440px] lg:flex-shrink-0 lg:h-full lg:overflow-y-auto px-5">
          <ControlsPanel conv={conv} />
        </aside>

        {/* Right: preview + export (fits viewport — never scrolls) */}
        <main className="flex-1 flex flex-col items-center gap-5 lg:h-full lg:overflow-hidden">
          <div
            ref={previewStageRef}
            className="w-full flex items-center justify-center min-h-[600px] lg:min-h-0 lg:flex-1"
          >
            <div
              className="bg-black rounded-[36px] shadow-2xl overflow-hidden ring-1 ring-black/10"
              style={{
                width: dims.width * previewScale,
                height: dims.height * previewScale,
              }}
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  width: dims.width,
                  height: dims.height,
                }}
              >
                <PhonePreview ref={previewRef} state={conv.state} aspectRatio={aspectRatio} />
              </div>
            </div>
          </div>
          <ExportControls
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onDownload={handleDownload}
            exporting={exporter.exporting}
          />
          {exporter.error && <div className="kj-error">{exporter.error}</div>}
        </main>
      </div>
    </div>
  )
}

export default App
