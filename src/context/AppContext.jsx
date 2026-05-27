import { createContext, useCallback, useContext, useMemo } from 'react'
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

  const value = useMemo(
    () => ({
      ui,
      setMonthYear,
      setTransactionType,
      setPageSize,
      getCategories,
    }),
    [ui, setMonthYear, setTransactionType, setPageSize, getCategories],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

