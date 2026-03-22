import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value
        localStorage.setItem(key, JSON.stringify(valueToStore))
        return valueToStore
      })
    } catch (err) {
      console.error('useLocalStorage error:', err)
    }
  }, [key])

  return [storedValue, setValue]
}
