import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { NativeModules } from 'react-native';

const isTurboModuleEnabled = global.__turboModuleProxy != null;
const UXCamBridge = isTurboModuleEnabled ? require("./NativeRNUxcam").default : NativeModules.RNUxcam;

const UXCAM_CONSOLE_LOG_SCRIPT = `
(function() {
  if (window.__uxcamConsoleBridgeInstalled) return;
  window.__uxcamConsoleBridgeInstalled = true;

  var MAX_MSG_LENGTH = 2048;
  var MAX_LOGS_PER_SEC = 10;
  var logCount = 0;
  var lastResetTime = Date.now();

  var levels = ['log', 'info', 'warn', 'error', 'debug'];
  levels.forEach(function(level) {
    var original = console[level];
    console[level] = function() {
      if (original) {
        original.apply(console, arguments);
      }

      var now = Date.now();
      if (now - lastResetTime >= 1000) {
        logCount = 0;
        lastResetTime = now;
      }
      if (logCount >= MAX_LOGS_PER_SEC) return;
      logCount++;

      var parts = [];
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        try {
          parts.push(typeof arg === 'object' ? JSON.stringify(arg) : String(arg));
        } catch (e) {
          parts.push('[Circular]');
        }
      }
      var message = parts.join(' ');
      if (message.length > MAX_MSG_LENGTH) {
        message = message.substring(0, MAX_MSG_LENGTH) + '...[truncated]';
      }

      try {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'uxcam_js_console',
          level: level,
          message: message
        }));
      } catch (e) {}
    };
  });
})();
true;
`;

function combineInjectedJS(userScript) {
  if (userScript) {
    return UXCAM_CONSOLE_LOG_SCRIPT + '\n' + userScript;
  }
  return UXCAM_CONSOLE_LOG_SCRIPT;
}

// Store the original unpatched WebView reference
let _OriginalWebView = null;

function getOriginalWebView() {
  if (_OriginalWebView) return _OriginalWebView;
  try {
    const rnwv = require('react-native-webview');
    _OriginalWebView = rnwv.WebView || rnwv.default;
  } catch (e) {
    // react-native-webview not installed
  }
  return _OriginalWebView;
}

/**
 * Wrap any WebView component with UXCam console log injection.
 * Uses a ref for the onMessage callback to avoid stale closures
 * and unnecessary re-renders when WebViews are added/removed dynamically.
 */
function wrapWebViewComponent(OriginalComponent) {
  const Wrapped = forwardRef((props, ref) => {
    const { onMessage, injectedJavaScriptBeforeContentLoaded, ...restProps } = props;

    // Use a ref for the user's onMessage to avoid re-creating the handler
    // and causing unnecessary WebView re-renders on callback identity change
    const onMessageRef = useRef(onMessage);
    onMessageRef.current = onMessage;

    const combinedInjectedJS = useMemo(
      () => combineInjectedJS(injectedJavaScriptBeforeContentLoaded),
      [injectedJavaScriptBeforeContentLoaded]
    );

    // Stable handler — never changes identity, reads latest onMessage from ref
    const handleMessage = useCallback((event) => {
      const { data } = event.nativeEvent;
      try {
        const parsed = JSON.parse(data);
        if (parsed && parsed.type === 'uxcam_js_console') {
          UXCamBridge.reportJavaScriptConsoleLog(parsed.level || 'log', parsed.message || '');
          return;
        }
      } catch (e) {
        // Not JSON or not a UXCam message — fall through to user handler
      }

      if (onMessageRef.current) {
        onMessageRef.current(event);
      }
    }, []);

    return React.createElement(OriginalComponent, {
      ...restProps,
      ref: ref,
      injectedJavaScriptBeforeContentLoaded: combinedInjectedJS,
      onMessage: handleMessage,
    });
  });

  Wrapped.displayName = 'UXCamWebView';
  return Wrapped;
}

/**
 * Auto-patch react-native-webview so existing <WebView> usage gets
 * console log capture without any client code changes.
 * Safe to call multiple times — patches only once.
 */
function patchWebViewModule() {
  try {
    const rnwv = require('react-native-webview');
    if (rnwv.__uxcamPatched) return;

    // Capture the original before patching
    const Original = getOriginalWebView();
    if (!Original) return;

    const Wrapped = wrapWebViewComponent(Original);

    // Patch the module cache so all imports see the wrapped version
    if (rnwv.WebView) {
      rnwv.WebView = Wrapped;
    }
    if (rnwv.default) {
      rnwv.default = Wrapped;
    }
    rnwv.__uxcamPatched = true;
  } catch (e) {
    // react-native-webview not installed — nothing to patch
  }
}

// Explicit UXCamWebView component — always uses the original unpatched WebView
// so it works correctly whether or not auto-patching has been applied
const UXCamWebView = forwardRef((props, ref) => {
  const Original = getOriginalWebView();
  if (!Original) {
    console.error(
      'UXCamWebView requires react-native-webview to be installed. ' +
      'Run: npm install react-native-webview'
    );
    return null;
  }

  const { onMessage, injectedJavaScriptBeforeContentLoaded, ...restProps } = props;

  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const combinedInjectedJS = useMemo(
    () => combineInjectedJS(injectedJavaScriptBeforeContentLoaded),
    [injectedJavaScriptBeforeContentLoaded]
  );

  const handleMessage = useCallback((event) => {
    const { data } = event.nativeEvent;
    try {
      const parsed = JSON.parse(data);
      if (parsed && parsed.type === 'uxcam_js_console') {
        UXCamBridge.reportJavaScriptConsoleLog(parsed.level || 'log', parsed.message || '');
        return;
      }
    } catch (e) {
      // Not JSON or not a UXCam message
    }

    if (onMessageRef.current) {
      onMessageRef.current(event);
    }
  }, []);

  return React.createElement(Original, {
    ...restProps,
    ref: ref,
    injectedJavaScriptBeforeContentLoaded: combinedInjectedJS,
    onMessage: handleMessage,
  });
});

UXCamWebView.displayName = 'UXCamWebView';

export { patchWebViewModule };
export default UXCamWebView;
