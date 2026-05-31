import { useCallback, useState } from 'react'
import type { ConversationState, Message, MessageSender } from '../types'

const newId = () => Math.random().toString(36).slice(2, 10)

const defaultState: ConversationState = {
  messages: [
    {
      id: newId(),
      text: "Hey! Have you subscribed to Kristian's Newsletter?",
      sender: 'receiver',
    },
    {
      id: newId(),
      text: 'I wish I did it sooner! Everyone in Ecom would benefit from it.',
      sender: 'sender',
    },
    {
      id: newId(),
      text: "So much value in there - I can't believe it's free!",
      sender: 'receiver',
    },
    {
      id: newId(),
      text: "Click 'Subscribe' above\u{1F446}",
      sender: 'sender',
    },
  ],
  statusBar: {
    time: '9:41',
    signalBars: 4,
    wifiOn: true,
    batteryPercent: 92,
    showBatteryPercent: false,
  },
  navBar: {
    contactName: 'Contact Name',
    unreadBadgeCount: 3,
  },
  profile: {
    enabled: true,
    imageDataUrl: null,
  },
  toggles: {
    darkMode: false,
    showMessageInput: true,
    showKeyboard: true,
    showDynamicIsland: true,
    showTypingIndicator: false,
  },
  deliveryStatus: 'Delivered',
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

  const updateNavBar = useCallback((patch: Partial<ConversationState['navBar']>) => {
    setState(s => ({ ...s, navBar: { ...s.navBar, ...patch } }))
  }, [])

  const updateProfile = useCallback((patch: Partial<ConversationState['profile']>) => {
    setState(s => ({ ...s, profile: { ...s.profile, ...patch } }))
  }, [])

  const updateToggles = useCallback((patch: Partial<ConversationState['toggles']>) => {
    setState(s => ({ ...s, toggles: { ...s.toggles, ...patch } }))
  }, [])

  const setDeliveryStatus = useCallback((status: string) => {
    setState(s => ({ ...s, deliveryStatus: status }))
  }, [])

  return {
    state,
    addMessage,
    updateMessage,
    deleteMessage,
    moveMessage,
    updateStatusBar,
    updateNavBar,
    updateProfile,
    updateToggles,
    setDeliveryStatus,
  }
}

export type UseConversation = ReturnType<typeof useConversation>
