import axios from 'axios'

// ---------------------------------------------------------------------------
// Base URL & Supabase Key Configuration
// Read from environment variables (.env)
// ---------------------------------------------------------------------------
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://modlima.fuadfakhruz.id'
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''

const IS_SUPABASE =
  BASE_URL.includes('supabase.co') || Boolean(SUPABASE_KEY)

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    '[api] VITE_API_BASE_URL is not set. Defaulting to university API server: ' + BASE_URL,
  )
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// ---------------------------------------------------------------------------
// Request interceptor — attach Supabase headers (apikey & Bearer auth)
// ---------------------------------------------------------------------------
apiClient.interceptors.request.use(
  (config) => {
    if (IS_SUPABASE && SUPABASE_KEY) {
      config.headers['apikey'] = SUPABASE_KEY
      if (!config.headers['Authorization']) {
        config.headers['Authorization'] = `Bearer ${SUPABASE_KEY}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ---------------------------------------------------------------------------
// Response interceptor — unwrap response and normalise errors
// Ensures that `message` is ALWAYS a string, preventing React #31 child crash.
// ---------------------------------------------------------------------------
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An unexpected error occurred'
    let status = null

    if (error.response) {
      status = error.response.status
      const data = error.response.data

      if (typeof data === 'string') {
        message = data
      } else if (data && typeof data === 'object') {
        if (typeof data.message === 'string') {
          message = data.message
        } else if (typeof data.msg === 'string') {
          message = data.msg
        } else if (typeof data.error === 'string') {
          message = data.error
        } else if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
          // Vercel 404 sends { error: { code, message } }
          message = data.error.message
        } else if (typeof data.error_description === 'string') {
          message = data.error_description
        } else {
          message = `Server error (${status})`
        }
      } else {
        message = `Server error (${status})`
      }
    } else if (error.request) {
      message =
        'Unable to reach the server. Check your connection and try again.'
    } else {
      message = error.message || message
    }

    if (typeof message !== 'string') {
      message = String(message)
    }

    return Promise.reject({
      message,
      status,
      code: error.response?.data?.code || error.response?.data?.error?.code,
      raw: error.response?.data,
    })
  },
)

export { apiClient, BASE_URL, SUPABASE_KEY, IS_SUPABASE }
