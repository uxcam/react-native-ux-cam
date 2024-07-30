#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED

#import "RNUxcamSpec.h"
@interface RNUxcam: RCTEventEmitter <NativeRNUxcamSpec>

#else

#import <React/RCTBridgeModule.h>
@interface RNUxcam: RCTEventEmitter <RCTBridgeModule>

#endif

@end