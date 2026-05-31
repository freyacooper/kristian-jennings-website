import { useCallback, useState } from 'react'
import kristianAvatar from '../assets/kristian.png'
import type {
  ConversationState,
  DeliveryStatus,
  Message,
  MessageSender,
  ProfileIntroConfig,
  SenderBubbleStyle,
} from '../types'

const newId = () => Math.random().toString(36).slice(2, 10)

const defaultState: ConversationState = {
  messages: [
    {
      id: newId(),
      text: 'Hey Kristian, I subscribed to your Newsletter.',
      sender: 'sender',
    },
    {
      id: newId(),
      text: "Hey man \u{1F64C} That's Awesome. What did you think?",
      sender: 'receiver',
    },
    {
      id: newId(),
      text: "So full of sauce! I wish I had subbed ages ago. I can't believe it's free",
      sender: 'sender',
    },
    {
      id: newId(),
      text: 'Looking forward to the next ones',
      sender: 'sender',
    },
    {
      id: newId(),
      text: '\u{1F4AA}',
      sender: 'receiver',
    },
  ],
  statusBar: {
    time: '9:41',
    signalBars: 4,
    wifiOn: true,
    batteryPercent: 92,
    showBatteryPercent: false,
  },
  header: {
    username: 'kristian_jennin',
    displayName: 'Kristian Jennings',
    secondLineMode: 'active',
    activeStatus: 'Active now',
    showActiveDot: true,
    verified: true,
  },
  profile: {
    imageDataUrl: kristianAvatar,
  },
  toggles: {
    darkMode: false,
    showMessageInput: true,
    showKeyboard: false,
    showDynamicIsland: true,
    lockMessagesToTop: false,
  },
  deliveryStatus: 'Seen',
  defaultSenderStyle: { kind: 'gradient' },
  profileIntro: {
    enabled: true,
    followersCount: '1M',
    postsCount: '250',
    relationshipText: "You've followed this Instagram account since 2026",
    mutualFollowsText: '',
    showBusinessChatLink: true,
  },
}

export function useConversation() {
  const [state, setState] = useState<ConversationState>(defaultState)

  const addMessage = useCallback((sender: MessageSender = 'sender') => {
    setState(s => ({
      ...s,
      messages: [...s.messages, { id: newId(), text: '', sender }],
    }))
  }, [])

  const updateMessage = useCallback((id: string, patch: Partial<Message>) => {
    setState(s => ({
      ...s,
      messages: s.messages.map(m => (m.id === id ? { ...m, ...patch } : m)),
    }))
  }, [])

  const deleteMessage = useCallback((id: string) => {
    setState(s => ({ ...s, messages: s.messages.filter(m => m.id !== id) }))
  }, [])

  const moveMessage = useCallback((id: string, direction: 'up' | 'down') => {
    setState(s => {
      const idx = s.messages.findIndex(m => m.id === id)
      if (idx === -1) return s
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= s.messages.length) return s
      const next = [...s.messages]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return { ...s, messages: next }
    })
  }, [])

  const updateStatusBar = useCallback((patch: Partial<ConversationState['statusBar']>) => {
    setState(s => ({ ...s, statusBar: { ...s.statusBar, ...patch } }))
  }, [])

  const updateHeader = useCallback((patch: Partial<ConversationState['header']>) => {
    setState(s => ({ ...s, header: { ...s.header, ...patch } }))
  }, [])

  const updateProfile = useCallback((patch: Partial<ConversationState['profile']>) => {
    setState(s => ({ ...s, profile: { ...s.profile, ...patch } }))
  }, [])

  const updateToggles = useCallback((patch: Partial<ConversationState['toggles']>) => {
    setState(s => ({ ...s, toggles: { ...s.toggles, ...patch } }))
  }, [])

  const setDeliveryStatus = useCallback((status: DeliveryStatus) => {
    setState(s => ({ ...s, deliveryStatus: status }))
  }, [])

  const setDefaultSenderStyle = useCallback((style: SenderBubbleStyle) => {
    setState(s => ({ ...s, defaultSenderStyle: style }))
  }, [])

  const updateProfileIntro = useCallback((patch: Partial<ProfileIntroConfig>) => {
    setState(s => ({ ...s, profileIntro: { ...s.profileIntro, ...patch } }))
  }, [])

  return {
    state,
    addMessage,
    updateMessage,
    deleteMessage,
    moveMessage,
    updateStatusBar,
    updateHeader,
    updateProfile,
    updateToggles,
    setDeliveryStatus,
    setDefaultSenderStyle,
    updateProfileIntro,
  }
}

export type UseConversation = ReturnType<typeof useConversation>
