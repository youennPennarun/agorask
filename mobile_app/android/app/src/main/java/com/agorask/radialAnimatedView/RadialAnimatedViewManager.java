package com.agorask.radialAnimatedView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.bridge.ReadableMap;

import java.util.Map;

import javax.annotation.Nullable;

import android.util.Log;
import android.app.Activity;

import static android.R.attr.radius;

/**
 * Created by nolitsou on 1/25/17.
 */

public class RadialAnimatedViewManager extends ViewGroupManager<RadialAnimatedView> {
    public static final String REACT_CLASS = "RadialAnimatedView";
    private final ReactApplicationContext reactContext;

    public RadialAnimatedViewManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RadialAnimatedView createViewInstance(ThemedReactContext context) {
        return new RadialAnimatedView(reactContext);
    }

    @ReactProp(name = "revealed")
    public void setRevealed(RadialAnimatedView view, boolean value) {
        Log.i("RadialAnimatedViewManager", "set reveal to " + value);
        view.setRevealed(value);
    }

    @ReactProp(name = "center")
    public void setCenter(RadialAnimatedView view, ReadableMap center) {
        view.setCenter((int) center.getDouble("x"), (int) center.getDouble("y"));
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        Map<String, Map<String, String>> map = MapBuilder.of(
                "onPress", MapBuilder.of("registrationName", "onPress")
        );
        return map;
    }
}
