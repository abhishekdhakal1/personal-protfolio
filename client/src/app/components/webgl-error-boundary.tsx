import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// WebGL can fail to initialize for many real-world reasons (disabled GPU,
// sandboxed browser, old drivers, `prefers-reduced-motion` browser policies…).
// The particle field is a decorative background layer, so any failure here
// must never take down the rest of the site — just render nothing instead.
export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Particle background disabled — WebGL unavailable:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
