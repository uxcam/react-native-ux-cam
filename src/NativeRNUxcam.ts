import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { Configuration } from './types';

export interface Spec extends TurboModule {
    startWithConfiguration: (configuration: Object) => void;

    optInOverall: () => void;
    optOutOverall: () => void;
    optIntoSchematicRecordings: () => void;
    optOutOfSchematicRecordings: () => void;
    optInOverallStatus: () => boolean;
    optInSchematicRecordingStatus: () => boolean;
    optIntoVideoRecording: () => void;
    optOutOfVideoRecording: () => void;
    optInVideoRecordingStatus: () => boolean;

    startNewSession: () => void;
    stopSessionAndUploadData: () => void;
    cancelCurrentSession: () => void;

    urlForCurrentSession: () => Promise<string | undefined | null>;
    urlForCurrentUser: () => Promise<string | undefined | null>;

    uploadPendingSession: () => void;
    pendingSessionCount: () => number;
    deletePendingUploads: () => void;

    allowShortBreakForAnotherApp: (continueSession: boolean) => void;
    allowShortBreakForAnotherAppInMillis: (duration: number) => void;

    isRecording: () => boolean;
    pauseScreenRecording: () => void;
    resumeScreenRecording: () => void;

    tagScreenName: (screenName: string) => void;

    logEvent: (eventName: string, properties: Object | null) => void;
    setUserIdentity: (userIdentity: string) => void;

    // Here value should be either number | string but as union types are not officially supported, we pass value as string
    setUserProperty: (propertyName: string, value: string) => void;
    setSessionProperty: (propertyName: string, value: string) => void;

    // Occlusion APIs
    occludeAllTextFields: (occludeAll: boolean) => void;
    occludeSensitiveScreen: (hideScreen: boolean, hideGestures: boolean) => void;
    occludeSensitiveView: (tag: number, hideGestures: boolean) => void;
    unOccludeSensitiveView: (tag: number) => void;
    
    applyOcclusion: (occlusion: Object) => void;
    removeOcclusion: (occlusion: Object) => void;
   

    // Event Listeneres
    addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNUxcam');