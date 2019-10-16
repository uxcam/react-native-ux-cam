
// #if __has_include("RCTBridgeModule.h")
// #import "RCTBridgeModule.h"
// #else
// #import <React/RCTBridgeModule.h>
// #endif
// #if __has_include("RCTUIManager.h")
// #import "RCTUIManager.h"
// #else
// #import <React/RCTUIManager.h>
// #endif

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RNUxcam : RCTEventEmitter <RCTBridgeModule>

@end

