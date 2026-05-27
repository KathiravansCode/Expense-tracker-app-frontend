import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { config } from '../config'
import { useLocalStorageState } from '../hooks/useLocalStorage'
import { apiRequest, unwrapApiResponse } from '../api/http'

const AppContext = createContext(null)

function todayMonthYear() {
  const now = new Date()
  return { month: now.getMonth() + 1, year: now.getFullYear() }
}

export function AppProvider({ token, children }) {
  const [ui, setUi] = useLocalStorageState(config.storage.uiKey, {
    ...todayMonthYear(),
    transactionType: '',
    pageSize: 10,
  })

  const [alertsMeta, setAlertsMeta] = useState({ hasUnread: false })

  const setMonthYear = useCallback(
    ({ month, year }) => setUi((prev) => ({ ...prev, month, year })),
    [setUi],
  )

  const setTransactionType = useCallback(
    (transactionType) => setUi((prev) => ({ ...prev, transactionType })),
    [setUi],
  )

  const setPageSize = useCallback((pageSize) => setUi((prev) => ({ ...prev, pageSize })), [setUi])

  const getCategories = useCallback(async () => {
    const payload = await apiRequest('/api/categories', { token })
    return unwrapApiResponse(payload)
  }, [token])

  const refreshAlertsMeta = useCallback(async () => {
    if (!token) {
      setAlertsMeta({ hasUnread: false })
      return { hasUnread: false }
    }

    const payload = await apiRequest('/api/alerts', {
      token,
      query: { page: 0, size: 20, sort: 'createdAt,desc' },
    })

    let page = payload
    try {
      page = unwrapApiResponse(payload)
    } catch {
      // ignore, endpoint might return raw Page without wrapper
    }

    const items = page?.content || []
    const hasUnread = items.some((a) => !a?.isRead)
    const next = { hasUnread }
    setAlertsMeta(next)
    return next
  }, [token])

  useEffect(() => {
    refreshAlertsMeta().catch(() => {
      // ignore sidebar badge failures
    })
  }, [refreshAlertsMeta])

  const value = useMemo(
    () => ({
      ui,
      setMonthYear,
      setTransactionType,
      setPageSize,
      getCategories,
      alertsMeta,
      refreshAlertsMeta,
    }),
    [ui, setMonthYear, setTransactionType, setPageSize, getCategories, alertsMeta, refreshAlertsMeta],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
