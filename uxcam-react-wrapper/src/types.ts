export interface Configuration {
    userAppKey: string;
    enableIntegrationLogging?: boolean;
    enableMultiSessionRecord?: boolean;
    enableCrashHandling?: boolean;
    enableAutomaticScreenNameTagging?: boolean;
    enableAdvancedGestureRecognition?: boolean;
    enableNetworkLogging?: boolean;
    /**
     * Improved, privacy-first WebView capture. Read once when the session
     * starts; changing it later has no effect.
     *
     * Each platform routes this to its own condition, and their defaults
     * differ:
     *
     * - iOS maps it to `UXCamConfiguration.enableImprovedWebViewCapture`,
     *   which is off by default. `true` switches WebViews from rectangle-based
     *   occlusion to DOM-based capture.
     * - Android maps it to `UXConfig.enableFrameSyncOcclusion`, which is on by
     *   default and carries DOM-based WebView capture. `true` is therefore a
     *   no-op; `false` also reverts non-WebView occlusion to the legacy
     *   scroll-delta path.
     *
     * Leave it unset to keep each platform's default.
     *
     * @experimental
     */
    enableImprovedWebViewCapture?: boolean;
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