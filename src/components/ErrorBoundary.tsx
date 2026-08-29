import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in Farm simulator:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetGame = () => {
    if (window.confirm('Deseja reiniciar a fazenda para o estado inicial para corrigir qualquer dado corrompido?')) {
      localStorage.removeItem('hayday_farm_simulator_save_v1');
      window.location.reload();
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-b from-amber-100 to-amber-200 flex flex-col items-center justify-center p-6 text-amber-950 font-sans select-none">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300 animate-bounce">
              🚜
            </div>

            <h1 className="text-2xl font-black text-amber-950">
              Ops! A Fazenda Teve um Imprevisto
            </h1>

            <p className="text-sm text-amber-800 leading-relaxed">
              Ocorreu um pequeno tropeço no trator da fazenda. Não se preocupe, seus dados estão protegidos!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 bg-gradient-to-b from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black py-3 px-4 rounded-2xl shadow-lg border-2 border-green-300 transition-transform active:scale-95 cursor-pointer text-sm"
              >
                🔄 Recarregar Fazenda
              </button>

              <button
                onClick={this.handleResetGame}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold py-3 px-4 rounded-2xl border-2 border-amber-300 transition-transform active:scale-95 cursor-pointer text-sm"
                title="Limpar dados do navegador e recomeçar"
              >
                🧹 Limpar Cache
              </button>
            </div>

            {this.state.error && (
              <details className="w-full text-left mt-3 bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs text-amber-900">
                <summary className="cursor-pointer font-bold text-amber-800 select-none">
                  Detalhes do Erro Técnico
                </summary>
                <pre className="mt-2 p-2 bg-black/80 text-green-300 rounded overflow-x-auto font-mono text-[11px] whitespace-pre-wrap break-all max-h-40">
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
