package com.uxcam;

import android.content.Context;
import com.facebook.react.views.view.ReactViewGroup;

/** A native privacy boundary, registered before its attached contents can draw. */
public class RNUxcamOccludeView extends ReactViewGroup {
    private boolean hideGestures;
    private boolean registered;
    private boolean dropped;

    public RNUxcamOccludeView(Context context) {
        super(context);
    }

    public void setHideGestures(boolean hideGestures) {
        if (this.hideGestures != hideGestures) {
            this.hideGestures = hideGestures;
            if (isAttachedToWindow() && !dropped) {
                registerOcclusion();
            }
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        dropped = false;
        registerOcclusion();
    }

    @Override
    protected void onDetachedFromWindow() {
        unregisterOcclusion();
        super.onDetachedFromWindow();
    }

    @Override
    public void setId(int id) {
        if (getId() == id) {
            return;
        }
        // Remove the SDK descriptor while it still has the old React tag.
        unregisterOcclusion();
        super.setId(id);
        if (isAttachedToWindow() && !dropped) {
            registerOcclusion();
        }
    }

    void dropOcclusion() {
        dropped = true;
        unregisterOcclusion();
        // React Native may reuse this instance with the default prop omitted.
        hideGestures = false;
    }

    private void registerOcclusion() {
        if (hideGestures) {
            UXCam.occludeSensitiveViewWithoutGesture(this);
        } else {
            UXCam.occludeSensitiveView(this);
        }
        registered = true;
    }

    private void unregisterOcclusion() {
        if (registered) {
            UXCam.unOccludeSensitiveView(this);
            registered = false;
        }
    }
}
