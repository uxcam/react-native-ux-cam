#import "RNUxcam.h"
#import "UXCam.h"


@implementation RNUxcam
@synthesize bridge = _bridge;
RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(startWithKey:(NSString *)userAPIKey) {
    [UXCam pluginType:@"react-native" version:@"5.1.6"];
    [UXCam startWithKey:userAPIKey];
}

RCT_EXPORT_METHOD(stopApplicationAndUploadData) {
    [UXCam stopSessionAndUploadData];
}

RCT_EXPORT_METHOD(restartSession) {
    [UXCam startNewSession];
}

RCT_EXPORT_METHOD(allowShortBreakForAnotherApp:(BOOL)continueSession) {
    [UXCam allowShortBreakForAnotherApp:continueSession];
}
RCT_EXPORT_METHOD(startNewSession) {
    [UXCam startNewSession];
}

RCT_EXPORT_METHOD(cancelCurrentSession) {
    [UXCam cancelCurrentSession];
}

RCT_EXPORT_METHOD(setMultiSessionRecord:(BOOL)recordMultipleSessions) {
    [UXCam setMultiSessionRecord:recordMultipleSessions];
}

RCT_EXPORT_METHOD(pauseScreenRecording) {
    [UXCam pauseScreenRecording];
}

RCT_EXPORT_METHOD(resumeScreenRecording) {
    [UXCam resumeScreenRecording];
}

RCT_EXPORT_METHOD(disableCrashHandling:(BOOL)disable) {
    [UXCam disableCrashHandling:disable];
}

RCT_EXPORT_METHOD(occludeSensitiveScreen:(BOOL)hideScreen) {
    [UXCam occludeSensitiveScreen:hideScreen hideGestures:true];
}

RCT_EXPORT_METHOD(occludeSensitiveScreen:(BOOL)hideScreen hideGestures:(BOOL) hideGesture) {
    [UXCam occludeSensitiveScreen:hideScreen hideGestures:hideGesture];
}

RCT_EXPORT_METHOD(occludeAllTextFields:(BOOL)occludeAll) {
    [UXCam occludeAllTextFields:occludeAll];
}

RCT_EXPORT_METHOD(setAutomaticScreenNameTagging:(BOOL)enable) {
    [UXCam setAutomaticScreenNameTagging:enable];
}

RCT_EXPORT_METHOD(tagScreenName:(NSString *)screenName) {
    [UXCam tagScreenName:screenName];
}

RCT_EXPORT_METHOD(setUserIdentity:(NSString*)userIdentity) {
    [UXCam setUserIdentity:userIdentity];
}

RCT_EXPORT_METHOD(setUserProperty:(NSString*)propertyName value:(id)value) {
    [UXCam setUserProperty:propertyName value:value];
}

RCT_EXPORT_METHOD(setSessionProperty:(NSString*)propertyName value:(id)value) {
    [UXCam setSessionProperty:propertyName value:value];
}

RCT_EXPORT_METHOD(logEvent:(NSString*)eventName) {
    [UXCam logEvent:eventName];
}
RCT_EXPORT_METHOD(logEvent:(NSString*)eventName withProperties:(nullable NSDictionary<NSString*, id>*)properties) {
    [UXCam logEvent:eventName withProperties:properties];
}

RCT_EXPORT_METHOD(urlForCurrentUser:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *url = [UXCam urlForCurrentUser];
    
    if (url) {
        resolve(url);
    } else {
        NSString *code = @"no_url";
        NSString *message = @"Could not retrieve the url for the current user.";
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:0 userInfo:nil];
        
        reject(code, message, error);
    }
}

RCT_EXPORT_METHOD(urlForCurrentSession:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    NSString *url = [UXCam urlForCurrentSession];
    
    if (url) {
        resolve(url);
    } else {
        NSString *code = @"no_url";
        NSString *message = @"Could not retrieve the url for the current session.";
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:0 userInfo:nil];
        
        reject(code, message, error);
    }
}

RCT_EXPORT_METHOD(optOutOverall) {
    [UXCam optOutOverall];
}

RCT_EXPORT_METHOD(optOutOfSchematicRecordings) {
    [UXCam optOutOfSchematicRecordings];
}
RCT_EXPORT_METHOD(optInOverall) {
    [UXCam optInOverall];
}

RCT_EXPORT_METHOD(optIntoSchematicRecordings) {
    [UXCam optIntoSchematicRecordings];
}

RCT_EXPORT_METHOD(optInOverallStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    BOOL optInOverallStatus = [UXCam optInOverallStatus];
	NSNumber *boolNumber = [NSNumber numberWithBool:optInOverallStatus];
	resolve(boolNumber);
}

RCT_EXPORT_METHOD(optInSchematicRecordingStatus:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL optInSchematicRecordingStatus = [UXCam optInSchematicRecordingStatus];
	NSNumber *boolNumber = [NSNumber numberWithBool:optInSchematicRecordingStatus];
	resolve(boolNumber);
}

RCT_EXPORT_METHOD(isRecording:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL isRecording = [UXCam isRecording];
    NSNumber *boolNumber = [NSNumber numberWithBool:isRecording];
	resolve(boolNumber);
}

RCT_EXPORT_METHOD(getMultiSessionRecord:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    BOOL getMultiSessionRecord = [UXCam getMultiSessionRecord];
    NSNumber *boolNumber = [NSNumber numberWithBool:getMultiSessionRecord];
	resolve(boolNumber);
}

RCT_EXPORT_METHOD(pendingSessionCount:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSNumber *pendingCount = [NSNumber numberWithUnsignedInteger:[UXCam pendingUploads]];
	resolve(pendingCount);
}

RCT_EXPORT_METHOD(occludeSensitiveView: (nonnull NSNumber *) tag){
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView* view = [self.bridge.uiManager viewForReactTag:tag];
        [UXCam occludeSensitiveView:view];
    });
}

RCT_EXPORT_METHOD(unOccludeSensitiveView: (nonnull NSNumber *) tag){
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView* view = [self.bridge.uiManager viewForReactTag:tag];
        [UXCam unOccludeSensitiveView:view];
    });
}

RCT_EXPORT_METHOD(occludeSensitiveViewWithoutGesture: (nonnull NSNumber *) tag){
    dispatch_async(dispatch_get_main_queue(), ^{
        UIView* view = [self.bridge.uiManager viewForReactTag:tag];
        [UXCam occludeSensitiveViewWithoutGesture:view];
    });
}

@end
