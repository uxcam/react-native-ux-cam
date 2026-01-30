package com.uxcamreactexample;

import android.os.Bundle;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "UXCamReactExample";
  }

  /**
   * Required for react-native-screens to work properly with state restoration.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    getSupportFragmentManager().setFragmentFactory(new RNScreensFragmentFactory());
    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. We use {@link DefaultReactActivityDelegate}
   * which allows you to enable New Architecture with a single boolean flags {@link fabricEnabled}
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}
