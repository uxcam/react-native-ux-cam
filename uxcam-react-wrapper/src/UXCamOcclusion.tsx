import * as React from "react";
import { Platform, View, ViewProps, requireNativeComponent } from "react-native";
import UXCam from "./UXCam";
import { Occlusion, OcclusionType } from "./types";

export { OcclusionType } from "./types";

export interface UXCamOccludedViewProps extends ViewProps {
    hideGestures?: boolean;
}

const NativeOccludedView = Platform.OS === "ios"
    ? requireNativeComponent<UXCamOccludedViewProps>("RNUxcamOccludeView")
    : null;

/**
 * Registers occlusion as part of the native iOS view lifecycle, before the
 * mounted view can be captured. This is the safe API for recyclable lists.
 */
export class UXCamOccludedView extends React.Component<UXCamOccludedViewProps> {
    private viewRef = React.createRef<View>();

    componentDidMount() {
        if (NativeOccludedView) {
            return;
        }
        if (this.props.hideGestures) {
            UXCam.occludeSensitiveViewWithoutGesture(this.viewRef.current);
        } else {
            UXCam.occludeSensitiveView(this.viewRef.current);
        }
    }

    componentWillUnmount() {
        if (!NativeOccludedView) {
            UXCam.unOccludeSensitiveView(this.viewRef.current);
        }
    }

    render() {
        const { hideGestures = false, ...viewProps } = this.props;
        if (NativeOccludedView) {
            return React.createElement(NativeOccludedView as any, {
                ...viewProps,
                hideGestures,
            });
        }
        return React.createElement(View as any, {
            ...viewProps,
            ref: this.viewRef,
        });
    }
}

export class UXBlur implements Occlusion {
    readonly type: OcclusionType;
    constructor() {
        this.type = OcclusionType.Blur;
    }

    blurRadius?: number;
    hideGestures?: boolean;
}

export class UXOverlay implements Occlusion {
    readonly type: OcclusionType;
    constructor() {
        this.type = OcclusionType.Overlay;
    }

    color?: number;
    hideGestures?: boolean;
}

export class UXOcclueAllTextFields implements Occlusion {
    readonly type: OcclusionType;
    constructor() {
        this.type = OcclusionType.OccludeAllTextFields;
    }
}
