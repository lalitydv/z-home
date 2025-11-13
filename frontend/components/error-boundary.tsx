"use client";

import { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zh-soft px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-zh-gray-light p-8 text-center">
            <AlertCircle className="w-16 h-16 text-zh-danger mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-zh-navy mb-2">Something went wrong</h2>
            <p className="text-zh-gray-dark mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-2 bg-zh-pink text-zh-navy font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-2 border border-zh-gray-light text-zh-navy font-semibold rounded-lg hover:bg-zh-soft transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

