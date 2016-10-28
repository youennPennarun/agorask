package com.agorask.map;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * Created by nolitsou on 10/22/16.
 */
public class RNMarkerManager extends SimpleViewManager<RNMarkerView> {
    public static final String REACT_CLASS = "RNMarker";

    public RNMarkerManager() {
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected RNMarkerView createViewInstance(ThemedReactContext reactContext) {
        return new RNMarkerView(reactContext);
    }

    @ReactProp(name = "coordinate")
    public void setCoordinate(RNMarkerView view, ReadableMap map) {
        view.setCoordinate(map);
    }
}
