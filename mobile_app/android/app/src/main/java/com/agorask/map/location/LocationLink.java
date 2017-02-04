package com.agorask.map.location;

import android.location.Location;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

public class LocationLink extends ReactContextBaseJavaModule
        implements AgoraskLocationSource.AgoraskLocationListener {
    private AgoraskLocationSource locationService;

    private Callback onLocationChanged = null;

    public LocationLink(ReactApplicationContext context) {
        super(context);
        this.locationService = AgoraskLocationSource.getInstance(context);
        this.locationService.addLocationListener(this);
    }

    @ReactMethod
    public void watchPosition(Callback callback) {
        this.onLocationChanged = callback;
    }

    @ReactMethod
    public void clearWatch() {
    this.onLocationChanged = null;
    }

    @ReactMethod
    public void getPosition(Callback callback) {
        Location lastKnownLocation = this.locationService.getLastKnownLocation();
        if (locationService == null) {
            callback.invoke(null);
        } else {
            WritableMap params = new WritableNativeMap();
            params.putMap("coords", locationToMap(lastKnownLocation));
            callback.invoke(params);
        }
    }

    @Override
    public String getName() {
        return "Location";
    }

    @Override
    public void locationChanged(Location location) {
        if (onLocationChanged == null) return;
        WritableMap params = new WritableNativeMap();
        params.putMap("coords", locationToMap(location));
        onLocationChanged.invoke(params);
    }

    private static WritableMap locationToMap(Location location) {
        WritableMap params = new WritableNativeMap();
        params.putDouble("latitude", location.getLatitude());
        params.putDouble("longitude", location.getLongitude());
        params.putDouble("accuracy", location.getAccuracy());
        params.putDouble("altitude", location.getAltitude());
        params.putDouble("speed", location.getSpeed());
        return params;
    }
}