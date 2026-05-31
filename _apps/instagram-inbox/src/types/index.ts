export interface Conversation {
  id: string
  /** Handle shown on the row (e.g. "sarah_designs"). */
  username: string
  /** Last message preview text — truncates with ellipsis. */
  lastMessage: string
  /** Free-form timestamp e.g. "2h", "1d", "3w", "Just now". */
  timestamp: string
  /** Bold username + blue dot when true. */
  unread: boolean
  /** Green active-now dot at the bottom-right of the avatar. */
  activeNow: boolean
  /** Render the blue verified checkmark next to the username. */
  verified: boolean
  /** base64 data URL from FileReader, or null = default silhouette. */
  profileImageDataUrl: string | null
}

/** The logged-in user — owns the header username. */
export interface UserConfig {
  /** Shown in the header next to the dropdown chevron. */
  username: string
  /** Render the blue verified checkmark next to your username in the header. */
  verified: boolean
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
}

export interface InboxState {
  conversations: Conversation[]
  /** N rendered in "Requests (N)" link. 0 hides the link. */
  requestsCount: number
  user: UserConfig
  statusBar: StatusBarConfig
  toggles: PreviewToggles
}

export type AspectRatio = '1:1' | '4:5' | '9:16'

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
