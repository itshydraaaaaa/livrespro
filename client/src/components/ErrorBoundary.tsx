import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === "development";

      return (
        <div className="flex min-h-screen items-center justify-center bg-[#F6F1E7] p-6 text-[#141E33] antialiased">
          <div className="w-full max-w-lg rounded-3xl border border-white/60 bg-white/70 p-8 md:p-10 text-center shadow-xl backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#BC3B2C]/10 text-[#BC3B2C]">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <p className="text-xs font-bold uppercase tracking-wider text-[#BC3B2C]">
              Incident Technique
            </p>

            <h2 className="mt-2 font-display text-2xl md:text-3xl text-[#141E33]">
              Une erreur inattendue est survenue
            </h2>

            <p className="mt-3 text-sm text-[#5C574C] leading-relaxed">
              Nous nous excusons pour ce désagrément. Vous pouvez tenter de recharger la page ou regagner la librairie.
            </p>

            {isDev && this.state.error ? (
              <div className="mt-5 max-h-40 overflow-auto rounded-xl bg-[#141E33] p-4 text-left font-mono text-xs text-red-300">
                {this.state.error.message}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-full bg-[#141E33] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#BC3B2C]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Recharger la page
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-full border border-[#141E33]/20 bg-transparent px-6 text-xs font-bold uppercase tracking-wider text-[#141E33] transition-all hover:bg-white/80"
              >
                <Home className="h-3.5 w-3.5" />
                Accueil
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
