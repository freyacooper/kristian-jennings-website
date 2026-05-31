export type MessageSender = 'sender' | 'receiver'

/**
 * Sender bubble visual style.
 *  - `gradient` — Instagram's default blue→purple gradient
 *  - `solid` — a single user-picked colour
 */
export type SenderBubbleStyle =
  | { kind: 'gradient' }
  | { kind: 'solid'; color: string }

export interface Message {
  id: string
  text: string
  sender: MessageSender
  /** Standalone red heart — overrides text/bubble, just renders a large ❤️. */
  isHeart?: boolean
  /** Small emoji rendered beneath the bubble (e.g. "❤️", "😂"). Empty/undefined = none. */
  reaction?: string
  /** Per-message sender style override. If unset, uses `defaultSenderStyle`. */
  senderStyle?: SenderBubbleStyle
  /** Group divider shown ABOVE this message — e.g. "Today 2:34 PM". */
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

/** What appears on the second line of the DM header (below the name). */
export type DMHeaderSecondLine = 'active' | 'username' | 'none'

export interface DMHeaderConfig {
  username: string
  /** Optional display name shown ABOVE the username when set. */
  displayName: string
  /** Which secondary line to render — active status, the @handle, or nothing. */
  secondLineMode: DMHeaderSecondLine
  /** Text used when `secondLineMode === 'active'`. e.g. "Active now". */
  activeStatus: string
  /** Show the green online dot on the bottom-right of the avatar. */
  showActiveDot: boolean
  /** Show the blue verified checkmark next to the username/display name. */
  verified: boolean
}

export interface ProfileConfig {
  /** base64 data URL from FileReader, or null = default silhouette. Used in the header avatar AND the "Seen" indicator. */
  imageDataUrl: string | null
}

export interface PreviewToggles {
  darkMode: boolean
  showMessageInput: boolean
  showKeyboard: boolean
  showDynamicIsland: boolean
  /**
   * When true, messages render top-down and clip from the bottom when they
   * overflow. When false (default), the list pins to the bottom and the
   * oldest messages clip off the top — matching real Instagram. Useful to
   * enable when showing the intro card so the intro stays visible at top.
   */
  lockMessagesToTop: boolean
}

export type DeliveryStatus = 'Seen' | 'Delivered' | ''

/**
 * "New conversation" intro — the centred profile card Instagram shows above
 * the first message when you've never messaged this account before.
 * Standard / business variants are differentiated by which optional fields
 * are populated (verified badge comes from the existing header config).
 */
export interface ProfileIntroConfig {
  enabled: boolean
  /** Display as-is, e.g. "121K" or "335". */
  followersCount: string
  /** Display as-is, e.g. "315" or "0". */
  postsCount: string
  /** First line under stats — e.g. "You've followed this Instagram account since 2026". Empty hides. */
  relationshipText: string
  /** Second line — "You both follow X". Empty hides. */
  mutualFollowsText: string
  /** Show the blue "Learn about business chats" link (verified business accounts only). */
  showBusinessChatLink: boolean
}

export interface ConversationState {
  messages: Message[]
  statusBar: StatusBarConfig
  header: DMHeaderConfig
  profile: ProfileConfig
  toggles: PreviewToggles
  deliveryStatus: DeliveryStatus
  /** Global default style applied to any sender message that doesn't override it. */
  defaultSenderStyle: SenderBubbleStyle
  /** "Start of conversation" profile card above the first message. */
  profileIntro: ProfileIntroConfig
}

export type AspectRatio = '1:1' | '4:5' | '9:16'

export const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
