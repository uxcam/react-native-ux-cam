package com.uxcam;

import android.os.Build;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.UIManager;
import com.facebook.react.fabric.FabricUIManager;
import com.facebook.react.fabric.interop.UIBlockViewResolver;
import com.facebook.react.uimanager.common.UIManagerType;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.function.Function;

public class UxcamUIBlock implements UIBlockInterface {
   private int tag;
   private ReactApplicationContext context;
   private Function<View, Void> operation;

   public UxcamUIBlock(int tag, ReactApplicationContext context, Function<View, Void> operation) {
       this.tag = tag;
       this.context = context;
       this.operation = operation;
   }

   @Override
   public void execute(NativeViewHierarchyManager nvhm) {
       executeImpl(nvhm, null);
   }

   @Override
   public void execute(UIBlockViewResolver uiBlockViewResolver) {
       executeImpl(null, uiBlockViewResolver);
   }

   private void executeImpl(NativeViewHierarchyManager nvhm, UIBlockViewResolver uiBlockViewResolver) {
       View view = uiBlockViewResolver != null ? uiBlockViewResolver.resolveView(tag) : nvhm.resolveView(tag);
       if (view != null) {
           if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
               operation.apply(view);
           } else {
               // TODO:- Support for lower versions
           }
       }


   }

   public void addToUIManager() {
       if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
           UIManager uiManager = UIManagerHelper.getUIManager(context, UIManagerType.FABRIC);
           ((FabricUIManager) uiManager).addUIBlock(this);
       } else {
           UIManagerModule uiManager = context.getNativeModule(UIManagerModule.class);
           assert uiManager != null;
           uiManager.addUIBlock(this);
       }
   }
}

interface UIBlockInterface extends UIBlock, com.facebook.react.fabric.interop.UIBlock  {
   void execute(UIBlockViewResolver uiBlockViewResolver);
}