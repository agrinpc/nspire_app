import { DefaultTheme } from 'react-native-paper'
import {
  DefaultTheme as DefaultNavTheme,
  Theme as NavTheme
} from '@react-navigation/native'

// Theming for react-native-paper
// Add custom props here
declare global {
  namespace ReactNativePaper {
    interface ThemeFonts {}
    interface ThemeColors {
      surfaceSecondary: string
      oppositeText: string
    }
    interface ThemeAnimation {}
    interface Theme {
      elevation: number
      constants: {
        fontSize: {
          size100: number
          size200: number
          size300: number
          size400: number
          size500: number
          size600: number
          size700: number
          size800: number
          size900: number
          size1000: number
        }
        height: {
          button: {
            small: number
            medium: number
            large: number
          }
          header: {
            size400: number
            size500: number
            size600: number
            size800: number
            size1000: number
          }
          input: {
            size400: number
            size500: number
            size600: number
          }
        }
        width: {
          screenContainer: string
        }
        padding: {
          top: number
          bottom: number
          horizontal: number
        }
      }
    }
  }
}

// Theming for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends ReactNativePaper.Theme {}
}

export const paperTheme: ReactNativePaper.Theme = {
  ...DefaultTheme,
  roundness: 12,
  elevation: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#eb674c',
    surface: '#f7f7f7',
    surfaceSecondary: '#aaaaaa',
    oppositeText: '#ffffff',
    background: '#ffffff'
  },
  constants: {
    fontSize: {
      size100: 12,
      size200: 14,
      size300: 16,
      size400: 18,
      size500: 20,
      size600: 22,
      size700: 24,
      size800: 26,
      size900: 28,
      size1000: 30
    },
    height: {
      button: {
        small: 30,
        medium: 40,
        large: 60
      },
      header: {
        size400: 40,
        size500: 50,
        size600: 60,
        size800: 80,
        size1000: 100
      },
      input: {
        size400: 40,
        size500: 50,
        size600: 60
      }
    },
    width: {
      screenContainer: '90%'
    },
    padding: {
      top: 25,
      bottom: 6,
      horizontal: 16
    }
  }
}

export const styledTheme: ReactNativePaper.Theme = {
  ...paperTheme
}

export const navTheme: NavTheme = {
  ...DefaultNavTheme,
  colors: {
    ...DefaultNavTheme.colors,
    background: 'white'
  }
}
