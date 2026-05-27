export const config = {
  // If empty/undefined, requests go to same-origin (works with Vite proxy in dev).
  // Set VITE_API_BASE_URL to your backend origin for production deployments.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  storage: {
    tokenKey: 'expense_tracker_token',
    userKey: 'expense_tracker_user',
    uiKey: 'expense_tracker_ui',
  },
}
