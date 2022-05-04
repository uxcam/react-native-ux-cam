#import "RNUxcam.h"
#import <UXCam/UXCam.h>

#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>

static NSString* const RNUxcam_VerifyEvent_Name = @"UXCam_Verification_Event";

// Configuration Keys
static NSString* const RNUxcam_AppKey = @"userAppKey";
static NSString* const RNUxcam_MultiSession = @"enableMultiSessionRecord";
static NSString* const RNUxcam_CrashHandling = @"enableCrashHandling";
static NSString* const RNUxcam_ScreenTag = @"enableAutomaticScreenNameTagging";
static NSString* const RNUxcam_AdvancedGestures = @"enableAdvancedGestureRecognition";
static NSString* const RNUxcam_EnableNetworkLogs = @"enableNetworkLogging";
static NSString* const RNUxcam_Occlusion = @"occlusion";
static NSString* const RNUxcam_OccludeScreens = @"screens";
static NSString* const RNUxcam_ExcludeScreens = @"excludeMentionedScreens";

@interface RNUxcam ()
@property (atomic, strong) NSNumber* lastVerifyResult;
@property (atomic, assign) NSInteger numEventListeners;
@end

@implementation RNUxcam

RCT_EXPORT_MODULE();

/// Made the module a singleton when we added event sending - otherwise it threw an error on CMD+R reload
+ (id)allocWithZone:(NSZone *)zone
{
	static RNUxcam *sharedInstance = nil;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		sharedInstance = [super allocWithZone:zone];
	});
	return sharedInstance;
}

/// TODO: Investigate if we can remove this and run on a general background Q
- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}

#pragma mark The main entry point - start the UXCam system with the provided configuration
RCT_EXPORT_METHOD(startWithConfiguration:(NSDictionary *)config)
{
    self.lastVerifyResult = nil;
    [UXCam pluginType:@"react-native" version:@"5.4.0"];
    
    NSString *userAppKey = config[RNUxcam_AppKey];
    if (!userAppKey || ![userAppKey isKindOfClass:NSString.class])
    {
        NSLog(@"UXCam: Please provide valid app key");
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
                  rejecter:(RCTPromiseRejectBlock)reject)
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
        NSError *error = [NSError errorWithDomain:@"RNUXCam" code:1 userInfo:nil];
        
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
    if (enableMultiSessionRecord && [self isBoolNumber:enableMultiSessionRecord])
    {
        configuration.enableMultiSessionRecord = [enableMultiSessionRecord boolValue];
    }
    NSNumber *enableCrashHandling = config[RNUxcam_CrashHandling];
    if (enableCrashHandling && [self isBoolNumber:enableCrashHandling])
    {
        configuration.enableCrashHandling = [enableCrashHandling boolValue];
    }
    NSNumber *enableAutomaticScreenNameTagging = config[RNUxcam_ScreenTag];
    if (enableAutomaticScreenNameTagging && [self isBoolNumber:enableAutomaticScreenNameTagging])
    {
        configuration.enableAutomaticScreenNameTagging = [enableAutomaticScreenNameTagging boolValue];
    }
    NSNumber *enableAdvancedGestureRecognition = config[RNUxcam_AdvancedGestures];
    if (enableAdvancedGestureRecognition && [self isBoolNumber:enableAdvancedGestureRecognition])
    {
        configuration.enableAdvancedGestureRecognition = [enableAdvancedGestureRecognition boolValue];
    }
    NSNumber *enableNetworkLogging = config[RNUxcam_EnableNetworkLogs];
    if (enableNetworkLogging && [self isBoolNumber:enableNetworkLogging])
    {
        configuration.enableNetworkLogging = [enableNetworkLogging boolValue];
    }
    
    NSArray *occlusionList = config[RNUxcam_Occlusion];
    if (occlusionList && ![occlusionList isKindOfClass:NSNull.class]) {
        UXCamOcclusion *occlusion = [[UXCamOcclusion alloc] init];
        for (NSDictionary *occlusionJson in occlusionList) {
            id <UXCamOcclusionSetting> setting = [UXCamOcclusion getSettingFromJson:occlusionJson];
            if (setting)
            {
                NSArray *screens = occlusionJson[RNUxcam_OccludeScreens];
                BOOL excludeMentionedScreens = [occlusionJson[RNUxcam_ExcludeScreens] boolValue];
                [occlusion applySettings:@[setting] screens:screens excludeMentionedScreens: excludeMentionedScreens];
            }
        }
        configuration.occlusion = occlusion;
    }
}

RCT_EXPORT_METHOD(startWithKey:(NSString *)userAppKey)
{
    NSDictionary *config = @{RNUxcam_AppKey: userAppKey};
    [self startWithConfiguration:config];
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

/// Interpret the 'tag' passed in (result of findNodeFromHandle) which used to be just an NSNumber view tag, but now comes in as a full dictionary. Change in some random RN version?
- (NSNumber*)tagNumberFromTag:(id)tag
{
	NSNumber* reactTag = nil;
	if ([tag isKindOfClass:NSDictionary.class])
	{
		reactTag = tag[@"_nativeTag"];
	}
	else if ([tag isKindOfClass:NSNumber.class])
	{
		reactTag = tag;
	}
	
	return reactTag;
}

- (BOOL)isBoolNumber:(NSNumber *)num
{
    CFTypeID boolID = CFBooleanGetTypeID(); // the type ID of CFBoolean
    CFTypeID numID = CFGetTypeID((__bridge CFTypeRef)(num)); // the type ID of num
    return numID == boolID;
}

#pragma mark General UXCam SDK method mappings
RCT_EXPORT_METHOD(stopSessionAndUploadData)
{
	[UXCam stopSessionAndUploadData];
}

RCT_EXPORT_METHOD(restartSession)
{
	[UXCam startNewSession];
}

RCT_EXPORT_METHOD(allowShortBreakForAnotherApp:(BOOL)continueSession)
{
	[UXCam allowShortBreakForAnotherApp:continueSession];
}

RCT_EXPORT_METHOD(startNewSession)
{
	[UXCam startNewSession];
}

RCT_EXPORT_METHOD(cancelCurrentSession)
{
	[UXCam cancelCurrentSession];
}

RCT_EXPORT_METHOD(setMultiSessionRecord:(BOOL)recordMultipleSessions)
{
    UXCam.configuration.enableMultiSessionRecord = recordMultipleSessions;
}

RCT_EXPORT_METHOD(pauseScreenRecording)
{
	[UXCam pauseScreenRecording];
}

RCT_EXPORT_METHOD(resumeScreenRecording)
{
	[UXCam resumeScreenRecording];
}

RCT_EXPORT_METHOD(disableCrashHandling:(BOOL)disable)
{
    UXCam.configuration.enableCrashHandling = !disable;
}

RCT_EXPORT_METHOD(occludeSensitiveScreen:(BOOL)hideScreen)
{
	[UXCam occludeSensitiveScreen:hideScreen hideGestures:true];
}

RCT_EXPORT_METHOD(occludeSensitiveScreen:(BOOL)hideScreen hideGestures:(BOOL) hideGesture)
{
	[UXCam occludeSensitiveScreen:hideScreen hideGestures:hideGesture];
}

RCT_EXPORT_METHOD(occludeAllTextFields:(BOOL)occludeAll)
{
	[UXCam occludeAllTextFields:occludeAll];
}

RCT_EXPORT_METHOD(setUserIdentity:(NSString*)userIdentity)
{
	[UXCam setUserIdentity:userIdentity];
}

RCT_EXPORT_METHOD(setUserProperty:(NSString*)propertyName value:(id)value)
{
	[UXCam setUserProperty:propertyName value:value];
}

RCT_EXPORT_METHOD(setSessionProperty:(NSString*)propertyName value:(id)value)
{
	[UXCam setSessionProperty:propertyName value:value];
}

RCT_EXPORT_METHOD(logEvent:(NSString*)eventName)
{
	[UXCam logEvent:eventName];
}

RCT_EXPORT_METHOD(logEvent:(NSString*)eventName withProperties:(nullable NSDictionary<NSString*, id>*)properties)
{
	[UXCam logEvent:eventName withProperties:properties];
}

RCT_EXPORT_METHOD(urlForCurrentUser:(RCTPromiseResolveBlock)resolve
						   rejecter:(RCTPromiseRejectBlock)reject)
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

RCT_EXPORT_METHOD(urlForCurrentSession:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
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

RCT_EXPORT_METHOD(optOutOverall)
{
	[UXCam optOutOverall];
}

RCT_EXPORT_METHOD(optOutOfSchematicRecordings)
{
	[UXCam optOutOfSchematicRecordings];
}

RCT_EXPORT_METHOD(optInOverall)
{
	[UXCam optInOverall];
}

RCT_EXPORT_METHOD(optIntoSchematicRecordings)
{
	[UXCam optIntoSchematicRecordings];
}

RCT_EXPORT_METHOD(optInOverallStatus:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
{
	resolve(@(UXCam.optInOverallStatus));
}

RCT_EXPORT_METHOD(optInSchematicRecordingStatus:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
{
	resolve(@(UXCam.optInSchematicRecordingStatus));
}

RCT_EXPORT_METHOD(isRecording:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
{
	resolve(@(UXCam.isRecording));
}

RCT_EXPORT_METHOD(getMultiSessionRecord:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(@(UXCam.configuration.enableMultiSessionRecord));
}

RCT_EXPORT_METHOD(pendingSessionCount:(RCTPromiseResolveBlock)resolve
				  rejecter:(RCTPromiseRejectBlock)reject)
{
	resolve(@(UXCam.pendingUploads));
}

RCT_EXPORT_METHOD(deletePendingUploads)
{
	[UXCam deletePendingUploads];
}

RCT_EXPORT_METHOD(uploadPendingSession)
{
    [UXCam uploadingPendingSessions:nil];
}

RCT_EXPORT_METHOD(resumeShortBreakForAnotherApp)
{
	// A do nothing method on iOS - used in Android
}

RCT_EXPORT_METHOD(occludeSensitiveView: (id) tag)
{
	NSNumber* reactTag = [self tagNumberFromTag:tag];
	if (reactTag)
	{
		// Very convoluted way to get the occlusion to not run until the UIManager has completed any pending operations - without this the current view being setup in something like
		// <Text ref={(view) => RNUxcam.occludeSensitiveView(view)}>Occluded text</Text>
		// wont be found in the registry and so wont be occluded
		dispatch_async(RCTGetUIManagerQueue(), ^
					   {
						   [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry)
							{
								UIView* view = viewRegistry[reactTag];
								if (view)
								{
									[UXCam occludeSensitiveView:view];
								}
								else
								{
									NSLog(@"RNUXCam:occludeSensitiveView - unable to find view for reactTag %@", reactTag);
								}
							}];
					   });
	}
	else
	{
		NSLog(@"RNUXCam:occludeSensitiveView - unable to find reactTag from %@", tag);
	}
}

RCT_EXPORT_METHOD(unOccludeSensitiveView: (id) tag)
{
	NSNumber* reactTag = [self tagNumberFromTag:tag];
	if (reactTag)
	{
		// Very convoluted way to get the occlusion to not run until the UIManager has completed any pending operations - without this the current view
		// might not be found in the registry and so wont be unoccluded. Probably less of a problem with unOcclusion, but left to mirror the other methods
		dispatch_async(RCTGetUIManagerQueue(), ^
					   {
						   [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry)
							{
								UIView* view = viewRegistry[reactTag];
								if (view)
								{
									[UXCam unOccludeSensitiveView:view];
								}
								else
								{
									NSLog(@"RNUXCam:unOccludeSensitiveView - unable to find view for reactTag %@", reactTag);
								}
							}];
					   });
	}
	else
	{
		NSLog(@"RNUXCam:unOccludeSensitiveView - unable to find reactTag from %@", tag);
	}
}

RCT_EXPORT_METHOD(occludeSensitiveViewWithoutGesture: (id) tag)
{
	NSNumber* reactTag = [self tagNumberFromTag:tag];
	if (reactTag)
	{
		// Very convoluted way to get the occlusion to not run until the UIManager has completed any pending operations - without this the current view being setup in something like
		// <Text ref={(view) => RNUxcam.occludeSensitiveViewWithoutGesture(view)}>Occluded text</Text>
		// wont be found in the registry and so wont be occluded
		dispatch_async(RCTGetUIManagerQueue(), ^
					   {
						   [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry)
							{
								UIView* view = viewRegistry[reactTag];
								if (view)
								{
									[UXCam occludeSensitiveViewWithoutGesture:view];
								}
								else
								{
									NSLog(@"RNUXCam:occludeSensitiveViewWithoutGesture - unable to find view for reactTag %@", reactTag);
								}
							}];
					   });
	}
	else
	{
		NSLog(@"RNUXCam:occludeSensitiveViewWithoutGesture - unable to find reactTag from %@", tag);
	}
}

#pragma mark Screen name methods
RCT_EXPORT_METHOD(setAutomaticScreenNameTagging:(BOOL)enable)
{
    UXCam.configuration.enableAutomaticScreenNameTagging = enable;
}

RCT_EXPORT_METHOD(tagScreenName:(NSString*)screenName)
{
    [UXCam tagScreenName:screenName];
}

RCT_EXPORT_METHOD(addScreenNameToIgnore:(NSString*)screenName)
{
    [UXCam addScreenNameToIgnore:screenName];
}

RCT_EXPORT_METHOD(addScreenNamesToIgnore:(NSArray<NSString*>*)screenNames)
{
    [UXCam addScreenNamesToIgnore:screenNames];
}

RCT_EXPORT_METHOD(removeScreenNameToIgnore:(NSString*)screenName)
{
    [UXCam removeScreenNameToIgnore:screenName];
}

RCT_EXPORT_METHOD(removeScreenNamesToIgnore:(NSArray<NSString*>*)screenNames)
{
    [UXCam removeScreenNamesToIgnore:screenNames];
}

RCT_EXPORT_METHOD(removeAllScreenNamesToIgnore)
{
    [UXCam removeAllScreenNamesToIgnore];
}

RCT_EXPORT_METHOD(screenNamesBeingIgnored:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    resolve(UXCam.screenNamesBeingIgnored);
}

RCT_EXPORT_METHOD(setPushNotificationToken:(NSString*)pushToken)
{
    [UXCam setPushNotificationToken:pushToken];
}

RCT_EXPORT_METHOD(reportBugEvent:(nullable NSString*)name)
{
    [UXCam reportBugEvent:name properties:nil];
}

RCT_EXPORT_METHOD(reportBugEvent:(NSString*)name properties:(nullable NSDictionary<NSString*, id>*)properties)
{
    [UXCam reportBugEvent:name properties:properties];
}

RCT_EXPORT_METHOD(enableAdvancedGestureRecognizers:(BOOL)enable)
{
    UXCam.configuration.enableAdvancedGestureRecognition = enable;
}

@end
