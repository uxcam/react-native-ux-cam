//
//  UXCam.h
//
//  Copyright (c) 2013-2019 UXCam Ltd. All rights reserved.
//
//  UXCam SDK VERSION: 3.0.6
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 *	UXCam SDK captures User experience data when a user uses an app, analyses this data on the cloud and provides insights to improve usability of the app.
 */

@interface UXCam : NSObject

#pragma mark Starting the UXCam system

/**
 *	Call this method from applicationDidFinishLaunching to start UXCam recording your application's session.
 *	This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
 *
 *	@brief Start the UXCam session
 *	@param userAPIKey	The key to identify your UXCam account - find it in the UXCam dashboard for your account at https://dashboard.uxcam.com/user/settings
 */
+ (void) startWithKey:(NSString*)userAPIKey;


/**
 *	Call this method from applicationDidFinishLaunching to start UXCam recording your application's session.
 *	This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
 *
 *	@brief Start the UXCam session
 *	@param userAPIKey			The key to identify your UXCam account - find it in the UXCam dashboard for your account at https://dashboard.uxcam.com/user/settings
 *	@param buildIdentifier		This string is added to the app bundle ID and name to differentiate builds of the same app on the UXCam dashboard - useful for seperating Debug and Release builds - pass nil for default values
 */
+ (void) startWithKey:(NSString*)userAPIKey
	  buildIdentifier:(nullable NSString*)buildIdentifier;


/**
 *	Call this method from applicationDidFinishLaunching to start UXCam recording your application's session.
 * 	This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
 *
 *	@brief Start the UXCam session
 *	@param userAPIKey			The key to identify your UXCam account - find it in the UXCam dashboard for your account at https://dashboard.uxcam.com/user/settings
 * 	@param buildIdentifier		This string is added to the app bundle ID and name to differentiate builds of the same app on the UXCam dashboard - useful for seperating Debug and Release builds - pass nil for default values
 *	@param sessionStartedBlock	This block will be called once the app settings have been checked against the UXCam server - the parameter will be TRUE if recording has started.  @b NOTE @b: This block is captured and called each time a new session starts.
 */
+ (void) startWithKey:(NSString*)userAPIKey
	  buildIdentifier:(NSString* _Nullable)buildIdentifier
	  completionBlock:(nullable void (^)(BOOL started))sessionStartedBlock;


/**
 *	Call this method from applicationDidFinishLaunching to start UXCam recording your application's session.
 *	This will start the UXCam system, get the settings configurations from our server and start capturing the data according to the configuration.
 *
 *	@brief Start the UXCam session
 *	@param userAPIKey			The key to identify your UXCam account - find it in the UXCam dashboard for your account at https://dashboard.uxcam.com/user/settings
 * 	@param buildIdentifier		This string is added to the app bundle ID and name to differentiate builds of the same app on the UXCam dashboard - useful for seperating Debug and Release builds - pass nil for default values
 *	@param multiSession			If YES (the default for other methods) then a new session is recorded each time the app comes to the foreground. If NO then a single session is recorded, when stopped (either programmatically with @c stopSessionAndUploadData or by the app going to the background) then no more sessions are recorded until @c startWithKey is called again)
 *	@param sessionStartedBlock	This block will be called once the app settings have been checked against the UXCam server - the parameter will be TRUE if recording has started. @b NOTE @b: This block is captured and called each time a new session starts.
 */
+ (void) startWithKey:(NSString*)userAPIKey
	  buildIdentifier:(nullable NSString*)buildIdentifier
	 multipleSessions:(BOOL)multiSession
	  completionBlock:(nullable void (^)(BOOL started))sessionStartedBlock;


#pragma mark Manage session once UXCam has started

/**
 *	@brief Stops the UXCam application and sends captured data to the server.
 *
 *	Use this to start sending the data on UXCam server without the app going into the background.
 *
 *	@note This starts an asynchronous process and returns immediately.
 */
+ (void) stopSessionAndUploadData;


/**
 *	Stops the UXCam application and sends captured data to the server.
 *	Use this to start sending the data on UXCam server without the app going into the background.
 *
 *	@brief Stop the UXCam session and send data to the server
 *	@param block Code block to call once upload process completes - will be run on the main thread. There might still be sessions waiting for upload if there was a problem with uploading any of them
 * 	@note This starts an asynchronous process and returns immediately.
 */
+ (void) stopSessionAndUploadData:(nullable void (^)(void))block;


/**
 *	By default UXCam will end a session immediately when your app goes into the background. But if you are switching over to another app for authorisation, or some other short action, and want the session to continue when the user comes back to your app then call this method with a value of TRUE before switching away to the other app.
 *	UXCam will pause the current session as your app goes into the background and then continue the session when your app resumes. If your app doesn't resume within a couple of minutes the original session will be closed as normal and a new session will start when your app eventually is resumed.
 *
 *	@brief Prevent a short trip to another app causing a break in a session
 *	@param continueSession Set to TRUE to continue the current session after a short trip out to another app. Default is FALSE - stop the session as soon as the app enters the background.
 */
+ (void) allowShortBreakForAnotherApp:(BOOL)continueSession;


/**
 * 	Starts a new session after the @link stopApplicationAndUploadData @/link method has been called.
 *	This happens automatically when the app returns from background.
 *
 *	@note Any completion block registered during startWithKey: will be called as the session starts
 */
+ (void) startNewSession;


/**
 *	Cancels the recording of the current session and discards the data
 *
 * @note A new session will start as normal when the app nexts come out of the background (depending on the state of the MultiSessionRecord flag), or if you call @c startNewSession
 */
+ (void) cancelCurrentSession;


/**
 *	Returns the current recording status
 *
 *	@return YES if the session is being recorded
 */
+ (BOOL) isRecording;


/**
 *	Set whether to record multiple sessions or not
 *
 *	@param recordMultipleSessions YES to record a new session automatically when the device comes out of the background. If NO then a single session is recorded, when stopped (either programmatically with @c stopApplicationAndUploadData or by the app going to the background) then no more sessions are recorded until @c startWithKey is called again).
 *	@note The default setting is to record a new session each time a device comes out of the background. This flag can be set to NO to stop that. You can also set this with the appropriate startWithKey: variant. (This will be reset each time startWithKey is called)
 */
+ (void) setMultiSessionRecord:(BOOL)recordMultipleSessions;


/**
 *	Get whether UXCam is set to automatically record a new session when the app resumes from the background
 */
+ (BOOL) getMultiSessionRecord;


/**
 *	Pause the screen recording
 *
 *  @note With this method gestures are not captured will screen recording is paused. Use @c occludeSensitiveScreen:hideGestures: to control the capture of gestures when the screen is hidden.
 */
+ (void) pauseScreenRecording;


/**
 *	Resumes a paused screen recording
 */
+ (void) resumeScreenRecording;


/**
 *  @brief Call this before calling startWithKey to disable UXCam from capturing sessions that crash
 *
 *  @param disable YES to disable crash capture
 *  @note By default crashhandling is enabled
 */
+ (void) disableCrashHandling:(BOOL)disable;


/**
 *	When called the NSLog output (stderr) will be redirected to a file and uploaded with the session details
 *	@note There will be no console output while debugging after calling this
 */
+ (void) captureLogOutput;


#pragma mark Manage sessions waiting for upload

/**
 *	@brief Returns how many sessions are waiting to be uploaded
 *
 *	Sessions can be in the Pending state if UXCam was unable to upload them at the end of the last session. Normally they will be sent at the end of the next session.
 */
+ (NSUInteger) pendingUploads;


/**
 *	@brief Begins upload of any pending sessions
 *
 *	@param block Code block to call once upload process completes - will be run on the main thread. There might still be sessions waiting for upload if there was a problem with uploading any of them
 *
 *	@note Advanced use only. This is not needed for most developers. This can't be called until UXCam startWithKey: has completed
 */
+ (void) uploadingPendingSessions:(nullable void (^)(void))block;


/**
 *	@brief Deletes any sessions that are awaiting upload
 *	@note Advanced use only. This is not needed for most developers. This can't be called until UXCam startWithKey: has completed
 */
+ (void) deletePendingUploads;


#pragma mark Methods for hiding sensitive information on the screen recording

/**
	Hide a view that contains sensitive information or that you do not want recording on the screen video.

	@param sensitiveView The view to occlude in the screen recording
*/
+ (void) occludeSensitiveView:(UIView*)sensitiveView;


/**
 	Hide a view that contains sensitive information or that you do not want recording on the screen video.
 	Additionally for a view hidden using this method any gesture that starts in the views frame will not be captured.
 
 	@param sensitiveView The view to occlude in the screen recording
*/
+ (void) occludeSensitiveViewWithoutGesture:(UIView*)sensitiveView;


/**
 	Stop hiding a view that was previously hidden
 
 	@param view The view to show again in the screen recording

 	@note If the view passed in was not previously occluded then no action is taken and this method will just return
 */
+ (void) unOccludeSensitiveView:(UIView*)view;


/**
	Hide / un-hide the whole screen from the recording
 
	Call this when you want to hide the whole screen from being recorded - useful in situations where you don't have access to the exact view to occlude
	Once turned on with a TRUE parameter it will continue to hide the screen until called with FALSE
 
	@param hideScreen Set TRUE to hide the screen from the recording, FALSE to start recording the screen contents again
 
 	@note With this method gestures are not captured on the hidden screen. Use @c occludeSensitiveScreen:hideGestures: to control the capture of gestures when the screen is hidden.
*/
+ (void) occludeSensitiveScreen:(BOOL)hideScreen;


/**
 	Hide / un-hide the whole screen from the recording and control whether gestures are till captured while the screen is hidden
 
 	Call this when you want to hide the whole screen from being recorded - useful in situations where you don't have access to the exact view to occlude
 	Once turned on with a hideScreen TRUE parameter it will continue to hide the screen until called with FALSE
 
 	@param hideScreen Set TRUE to hide the screen from the recording, FALSE to start recording the screen contents again
 	@param hideGestures Set TRUE to hide the gestures while the screen is hidden, FALSE to still capture gesture locations while the screen is hidden (has no effect when @c hideScreen is FALSE)
 */
+ (void) occludeSensitiveScreen:(BOOL)hideScreen hideGestures:(BOOL)hideGestures;


/**
	Hide / un-hide all UITextField views on the screen
 
	Call this when you want to hide the contents of all UITextFields from the screen capture. Default is NO.
 
	@param occludeAll Set YES to hide all UITextField views on the screen in the recording, NO to stop occluding them from the screen recording.
 */
+ (void) occludeAllTextFields:(BOOL)occludeAll;


#pragma mark Methods for adding events and data to the current session

/**
	Enable / disable the automatic tagging of screen names
	
	@note By default UXCam will tag new screen names automatically. You can override this using the @c tagScreenName: method or use this method to disable the automatic tagging.
 
	@param enable Set to TRUE to enable automatic screen name tagging (the default) or FALSE to disable it
 
 */
+ (void) setAutomaticScreenNameTagging:(BOOL)enable;


/**
	UXCam normally captures the view controller name automatically but in cases where it this is not sufficient (such as in OpenGL applications)
	or where you would like to set a different unique name, use this function to set the name.
 
	@note Call this in @c [UIViewController viewDidAppear:] after the call to @c [super ...] or automatic screen name tagging will override your value

	@param screenName Name to apply to the current screen in the session video
*/
+ (void) tagScreenName:(NSString*)screenName;


/**
	UXCam uses a unique number to tag a device.
	You can set a user identity for a device allowing you to more easily search for it on the dashboard and review their sessions further.

	@param userIdentity String to apply to this user (device) in this recording session
	@note Starting with SDK v2.5.11 there is no default for this value - to have the previous behaviour call @c [UXCam setUserIdentity:UIDevice.currentDevice.name];
 */
+ (void) setUserIdentity:(NSString*)userIdentity;


/**
	Add a key/value property for this user

	@param propertyName Name of the property to attach to the user
	@param value A value to associate with this property

	@note Only NSNumber and NSString value types are supported to a maximum size per entry of 1KiB
 */
+ (void) setUserProperty:(NSString*)propertyName value:(id)value;


/**
	Add a single key/value property to this session

	@param propertyName Name of the property to attach to the session recording
	@param value A value to associate with this property

	@note Only NSNumber and NSString value types are supported to a maximum size per entry of 1KiB
 */
+ (void) setSessionProperty:(NSString*)propertyName value:(id)value;


/**
	Insert a general event into the timeline - stores the event with the timestamp when it was added.

	@param eventName Name of the event to attach to the session recording at the current time
*/
+ (void) logEvent:(NSString*)eventName;


/**
	Insert a general event, with associated properties, into the timeline - stores the event with the timestamp when it was added.
 
	@param eventName Name of the event to attach to the session recording at the current time
	@param properties An NSDictionary of properties to associate with this event
 
	@note Only NSNumber and NSString property types are supported to a maximum count of 100 and maximum size per entry of 1KiB
 */
+ (void) logEvent:(NSString*)eventName withProperties:(nullable NSDictionary<NSString*, id>*)properties;


#pragma mark Retrieve URLs for viewing sessions
/**
 *  Returns a URL path for showing all the current users sessions
 *
 *	@note This can be used for tying in the current user with other analytics systems
 *
 *  @return url path for all the users sessions or nil if no verified session is active
 */
+ (nullable NSString*) urlForCurrentUser;


/**
 *  Returns a URL path that shows the current session when it compeletes
 *
 *	@note This can be used for tying in the current session with other analytics systems
 *
 *  @return url path for current session or nil if no verified session is active
 */
+ (nullable NSString*) urlForCurrentSession;


#pragma mark Methods for controlling if this device is opted out of session recordings
/**
 *	This will cancel any current session recording and opt this device out of future session recordings until @c optIn is called
 *	@note The default is to opt-in to recordings, and the default will be reset if the user un-installs and re-installs the app
 */
+ (void) optOut;


/**
 *	This will opt this device back into session recordings - you will need to call @c startWithKey: @i after opting the device back in
 */
+ (void) optIn;


/**
 *	Returns the opt-in status of this device
 *	@return YES if the device is opted in to session recordings, NO otherwise
 */
+ (BOOL) optInStatus;


/***
 * This is a workaround if you are having problems with stuttering scrolling views in iOS11.2+
 * Default is TRUE - the system will spot the problem and enable a workaround, but set FALSE to disable this and behave in default manner
 */
+ (void) stopRecordingScrollingOnStutterOS:(BOOL)stopScrollRecording;





#pragma mark Internal use only methods
/**
 *	 Used to identify non-native platform systems
 *   @note For internal use only
 */
+ (void) pluginType:(NSString*)type version:(NSString*)versionNumber;




#pragma mark - Deprecated methods
/// Deprecated - will fall through to the new method `uploadingPendingSessions`
+ (void) UploadingPendingSessions:(void (^)(void))block __attribute__((deprecated("from SDK 3.0 - use - uploadingPendingSessions"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `captureLogOutput`
+ (void) CaptureLogOutput __attribute__((deprecated("from SDK 3.0 - use - captureLogOutput"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `disableCrashHandling`
+ (void)DisableCrashHandling:(BOOL)disable __attribute__((deprecated("from SDK 3.0 - use - disableCrashHandling"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `pendingUploads`
+ (NSUInteger) PendingUploads __attribute__((deprecated("from SDK 3.0 - use - pendingUploads"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `setMultiSessionRecord`
+ (void) SetMultiSessionRecord:(BOOL)recordMultipleSessions __attribute__((deprecated("from SDK 3.0 - use - setMultiSessionRecord"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `getMultiSessionRecord`
+ (BOOL) GetMultiSessionRecord __attribute__((deprecated("from SDK 3.0 - use - getMultiSessionRecord"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `resumeScreenRecording`
+ (void) ResumeScreenRecording __attribute__((deprecated("from SDK 3.0 - use - resumeScreenRecording"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `pauseScreenRecording`
+ (void) PauseScreenRecording __attribute__((deprecated("from SDK 3.0 - use - pauseScreenRecording"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `setAutomaticScreenNameTagging`
+ (void) SetAutomaticScreenNameTagging:(BOOL)enable __attribute__((deprecated("from SDK 3.0 - use - setAutomaticScreenNameTagging"))) NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - will fall through to the new method `stopRecordingScrollingOnStutterOS`
+ (void) StopRecordingScrollingOnStutterOS:(BOOL)stopScrollRecording __attribute__((deprecated("use - stopRecordingScrollingOnStutterOS")))  NS_SWIFT_UNAVAILABLE("Deprecated method not available in Swift");

/// Deprecated - this will not do anything, and the method will be removed in future
+ (void) markSessionAsFavorite __attribute__((deprecated("from SDK 3.0 - This method will be removed from next major release")));

/// Deprecated - will fall through to the new method `stopSessionAndUploadData`
+ (void) stopApplicationAndUploadData __attribute__((deprecated("from SDK 3.0.0 - use stopSessionAndUploadData from now functionality same, name is better")));

/// Deprecated - will fall through to the new method `stopSessionAndUploadData`
+ (void) stopApplicationAndUploadData:(nullable void (^)(void))block __attribute__((deprecated("from SDK 3.0.0 - use stopSessionAndUploadData: from now functionality same, name is better")));

/// Deprecated - will fall through to the new method 'startNewSession'
+ (void) restartSession __attribute__((deprecated("from SDK 3.0.0 - use startNewSession from now: functionality same, name is better")));

/// Deprecated - use PauseScreenRecording and ResumeScreenRecording instead
+ (void) PauseScreenRecording:(NSTimeInterval)pauseDuration __attribute__((deprecated("from SDK 3.0.0 - use PauseScreenRecording & ResumeScreenRecording from now")));

/// Deprecated - use logEvent: instead
+ (void) addTag:(NSString*)tag __attribute__((deprecated("from SDK 3.0.0 - use logEvent: now")));

/// Deprecated - use logEvent:withProperties: instead
+ (void) addTag:(NSString*)tag withProperties:(nullable NSDictionary<NSString*, id>*)properties __attribute__((deprecated("from SDK 3.0.0 - use logEvent:withProperties: now")));

/// Deprecated - use startWithKey:buildIdentifier: instead
+ (void) startWithKey:(NSString*)userAPIKey appVariantIdentifier:(nullable NSString*)appVariant __attribute__((deprecated("from SDK 3.0.0 - use startWithKey:buildIdentifier: now")));

/// Deprecated - use startWithKey:buildIdentifier:completionBlock: instead
+ (void) startWithKey:(NSString*)userAPIKey appVariantIdentifier:(NSString* _Nullable)appVariant completionBlock:(nullable void (^)(BOOL started))sessionStartedBlock __attribute__((deprecated("from SDK 3.0.0 - use startWithKey:buildIdentifier:completionBlock: now")));

/// Deprecated - use startWithKey:buildIdentifier:multipleSessions:completionBlock: instead
+ (void) startWithKey:(NSString*)userAPIKey appVariantIdentifier:(nullable NSString*)appVariant	multipleSessions:(BOOL)multiSession completionBlock:(nullable void (^)(BOOL started))sessionStartedBlock __attribute__((deprecated("from SDK 3.0.0 - use startWithKey:buildIdentifier:multipleSessions:completionBlock: now")));

/// Deprecated - use setUserIdentity: instead
+ (void) tagUsersName:(NSString*)userName __attribute__((deprecated("from SDK 3.0.0 - use setUserIdentity: now")));

@end

NS_ASSUME_NONNULL_END
