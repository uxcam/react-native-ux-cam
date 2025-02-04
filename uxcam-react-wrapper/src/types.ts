export interface Configuration {
    userAppKey: string;
    enableIntegrationLogging?: boolean;
    enableMultiSessionRecord?: boolean;
    enableCrashHandling?: boolean;
    enableAutomaticScreenNameTagging?: boolean;
    enableAdvancedGestureRecognition?: boolean;
    enableNetworkLogging?: boolean;
    occlusions?: Occlusion[];
}

export enum OcclusionType {
    OccludeAllTextFields = 1,
    Overlay = 2,
    Blur = 3
}

export interface Occlusion {
    readonly type: OcclusionType;
}