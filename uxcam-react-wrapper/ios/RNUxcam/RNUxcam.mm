#import "RNUxcam.h"
#import <UXCam/UXCam.h>
#import <UXCam/UXCamConfiguration.h>
#import <UXCam/UXOcclusionHeaders.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import <React/RCTConvert.h>

// Thanks to this guard, we won't import this header when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNUxcamSpec.h"
#endif

static NSString* const RNUxcam_VerifyEvent_Name = @"UXCam_Verification_Event";

// Configuration Keys
static NSString* const RNUxcam_AppKey = @"userAppKey";
static NSString* const RNUxcam_MultiSession = @"enableMultiSessionRecord";
static NSString* const RNUxcam_CrashHandling = @"enableCrashHandling";
static NSString* const RNUxcam_ScreenTag = @"enableAutomaticScreenNameTagging";
static NSString* const RNUxcam_AdvancedGestures = @"enableAdvancedGestureRecognition";
static NSString* const RNUxcam_EnableNetworkLogs = @"enableNetworkLogging";

static NSString* const RNUxcam_Occlusion = @"occlusions";
static NSString* const RNUxcam_OccludeScreens = @"screens";
static NSString* const RNUxcam_ExcludeScreens = @"excludeMentionedScreens";
static NSString* const RNUxcam_OcclusionType = @"type";
static NSString* const RNUxcam_BlurName = @"name";
static NSString* const RNUxcam_BlurRadius = @"blurRadius";
static NSString* const RNUxcam_HideGestures = @"hideGestures";
static NSString* const RNUxcam_OverlayColor = @"color";

static NSString* const RNUxcam_PluginType = @"react-native";
static NSString* const RNUxcam_PluginVersion = @"6.0.1";


@interface RNUxcam ()
@property (atomic, strong) NSNumber* lastVerifyResult;
@property (atomic, assign) NSInteger numEventListeners;
@end

@implementation RNUxcam

RCT_EXPORT_MODULE();

@synthesize viewRegistry_DEPRECATED = _viewRegistry_DEPRECATED;

/// TODO: Investigate if we can remove this and run on a general background Q
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

#pragma mark The main entry point - start the UXCam system with the provided configuration
RCT_EXPORT_METHOD(startWithConfiguration:(NSDictionary *)config)
{
    self.lastVerifyResult = nil;
    [UXCam pluginType:RNUxcam_PluginType version:RNUxcam_PluginVersion];
    
    NSString *userAppKey = config[RNUxcam_AppKey];
    if (!userAppKey || ![userAppKey isKindOfClass:NSString.class])
    {
        [self verifyEventSender:NO];
        return;
    }
    UXCamConfiguration *configuration = [[UXCamConfiguration alloc] initWithAppKey:userAppKey];
    [self updateConfiguration:configuration fromDict:config];
    [UXCam startWithConfiguration:configuration completionBlock:^(BOOL started)
     {
        self.lastVerifyResult = @(started);
    }
    ];
}

RCT_EXPORT_METHOD(configurationForUXCam:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    UXCamConfiguration *configuration = UXCam.configuration;
    
    if (configuration)
    {
        NSDictionary *configDict = @{
            RNUxcam_AppKey: configuration.userAppKey,
            RNUxcam_MultiSession: @(configuration.enableMultiSessionRecord),
            RNUxcam_CrashHandling: @(configuration.enableCrashHandling),
            RNUxcam_ScreenTag: @(configuration.enableAutomaticScreenNameTagging),
            RNUxcam_AdvancedGestures: @(configuration.enableAdvancedGestureRecognition),
            RNUxcam_EnableNetworkLogs: @(configuration.enableNetworkLogging)
        };
        resolve(configDict);
    }
    else
    {
        NSString *code = @"no_configuration";
        NSString *message = @"Please start UXCam with startWithConfiguration first to get configuration";
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:1 userInfo:@{NSLocalizedDescriptionKey : message}];
        
        reject(code, message, error);
    }
}

RCT_EXPORT_METHOD(updateConfiguration:(NSDictionary *)config)
{
    UXCamConfiguration *configuration = UXCam.configuration;
    if (!configuration)
    {
        NSLog(@"Please start UXCam with startWithConfiguration first before updating configuration");
        return;
        
    }
    [self updateConfiguration:configuration fromDict:config];
}

- (void)updateConfiguration:(UXCamConfiguration *)configuration fromDict:(NSDictionary *)config
{
    NSNumber *enableMultiSessionRecord = config[RNUxcam_MultiSession];
    if (enableMultiSessionRecord)
    {
        configuration.enableMultiSessionRecord = [RCTConvert BOOL:enableMultiSessionRecord];
    }
    NSNumber *enableCrashHandling = config[RNUxcam_CrashHandling];
    if (enableCrashHandling)
    {
        configuration.enableCrashHandling = [RCTConvert BOOL:enableCrashHandling];
    }
    NSNumber *enableAutomaticScreenNameTagging = config[RNUxcam_ScreenTag];
    if (enableAutomaticScreenNameTagging)
    {
        configuration.enableAutomaticScreenNameTagging = [RCTConvert BOOL:enableAutomaticScreenNameTagging];
    }
    NSNumber *enableAdvancedGestureRecognition = config[RNUxcam_AdvancedGestures];
    if (enableAdvancedGestureRecognition)
    {
        configuration.enableAdvancedGestureRecognition = [RCTConvert BOOL:enableAdvancedGestureRecognition];
    }
    NSNumber *enableNetworkLogging = config[RNUxcam_EnableNetworkLogs];
    if (enableNetworkLogging)
    {
        configuration.enableNetworkLogging = [RCTConvert BOOL:enableNetworkLogging];
    }
    
    NSArray *occlusionList = config[RNUxcam_Occlusion];
    if (occlusionList && ![occlusionList isKindOfClass:NSNull.class]) {
        UXCamOcclusion *occlusion = [[UXCamOcclusion alloc] init];
        for (NSDictionary *occlusionJson in occlusionList) {
            id <UXCamOcclusionSetting> setting = [self getOcclusionSettingFromJson:occlusionJson];
            if (setting)
            {
                NSArray *screens = [RCTConvert NSArray:occlusionJson[RNUxcam_OccludeScreens]];
                BOOL excludeMentionedScreens = [RCTConvert BOOL:occlusionJson[RNUxcam_ExcludeScreens]];
                [occlusion applySettings:@[setting] screens:screens excludeMentionedScreens: excludeMentionedScreens];
            }
        }
        configuration.occlusion = occlusion;
    }
}

- (id<UXCamOcclusionSetting>)getOcclusionSettingFromJson:(NSDictionary *)json
{
    NSNumber *type = [RCTConvert NSNumber:json[RNUxcam_OcclusionType]];
    UXOcclusionType occlusionType = static_cast<UXOcclusionType>(type.integerValue ?: 3);
    
    switch (occlusionType) {
        case UXOcclusionTypeBlur:
        {
            NSString *name = [RCTConvert NSString:json[RNUxcam_BlurName]];
            UXBlurType blurType = [UXCamOcclusion getBlurTypeFromName:name];
            NSNumber *radiusValue = [RCTConvert NSNumber:json[RNUxcam_BlurRadius]];
            int radius = radiusValue.intValue ?: 10;
            UXCamBlurSetting *blur = [[UXCamBlurSetting alloc] initWithBlurType:blurType radius:radius];
            NSNumber *hideGestures = [RCTConvert NSNumber:json[RNUxcam_HideGestures]];
            if (hideGestures) {
                blur.hideGestures = hideGestures.boolValue;
            }
            
            return blur;
        }
        case UXOcclusionTypeOverlay:
        {
            UXCamOverlaySetting *overlay = [[UXCamOverlaySetting alloc] init];
            NSNumber *colorCode = [RCTConvert NSNumber:json[RNUxcam_OverlayColor]];
            if (colorCode)
            {
                int colorValue = colorCode.intValue;
                float redValue = (colorValue >> 16 & 0xff) / 0xff;
                float greenValue = (colorValue >> 8 & 0xff) / 0xff;
                float blueValue = (colorValue & 0xff) / 0xff;
                
                UIColor *color = [UIColor colorWithRed:redValue green:greenValue blue:blueValue alpha: 1];
                overlay.color = color;
            }
            
            NSNumber *hideGestures = [RCTConvert NSNumber:json[RNUxcam_HideGestures]];
            if (hideGestures) {
                overlay.hideGestures = hideGestures.boolValue;
            }
            return overlay;
        }
        case UXOcclusionTypeOccludeAllTextFields:
        {
            UXCamOccludeAllTextFields *occlude = [[UXCamOccludeAllTextFields alloc] init];
            return occlude;
        }
        default:
            return nil;
    }
}

RCT_EXPORT_METHOD(applyOcclusion:(NSDictionary *)occlusion)
{
    if (occlusion && ![occlusion isKindOfClass:NSNull.class]) {
        id <UXCamOcclusionSetting> setting = [self getOcclusionSettingFromJson:occlusion];
        if (setting)
        {
            [UXCam applyOcclusion:setting];
        }
    }
}

RCT_EXPORT_METHOD(removeOcclusion:(NSDictionary *)occlusion)
{
    if (occlusion && ![occlusion isKindOfClass:NSNull.class]) {
        id <UXCamOcclusionSetting> setting = [self getOcclusionSettingFromJson:occlusion];
        if (setting)
        {
            [UXCam removeOcclusionOfType:setting.type];
        }
        else
        {
            [UXCam removeOcclusion];
        }
    }
}

#pragma mark Event related methods
- (NSArray<NSString *> *)supportedEvents
{
    return @[RNUxcam_VerifyEvent_Name];
}

/// Will be called when this module's first listener is added.
-(void)startObserving
{
    // Set up any upstream listeners or background tasks as necessary
    if (self.numEventListeners == 0)
    {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(addObserverForVerificationNotification:) name:RNUxcam_VerifyEvent_Name object:nil];
    }
    
    self.numEventListeners++;
}

/// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving
{
    self.numEventListeners--;
    if (self.numEventListeners == 0)
    {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:RNUxcam_VerifyEvent_Name object:nil];
    }
    else if (self.numEventListeners < 0)
    {
        NSLog(@"RNUxcam: Removed more event listeners than were added.");
    }
}

- (void)addObserverForVerificationNotification:(NSNotification *)notification
{
    if (![notification.name isEqualToString:RNUxcam_VerifyEvent_Name])
    {
        return;
    }
    BOOL started = [notification.userInfo[@"started"] boolValue];
    [self verifyEventSender:started];
}

- (void)verifyEventSender:(BOOL)verifyResult
{
    if (self.numEventListeners > 0)
    {
        NSDictionary* eventBody = @{@"success": @(verifyResult)};
        if (verifyResult == FALSE)
        {
            NSString *message = @"UXCam session verification failed"; /// TODO: Localise
            NSError *error = [NSError errorWithDomain:@"RNUXCam" code:1 userInfo:@{NSLocalizedDescriptionKey : message}];
            
            eventBody = @{@"success": @(verifyResult), @"error": error};
        }
        
        [self sendEventWithName:RNUxcam_VerifyEvent_Name body:eventBody];
    }
}

RCT_EXPORT_METHOD(occludeAllTextFields:(BOOL)occludeAll)
{
    [UXCam occludeAllTextFields:occludeAll];
}

RCT_EXPORT_METHOD(occludeSensitiveScreen:(BOOL)hideScreen hideGestures:(BOOL)hideGestures)
{
    [UXCam occludeSensitiveScreen:hideScreen hideGestures:hideGestures];
}

RCT_EXPORT_METHOD(occludeSensitiveView:(double)tag hideGestures:(BOOL)hideGestures)
{
    RCTExecuteOnUIManagerQueue(^{
        [self->_viewRegistry_DEPRECATED addUIBlock:^(RCTViewRegistry *viewRegistry) {
            RCTExecuteOnMainQueue(^{
                UIView *view = [self->_viewRegistry_DEPRECATED viewForReactTag:@(tag)];
                // Temporary fix for handling null views in new architecture mode until this is fully migrated to shadow nodes
                if (![self isViewAvailableAndAttachedToSuperView:view]) {
                    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 0.1 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
                        UIView *view = [self->_viewRegistry_DEPRECATED viewForReactTag:@(tag)];
                        if ([self isViewAvailableAndAttachedToSuperView:view]) {
                            [self occludeView:view hideGesture:hideGestures];
                        }
                    });
                } else {
                    [self occludeView:view hideGesture:hideGestures];
                }
            });
        }];
    });
    
}

- (BOOL)isViewAvailableAndAttachedToSuperView:(UIView *)view {
    return view != nil && view.superview != nil;
}

- (void)occludeView:(UIView *)view hideGesture:(BOOL)hideGesture {
    if (hideGesture) {
        [UXCam occludeSensitiveViewWithoutGesture:view];
    } else {
        [UXCam occludeSensitiveView:view];
    }
}

RCT_EXPORT_METHOD(unOccludeSensitiveView:(double)tag)
{
    UIView *view = [_viewRegistry_DEPRECATED viewForReactTag:@(tag)];
    if (view) {
        [UXCam unOccludeSensitiveView:view];
    }
}

RCT_EXPORT_METHOD(optInOverall)
{
    [UXCam optInOverall];
}

RCT_EXPORT_METHOD(optOutOverall)
{
    [UXCam optOutOverall];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, optInOverallStatus)
{
    return @(UXCam.optInOverallStatus);
}

RCT_EXPORT_METHOD(optIntoSchematicRecordings)
{
    [UXCam optIntoSchematicRecordings];
}

RCT_EXPORT_METHOD(optOutOfSchematicRecordings)
{
    [UXCam optOutOfSchematicRecordings];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, optInSchematicRecordingStatus)
{
    return @(UXCam.optInSchematicRecordingStatus);
}

RCT_EXPORT_METHOD(optIntoVideoRecording)
{
    // fallback to schematic recording
    [UXCam optIntoSchematicRecordings];
}

RCT_EXPORT_METHOD(optOutOfVideoRecording)
{
    [UXCam optOutOfSchematicRecordings];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, optInVideoRecordingStatus)
{
    return @(UXCam.optInSchematicRecordingStatus);
}

RCT_EXPORT_METHOD(startNewSession)
{
    [UXCam startNewSession];
}

RCT_EXPORT_METHOD(stopSessionAndUploadData)
{
    [UXCam stopSessionAndUploadData];
}

RCT_EXPORT_METHOD(cancelCurrentSession)
{
    [UXCam cancelCurrentSession];
}

RCT_EXPORT_METHOD(urlForCurrentSession:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *url = [UXCam urlForCurrentSession];
    
    if (url)
    {
        resolve(url);
    }
    else
    {
        NSString *code = @"no_url";
        NSString *message = @"Could not retrieve the url for the current session.";
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:2 userInfo:nil];
        
        reject(code, message, error);
    }
}

RCT_EXPORT_METHOD(urlForCurrentUser:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSString *url = [UXCam urlForCurrentUser];
    
    if (url)
    {
        resolve(url);
    }
    else
    {
        NSString *code = @"no_url";
        NSString *message = @"Could not retrieve the url for the current user.";
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:1 userInfo:nil];
        
        reject(code, message, error);
    }
}

RCT_EXPORT_METHOD(uploadPendingSession)
{
    [UXCam uploadingPendingSessions:nil];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, pendingSessionCount)
{
    return @(UXCam.pendingUploads);
}

RCT_EXPORT_METHOD(deletePendingUploads)
{
    [UXCam deletePendingUploads];
}

RCT_EXPORT_METHOD(allowShortBreakForAnotherApp:(BOOL)continueSession)
{
    [UXCam allowShortBreakForAnotherApp:continueSession];
}

RCT_EXPORT_METHOD(allowShortBreakForAnotherAppInMillis:(double)duration)
{
    [UXCam allowShortBreakForAnotherApp:YES];
    [UXCam setAllowShortBreakMaxDuration:duration];
}

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSNumber *, isRecording)
{
    return @(UXCam.isRecording);
}

RCT_EXPORT_METHOD(pauseScreenRecording)
{
    [UXCam pauseScreenRecording];
}

RCT_EXPORT_METHOD(resumeScreenRecording)
{
    [UXCam resumeScreenRecording];
}

RCT_EXPORT_METHOD(tagScreenName:(NSString *)screenName)
{
    [UXCam tagScreenName:screenName];
}

RCT_EXPORT_METHOD(logEvent:(NSString *)eventName properties:(nullable NSDictionary<NSString *, id> *)properties)
{
    [UXCam logEvent:eventName withProperties:properties];
}

RCT_EXPORT_METHOD(setUserIdentity:(NSString *)userIdentity)
{
    [UXCam setUserIdentity:userIdentity];
}

RCT_EXPORT_METHOD(setUserProperty:(NSString *)propertyName value:(NSString *)value)
{
    [UXCam setUserProperty:propertyName value:value];
}

RCT_EXPORT_METHOD(setSessionProperty:(NSString *)propertyName value:(NSString *)value)
{
    [UXCam setSessionProperty:propertyName value:value];
}

// Thanks to this guard, we won't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeRNUxcamSpecJSI>(params);
}
#endif

@end
