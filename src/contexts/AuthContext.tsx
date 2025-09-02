"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { AuthState, AuthContextType, LoginCredentials, SignupCredentials, User } from "../types/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOGOUT" }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      }
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@terraprice.com",
    name: "Admin User",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    email: "user@terraprice.com",
    name: "Regular User",
    role: "user",
    createdAt: "2024-01-02T00:00:00Z",
    isActive: true,
  },
]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Check for stored auth token on app load
    const token = localStorage.getItem("terraprice_token")
    const userData = localStorage.getItem("terraprice_user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        dispatch({ type: "SET_USER", payload: user })
      } catch (error) {
        localStorage.removeItem("terraprice_token")
        localStorage.removeItem("terraprice_user")
        dispatch({ type: "SET_LOADING", payload: false })
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === credentials.email)

    if (user && credentials.password === "password123") {
      const token = `mock_token_${user.id}`
      localStorage.setItem("terraprice_token", token)
      localStorage.setItem("terraprice_user", JSON.stringify(user))
      dispatch({ type: "SET_USER", payload: user })
    } else {
      dispatch({ type: "SET_LOADING", payload: false })
      throw new Error("Invalid credentials")
    }
  }

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    dispatch({ type: "SET_LOADING", payload: true })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (credentials.password !== credentials.confirmPassword) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw new Error("Passwords do not match")
    }

    const existingUser = mockUsers.find((u) => u.email === credentials.email)
    if (existingUser) {
      dispatch({ type: "SET_LOADING", payload: false })
      throw new Error("User already exists")
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      role: "user",
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    mockUsers.push(newUser)
    const token = `mock_token_${newUser.id}`
    localStorage.setItem("terraprice_token", token)
    localStorage.setItem("terraprice_user", JSON.stringify(newUser))
    dispatch({ type: "SET_USER", payload: newUser })
  }

  const logout = (): void => {
    localStorage.removeItem("terraprice_token")
    localStorage.removeItem("terraprice_user")
    dispatch({ type: "LOGOUT" })
  }

  const resetPassword = async (email: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("User not found")
    }

    // In a real app, this would send a reset email
    console.log(`Password reset email sent to ${email}`)
  }

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
