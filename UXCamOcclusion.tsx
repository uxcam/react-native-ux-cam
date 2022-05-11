export enum UXCamOcclusionType {
    OccludeAllTextFields = 1,
    Overlay = 2,
    Blur = 3
}

export default interface UXCamOcclusion {
    readonly type: UXCamOcclusionType;
}

export class UXBlur implements UXCamOcclusion {
    readonly type: UXCamOcclusionType;
    constructor() {
        this.type = UXCamOcclusionType.Blur;
    }

    blurRadius?: number;
    hideGestures?: boolean;
}

export class UXOverlay implements UXCamOcclusion {
    readonly type: UXCamOcclusionType;
    constructor() {
        this.type = UXCamOcclusionType.Overlay;
    }

    color?: number;
    hideGestures?: boolean;
}

export class UXOcclueAllTextFields implements UXCamOcclusion {
    readonly type: UXCamOcclusionType;
    constructor() {
        this.type = UXCamOcclusionType.OccludeAllTextFields;
    }
}