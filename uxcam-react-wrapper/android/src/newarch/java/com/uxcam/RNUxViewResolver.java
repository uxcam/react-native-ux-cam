package com.uxcam;

import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.bridge.UIManagerListener;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.common.UIManagerType;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

final class RNUxViewResolver implements UIManagerListener {
    private final ReactApplicationContext reactContext;
    private final Map<Integer, RNUxViewFinder> pendingFinders = new LinkedHashMap<>();
    private final AtomicBoolean mountItemsScheduled = new AtomicBoolean();
    private UIManager uiManager;

    RNUxViewResolver(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    void resolve(final int tag, final RNUxViewFinder viewFinder) {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (getUIManager() == null) {
                    return;
                }

                View view = resolveAttachedView(tag);
                if (view != null) {
                    viewFinder.obtainView(view);
                    return;
                }

                boolean wasEmpty = pendingFinders.isEmpty();
                pendingFinders.put(tag, viewFinder);
                if (wasEmpty) {
                    uiManager.addUIManagerEventListener(RNUxViewResolver.this);
                    mountItemsScheduled.set(true);
                }
            }
        });
    }

    private UIManager getUIManager() {
        if (uiManager == null) {
            uiManager = UIManagerHelper.getUIManager(reactContext, UIManagerType.FABRIC);
        }
        return uiManager;
    }

    private View resolveAttachedView(int tag) {
        try {
            View view = uiManager.resolveView(tag);
            return view != null && view.getParent() != null ? view : null;
        } catch (IllegalViewOperationException ignored) {
            return null;
        }
    }

    private void resolvePendingViews() {
        Iterator<Map.Entry<Integer, RNUxViewFinder>> iterator = pendingFinders.entrySet().iterator();
        while (iterator.hasNext()) {
            Map.Entry<Integer, RNUxViewFinder> entry = iterator.next();
            View view = resolveAttachedView(entry.getKey());
            if (view != null) {
                iterator.remove();
                entry.getValue().obtainView(view);
            }
        }

        if (pendingFinders.isEmpty()) {
            uiManager.removeUIManagerEventListener(this);
        }
    }

    void invalidate() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                mountItemsScheduled.set(false);
                pendingFinders.clear();
                if (uiManager != null) {
                    uiManager.removeUIManagerEventListener(RNUxViewResolver.this);
                }
            }
        });
    }

    public void didMountItems(UIManager mountedUIManager) {
        mountItemsScheduled.set(false);
        resolvePendingViews();
    }

    public void didDispatchMountItems(UIManager mountedUIManager) {
        if (mountItemsScheduled.getAndSet(false)) {
            resolvePendingViews();
        }
    }

    public void willDispatchViewUpdates(UIManager mountedUIManager) {}

    public void willMountItems(UIManager mountedUIManager) {}

    public void didScheduleMountItems(UIManager mountedUIManager) {
        mountItemsScheduled.set(true);
    }
}
