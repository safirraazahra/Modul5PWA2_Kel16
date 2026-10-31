import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            background: '#f2f4f5',
            color: '#18222c',
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '12px' }}>Something went wrong</h2>
          <p
            style={{
              color: '#5a6673',
              maxWidth: '480px',
              marginBottom: '24px',
              fontSize: '15px',
              lineHeight: '1.5',
            }}
          >
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#18222c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Reload Application
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

