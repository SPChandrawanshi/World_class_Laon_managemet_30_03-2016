import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isChunkLoadError = this.state.error?.message?.includes('Failed to fetch dynamically imported module');
      
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0d1117] text-white p-6">
          <div className="bg-[#161b22] border border-red-500/30 p-8 rounded-3xl max-w-2xl w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
            
            <h2 className="text-red-500 text-xl font-bold mb-4 uppercase tracking-widest">
              {isChunkLoadError ? 'Connection Lost' : 'Unexpected Error'}
            </h2>
            
            <p className="text-slate-400 text-sm mb-6 font-bold uppercase tracking-wider leading-relaxed">
              {isChunkLoadError
                ? "The development server restarted or the application updated. Please refresh the page to continue."
                : "The React component tree crashed. See diagnostic below:"}
            </p>

            {!isChunkLoadError && this.state.error && (
              <div className="mb-8 p-6 bg-[#0d1117] border border-red-900/30 rounded-2xl text-left overflow-x-auto max-h-[300px]">
                <p className="text-rose-400 font-mono text-xs font-bold mb-2 uppercase tracking-tight">Error Detail:</p>
                <code className="text-[10px] text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.error.stack?.split("\n").slice(0, 5).join("\n")}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-4 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold uppercase tracking-widest text-sm w-full transition-all active:scale-95 shadow-lg shadow-red-500/20 border-none cursor-pointer"
              >
                Refresh Matrix
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-4 bg-[#21262d] hover:bg-[#30363d] rounded-xl text-slate-400 font-bold uppercase tracking-widest text-[9px] w-full transition-all active:scale-95 border-none cursor-pointer"
              >
                Attempt Recovery
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
