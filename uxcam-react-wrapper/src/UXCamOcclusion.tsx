import * as React from "react";
import { ViewProps, requireNativeComponent } from "react-native";
import { Occlusion, OcclusionType } from "./types";

export { OcclusionType } from "./types";

export interface UXCamOccludedViewProps extends ViewProps {
    hideGestures?: boolean;
}

const NativeOccludedView = requireNativeComponent<UXCamOccludedViewProps>("RNUxcamOccludeView");

/**
 * Registers occlusion through the native view lifecycle on Android and iOS,
 * without waiting for a JavaScript mount callback or resolving a React tag.
 */
export class UXCamOccludedView extends React.Component<UXCamOccludedViewProps> {
    render() {
        const { hideGestures = false, ...viewProps } = this.props;
        return React.createElement(NativeOccludedView as any, {
            ...viewProps,
            hideGestures,
            // This privacy boundary must retain its own native view.
            collapsable: false,
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
