package com.uxcam;

import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

final class RNUxViewResolver {
    private final ReactApplicationContext reactContext;

    RNUxViewResolver(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    void resolve(final int tag, final RNUxViewFinder viewFinder) {
        UIManagerModule uiManager = reactContext.getNativeModule(UIManagerModule.class);
        if (uiManager == null) {
            return;
        }

        uiManager.addUIBlock(new UIBlock() {
            @Override
            public void execute(NativeViewHierarchyManager nativeViewHierarchyManager) {
                try {
                    View view = nativeViewHierarchyManager.resolveView(tag);
                    if (view != null) {
                        viewFinder.obtainView(view);
                    }
                } catch (IllegalViewOperationException ignored) {
                }
            }
        });
    }

    void invalidate() {
    }
}
