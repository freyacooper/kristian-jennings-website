import { useCallback, useState } from 'react'
import garyAvatar from '../assets/gary.jpg'
import hormoziAvatar from '../assets/hormozi.jpg'
import kristianAvatar from '../assets/kristian.png'
import metaAvatar from '../assets/meta.jpg'
import shopifyAvatar from '../assets/shopify.jpg'
import tonyAvatar from '../assets/tony.jpg'
import zuckAvatar from '../assets/zuck.jpg'
import type { Conversation, InboxState, UserConfig } from '../types'

const newId = () => Math.random().toString(36).slice(2, 10)

const defaultState: InboxState = {
  conversations: [
    {
      id: newId(),
      username: 'hormozi',
      lastMessage: 'Volume negates luck.',
      timestamp: '2h',
      unread: true,
      activeNow: true,
      verified: true,
      profileImageDataUrl: hormoziAvatar,
    },
    {
      id: newId(),
      username: 'garyvee',
      lastMessage: "This is the next big thing, don't miss out!!",
      timestamp: '1d',
      unread: false,
      activeNow: false,
      verified: true,
      profileImageDataUrl: garyAvatar,
    },
    {
      id: newId(),
      username: 'meta',
      lastMessage: 'might screw over all the advertisers today for no reason 👉 🥺👈',
      timestamp: '2d',
      unread: false,
      activeNow: false,
      verified: false,
      profileImageDataUrl: metaAvatar,
    },
    {
      id: newId(),
      username: 'kristian_jennin',
      lastMessage: 'Subscribe to my youtube: @kristian_jennings 🔥',
      timestamp: '6h',
      unread: false,
      activeNow: false,
      verified: false,
      profileImageDataUrl: kristianAvatar,
    },
    {
      id: newId(),
      username: 'zuck',
      lastMessage: 'I am very human and I love smoked meats 🥩',
      timestamp: '4h',
      unread: true,
      activeNow: true,
      verified: true,
      profileImageDataUrl: zuckAvatar,
    },
    {
      id: newId(),
      username: 'shopify',
      lastMessage: 'Ka-Ching! 🔔',
      timestamp: '30m',
      unread: true,
      activeNow: false,
      verified: false,
      profileImageDataUrl: shopifyAvatar,
    },
    {
      id: newId(),
      username: 'tonyrobbins',
      lastMessage: 'Where focus goes, energy flows 💪',
      timestamp: '1w',
      unread: false,
      activeNow: false,
      verified: true,
      profileImageDataUrl: tonyAvatar,
    },
  ],
  requestsCount: 2,
  user: {
    username: 'your_account1',
    verified: false,
  },
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
          username: 'new_user',
          lastMessage: 'New message preview',
          timestamp: 'Now',
          unread: false,
          activeNow: false,
          verified: false,
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

  const updateUser = useCallback((patch: Partial<UserConfig>) => {
    setState(s => ({ ...s, user: { ...s.user, ...patch } }))
  }, [])

  const setRequestsCount = useCallback((n: number) => {
    setState(s => ({ ...s, requestsCount: Math.max(0, Math.floor(n)) }))
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
    setRequestsCount,
    updateUser,
    updateStatusBar,
    updateToggles,
  }
}

export type UseInbox = ReturnType<typeof useInbox>
