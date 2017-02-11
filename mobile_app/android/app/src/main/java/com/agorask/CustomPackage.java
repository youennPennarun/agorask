package com.agorask;

import com.agorask.map.MapManager;
import com.agorask.map.RNMarkerManager;
import com.agorask.map.location.LocationLink;
import com.agorask.radialAnimatedView.RadialAnimatedViewManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by nolitsou on 10/22/16.
 */
class CustomPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new LocationLink(reactContext));

        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new MapManager(reactContext),
            new RNMarkerManager(),
            new RadialAnimatedViewManager(reactContext)
        );
    }
}
