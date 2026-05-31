import { useCallback, useState } from 'react'
import type { Conversation, InboxState } from '../types'
import kristianAvatar from '../Assets/kristian.png'

const newId = () => Math.random().toString(36).slice(2, 10)

const defaultState: InboxState = {
  conversations: [
    {
      id: newId(),
      name: 'Elon',
      lastMessage: 'I subscribe to the sauce \u{1F35D} ',
      timestamp: '8:59 AM',
      unread: false,
      pinned: false,
      profileImageDataUrl: null,
    },
    {
      id: newId(),
      name: 'Jake',
      lastMessage: "Dude, you need to subscribe to Kristian's newsletter. Such value in there!",
      timestamp: '3:49 AM',
      unread: true,
      pinned: false,
      profileImageDataUrl: null,
    },
    {
      id: newId(),
      name: 'My Crush \u{1F60D}',
      lastMessage: "Sorry, I only date guys that are subscribed to Kristian's newsletter. It's so good! \u{1F445} ",
      timestamp: 'Yesterday',
      unread: false,
      pinned: false,
      profileImageDataUrl: null,
    },
    {
      id: newId(),
      name: 'Kristian',
      lastMessage: 'Subscribe to me on Youtube: @kristian_jennings \u{1F525}',
      timestamp: 'Yesterday',
      unread: true,
      pinned: false,
      profileImageDataUrl: kristianAvatar,
    },
    {
      id: newId(),
      name: 'My Bank',
      lastMessage: 'Your account needs more money (You better subscribe to the Sauce \u{1F35D} )',
      timestamp: 'Sunday',
      unread: false,
      pinned: false,
      profileImageDataUrl: null,
    },
    {
      id: newId(),
      name: 'Bezos',
      lastMessage: 'Kristian taught me everything I know',
      timestamp: '02/04/026',
      unread: false,
      pinned: false,
      profileImageDataUrl: null,
    },
  ],
  statusBar: {
    time: '9:41',
    signalBars: 4,
    wifiOn: true,
    batteryPercent: 92,
    showBatteryPercent: false,
  },
  toggles: {
    darkMode: false,
    showDynamicIsland: true,
    showSearchBar: true,
  },
}

export function useInbox() {
  const [state, setState] = useState<InboxState>(defaultState)

  const addConversation = useCallback(() => {
    setState(s => ({
      ...s,
      conversations: [
        ...s.conversations,
        {
          id: newId(),
          name: 'New Contact',
          lastMessage: 'New message preview',
          timestamp: 'Now',
          unread: false,
          pinned: false,
          profileImageDataUrl: null,
        },
      ],
    }))
  }, [])

  const updateConversation = useCallback((id: string, patch: Partial<Conversation>) => {
    setState(s => ({
      ...s,
      conversations: s.conversations.map(c => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setState(s => ({ ...s, conversations: s.conversations.filter(c => c.id !== id) }))
  }, [])

  const moveConversation = useCallback((id: string, direction: 'up' | 'down') => {
    setState(s => {
      const idx = s.conversations.findIndex(c => c.id === id)
      if (idx === -1) return s
      const target = direction === 'up' ? idx - 1 : idx + 1
      if (target < 0 || target >= s.conversations.length) return s
      const next = [...s.conversations]
      ;[next[idx], next[target]] = [next[target], next[idx]]
      return { ...s, conversations: next }
    })
  }, [])

  const updateStatusBar = useCallback((patch: Partial<InboxState['statusBar']>) => {
    setState(s => ({ ...s, statusBar: { ...s.statusBar, ...patch } }))
  }, [])

  const updateToggles = useCallback((patch: Partial<InboxState['toggles']>) => {
    setState(s => ({ ...s, toggles: { ...s.toggles, ...patch } }))
  }, [])

  return {
    state,
    addConversation,
    updateConversation,
    deleteConversation,
    moveConversation,
    updateStatusBar,
    updateToggles,
  }
}

export type UseInbox = ReturnType<typeof useInbox>
