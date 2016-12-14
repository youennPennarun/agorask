package com.agorask.map;

import android.support.annotation.Nullable;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.Map;

/**
 * Created by nolitsou on 10/21/16.
 */
public class MapManager extends ViewGroupManager<RNMapView> {
    public static final String REACT_CLASS = "RNMap";
    private final ReactApplicationContext reactContext;

    public MapManager(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RNMapView createViewInstance(ThemedReactContext context) {
        return new RNMapView(reactContext, this);
    }

    @Override
    @Nullable
    public Map getExportedCustomDirectEventTypeConstants() {
        Map<String, Map<String, String>> map = MapBuilder.of(
                "onMapReady", MapBuilder.of("registrationName", "onMapReady"),
                "onLongPress", MapBuilder.of("registrationName", "onLongPress")
        );

        return map;
    }

    @Override
    public void addView(RNMapView parent, View child, int index) {
        parent.addFeature(child, index);
    }

    @Override
    public void removeViewAt(RNMapView parent, int index) {
        parent.removeFeatureAt(index);
    }
    @Override
    public int getChildCount(RNMapView view) {
        return view.getFeatureCount();
    }
    @Override
    public View getChildAt(RNMapView view, int index) {
        return view.getFeatureAt(index);
    }

    void pushEvent(View view, String name, WritableMap data) {
        reactContext.getJSModule(RCTEventEmitter.class)
                .receiveEvent(view.getId(), name, data);
    }
}
