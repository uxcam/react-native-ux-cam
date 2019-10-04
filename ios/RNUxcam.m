#import "RNUxcam.h"
#import "UXCam.h"

#import <React/RCTUIManager.h>

static NSString* const RNUxcam_VerifyEvent_Name = @"UXCam_Verification_Event";

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

#pragma mark The main entry point - start the UXCam system with the provided key
RCT_EXPORT_METHOD(startWithKey:(NSString *)userAPIKey)
{
	self.lastVerifyResult = nil;
	[UXCam pluginType:@"react-native" version:@"5.1.11"];
	/// TODO: Move this into the main iOS SDK so it sends a notification on verify and we just listen for that.
	[UXCam startWithKey:userAPIKey
		buildIdentifier:nil
		completionBlock:^(BOOL started)
						 {
							 self.lastVerifyResult = @(started);
							 [self verifyEventSender:started];
						 }
	 ];
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
		/// Action for first listener added - eg register for notifications
	}
	
	self.numEventListeners++;
}

/// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving
{
	self.numEventListeners--;
	if (self.numEventListeners == 0)
	{
		/// Remove upstream listeners, stop unnecessary background tasks
	}
	else if (self.numEventListeners < 0)
	{
		NSLog(@"RNUxcam: Removed more event listeners than were added.");
	}
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
	[UXCam setMultiSessionRecord:recordMultipleSessions];
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
	[UXCam disableCrashHandling:disable];
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
	resolve(@(UXCam.getMultiSessionRecord));
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

RCT_EXPORT_METHOD(resumeShortBreakForAnotherApp)
{
	// A do nothing method on iOS - used in Android
}

RCT_EXPORT_METHOD(occludeSensitiveView: (nonnull NSNumber *) tag)
{
	dispatch_async(dispatch_get_main_queue(), ^
				   {
					   UIView* view = [self.bridge.uiManager viewForReactTag:tag];
					   [UXCam occludeSensitiveView:view];
				   });
}

RCT_EXPORT_METHOD(unOccludeSensitiveView: (nonnull NSNumber *) tag)
{
	dispatch_async(dispatch_get_main_queue(), ^
				   {
					   UIView* view = [self.bridge.uiManager viewForReactTag:tag];
					   [UXCam unOccludeSensitiveView:view];
				   });
}

RCT_EXPORT_METHOD(occludeSensitiveViewWithoutGesture: (nonnull NSNumber *) tag)
{
	dispatch_async(dispatch_get_main_queue(), ^
				   {
					   UIView* view = [self.bridge.uiManager viewForReactTag:tag];
					   [UXCam occludeSensitiveViewWithoutGesture:view];
				   });
}

#pragma mark Screen name methods
RCT_EXPORT_METHOD(setAutomaticScreenNameTagging:(BOOL)enable)
{
	[UXCam setAutomaticScreenNameTagging:enable];
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

@end
