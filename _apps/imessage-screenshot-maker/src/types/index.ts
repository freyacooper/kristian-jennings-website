export type MessageSender = 'sender' | 'receiver'

/** Bubble color — iMessage (blue) or SMS (green). Receivers always use grey. */
export type BubbleColor = 'blue' | 'green'

export interface Message {
  id: string
  text: string
  sender: MessageSender
  /** Only applies when sender === 'sender'. Defaults to 'blue'. */
  color?: BubbleColor
  /** Optional time label shown ABOVE this message as a group divider (e.g. "Today 2:34 PM"). */
  timestampLabel?: string
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

export interface NavBarConfig {
  contactName: string
  /** 0 hides the badge */
  unreadBadgeCount: number
}

export interface ProfileConfig {
  enabled: boolean
  /** base64 data URL from FileReader, or null = default silhouette */
  imageDataUrl: string | null
}

export interface PreviewToggles {
  darkMode: boolean
  showMessageInput: boolean
  showKeyboard: boolean
  showDynamicIsland: boolean
  showTypingIndicator: boolean
}

export interface ConversationState {
  messages: Message[]
  statusBar: StatusBarConfig
  navBar: NavBarConfig
  profile: ProfileConfig
  toggles: PreviewToggles
  /** Delivery status shown under last sender message — "Delivered", "Read 2:35 PM", "Sent", or "" to hide */
  deliveryStatus: string
}

export type AspectRatio = '1:1' | '4:5' | '9:16'

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
