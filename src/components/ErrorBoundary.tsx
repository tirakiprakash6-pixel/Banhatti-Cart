import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Explicitly declared fields for TypeScript class component
  declare props: Readonly<ErrorBoundaryProps>;
  declare state: Readonly<ErrorBoundaryState>;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
              🛵
            </div>
            <h2 className="text-lg font-bold text-gray-900">Banhatti Cart</h2>
            <p className="text-xs text-gray-500">
              {this.state.error?.message || 'Something went wrong while loading the app.'}
            </p>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem('banhatti_cart_items');
                window.location.reload();
              }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Reload Store
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
