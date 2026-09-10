package com.uxcam;

import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

/** Shares standard React View styling, children, clipping, and accessibility behavior. */
public class RNUxcamOccludeViewManager extends ReactViewManager {
    @Override
    public String getName() {
        return "RNUxcamOccludeView";
    }

    @Override
    public ReactViewGroup createViewInstance(ThemedReactContext context) {
        return new RNUxcamOccludeView(context);
    }

    @ReactProp(name = "hideGestures", defaultBoolean = false)
    public void setHideGestures(ReactViewGroup view, boolean hideGestures) {
        ((RNUxcamOccludeView) view).setHideGestures(hideGestures);
    }

    @Override
    public void onDropViewInstance(ReactViewGroup view) {
        ((RNUxcamOccludeView) view).dropOcclusion();
        super.onDropViewInstance(view);
    }
}
