import * as Analytics from 'expo-firebase-analytics'

export const trackEvent = (eventName: string, params?: any) => {
  try {
    Analytics.logEvent(eventName, params)
  } catch {}
}
