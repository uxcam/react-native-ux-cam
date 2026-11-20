import React from 'react';
import UXCam from './UXCam';

/**
 * Reports render errors in its children to UXCam as handled JavaScript
 * exceptions, then renders `fallback` instead of the failed tree.
 *
 * `fallback` is a React node, or a function `({ error, resetError }) => node`.
 * Without a fallback the boundary renders nothing after an error.
 * `onError(error, componentStack)` is called after the report.
 */
export default class UXCamErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
        this.resetError = this.resetError.bind(this);
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        const componentStack = info && info.componentStack ? info.componentStack : null;
        UXCam.reportExceptionEvent(error, this.props.properties, componentStack);
        if (typeof this.props.onError === 'function') {
            this.props.onError(error, componentStack);
        }
    }

    resetError() {
        this.setState({ error: null });
    }

    render() {
        const { error } = this.state;
        if (error == null) {
            return this.props.children;
        }
        const { fallback } = this.props;
        if (typeof fallback === 'function') {
            return fallback({ error, resetError: this.resetError });
        }
        return fallback === undefined ? null : fallback;
    }
}
