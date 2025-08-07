import { Component, ErrorInfo, ReactNode } from 'react';
import './PracticeErrorBoundary.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Practice Error Boundary Component
 * 
 * Catches JavaScript errors in practice mode components and provides
 * graceful fallback UI instead of crashing the entire application.
 * 
 * Features:
 * - Catches render errors and component lifecycle errors
 * - Provides user-friendly error message
 * - Optional custom fallback UI
 * - Error reporting callback for logging
 * - Recovery option to retry
 */
export class PracticeErrorBoundary extends Component<Props, State> {
  private retryTimeoutId?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for monitoring/debugging
    console.error('Practice mode error caught by boundary:', error, errorInfo);
    
    // Report error to parent component if callback provided
    this.props.onError?.(error, errorInfo);

    // In development, provide additional debugging info
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Practice Error Boundary Debug Info');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error Boundary Props:', this.props);
      console.groupEnd();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleRetry = () => {
    // Clear error state to retry rendering
    this.setState({ hasError: false, error: undefined });
    
    // Add small delay to prevent immediate re-error in some cases
    this.retryTimeoutId = setTimeout(() => {
      // Force a re-render after state update
      this.forceUpdate();
    }, 100);
  };

  handleRefresh = () => {
    // Reload the page as last resort
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="practice-error-boundary">
          <div className="practice-error-boundary__content">
            <div className="practice-error-boundary__icon">⚠️</div>
            <h2 className="practice-error-boundary__title">
              Practice Mode Error
            </h2>
            <p className="practice-error-boundary__message">
              Something went wrong with this practice mode. This might be a temporary issue.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="practice-error-boundary__details">
                <summary>Error Details (Development)</summary>
                <pre className="practice-error-boundary__error">
                  {this.state.error.message}
                  {this.state.error.stack && `\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
            
            <div className="practice-error-boundary__actions">
              <button
                type="button"
                onClick={this.handleRetry}
                className="practice-error-boundary__button practice-error-boundary__button--primary"
                aria-label="Try to reload this practice mode"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={this.handleRefresh}
                className="practice-error-boundary__button practice-error-boundary__button--secondary"
                aria-label="Refresh the entire page"
              >
                Refresh Page
              </button>
            </div>
            
            <div className="practice-error-boundary__help">
              <p className="practice-error-boundary__help-text">
                <strong>Troubleshooting tips:</strong>
              </p>
              <ul className="practice-error-boundary__help-list">
                <li>Check your internet connection</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try using a different browser</li>
                <li>Disable browser extensions temporarily</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Set display name for debugging
PracticeErrorBoundary.displayName = 'PracticeErrorBoundary';

export default PracticeErrorBoundary;