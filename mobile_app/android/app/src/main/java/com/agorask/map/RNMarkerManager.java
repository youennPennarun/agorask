package com.agorask.map;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by nolitsou on 10/22/16.
 */
public class RNMarkerManager extends ViewGroupManager<RNMarkerView> {
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

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        Map<String, Map<String, String>> map = MapBuilder.of(
                "onPress", MapBuilder.of("registrationName", "onPress")
        );
        return map;
    }

    @Override
    public void removeViewAt(RNMarkerView parent, int index) {
        super.removeViewAt(parent, index);
        parent.update();
    }
}
