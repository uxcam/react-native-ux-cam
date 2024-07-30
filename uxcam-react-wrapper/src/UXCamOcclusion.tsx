
import { Occlusion, OcclusionType } from "./types";

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