export interface Conversation {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: boolean
  /** When true, this conversation is shown as a large avatar in the pinned area
   * above the regular list (and removed from the regular list). */
  pinned: boolean
  /** base64 data URL from FileReader, or null = default silhouette */
  profileImageDataUrl: string | null
}

export interface StatusBarConfig {
  time: string
  /** 0–4 bars filled */
  signalBars: number
  wifiOn: boolean
  /** 0–100 */
  batteryPercent: number
  showBatteryPercent: boolean
}

export interface PreviewToggles {
  darkMode: boolean
  showDynamicIsland: boolean
  showSearchBar: boolean
}

export interface InboxState {
  conversations: Conversation[]
  statusBar: StatusBarConfig
  toggles: PreviewToggles
}

export type AspectRatio = '1:1' | '4:5' | '9:16'

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
