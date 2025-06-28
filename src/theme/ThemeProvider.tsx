import React, { createContext, useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {}
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')

  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#FCD116', // Amarillo de la bandera colombiana
            light: '#FFE566',
            dark: '#C4A100',
            contrastText: '#000000'
          },
          secondary: {
            main: '#003893', // Azul de la bandera colombiana
            light: '#3361C3',
            dark: '#002165',
            contrastText: '#ffffff'
          },
          error: {
            main: '#CE1126', // Rojo de la bandera colombiana
            light: '#FF4C5B',
            dark: '#960C1C',
            contrastText: '#ffffff'
          },
          background: {
            default: mode === 'light' ? '#F5F5F5' : '#121212',
            paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E'
          }
        },
        typography: {
          fontFamily: '"Roboto", "Arial", sans-serif',
          h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: mode === 'light' ? '#003893' : '#FCD116'
          },
          h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: mode === 'light' ? '#003893' : '#FCD116'
          },
          h3: {
            fontSize: '1.75rem',
            fontWeight: 500
          },
          h4: {
            fontSize: '1.5rem',
            fontWeight: 500
          },
          h5: {
            fontSize: '1.25rem',
            fontWeight: 500
          },
          h6: {
            fontSize: '1rem',
            fontWeight: 500
          }
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 500
              }
            }
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: mode === 'light' 
                  ? '0 2px 4px rgba(0,0,0,0.1)' 
                  : '0 2px 4px rgba(0,0,0,0.3)'
              }
            }
          }
        }
      }),
    [mode]
  )

  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme
    }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}