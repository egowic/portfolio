import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '48px', textAlign: 'center' }}>
          <p className="mono" style={{ fontSize: 12, color: '#c0392b', marginBottom: 8 }}>
            something went wrong
          </p>
          <p className="mono" style={{ fontSize: 11, color: '#444' }}>
            {this.state.message}
          </p>
          <button
            className="mono"
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{
              marginTop: 16, fontSize: 11, color: '#3a7bd5', background: 'none',
              border: '1px solid #3a7bd5', borderRadius: 4, padding: '6px 12px', cursor: 'pointer',
            }}
          >
            try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
