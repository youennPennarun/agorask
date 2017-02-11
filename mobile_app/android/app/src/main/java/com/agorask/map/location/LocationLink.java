package com.agorask.map.location;

import java.util.HashMap;
import java.util.ArrayList;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;

import android.location.Location;
import android.support.annotation.Nullable;

import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;

public class LocationLink extends ReactContextBaseJavaModule {
    private AgoraskLocationSource locationService;
    private HashMap<Integer, LocationListener> listeners = new HashMap<>();
    private ArrayList<Object[]> pending = new ArrayList<>();

    private boolean gApiReady = false;

    private ReactApplicationContext reactContext;

    public LocationLink(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        this.locationService = AgoraskLocationSource.getInstance(context);
        this.locationService.addServiceListener(new AgoraskLocationSource.LocationServiceCallbacks() {

            @Override
            public void onConnected() {
                gApiReady = true;
                for (Object[] conf: pending) {
                    locationService.requestLocationUpdates((LocationRequest)conf[0], (LocationListener)conf[1]);
                }
                pending.clear();
            }

            @Override
            public void onConnectionSuspended() {
                gApiReady = false;
            }

            @Override
            public void onConnectionFailed() {
                gApiReady = false;
            }
        });
    }

    @ReactMethod
    public void watchPosition(final Integer id, @Nullable final ReadableMap options) {
        LocationRequest locationRequest = LocationRequest.create();
        if (options != null) {
            if (options.hasKey("timeout"))
                locationRequest.setFastestInterval((new Double(options.getDouble("timeout"))).longValue());
            if (options.hasKey("maximumAge"))
                locationRequest.setInterval((new Double(options.getDouble("maximumAge"))).longValue());
            if (options.hasKey("enableHighAccuracy")) {
                int priority = ((options.getBoolean("enableHighAccuracy")) ? locationRequest.PRIORITY_HIGH_ACCURACY : locationRequest.PRIORITY_BALANCED_POWER_ACCURACY);
                locationRequest.setPriority(priority);
            }
        }
        LocationListener l = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                WritableMap params = new WritableNativeMap();
                params.putMap("coords", locationToMap(location));
                params.putInt("callbackId", id);
                reactContext
                    .getJSModule(RCTDeviceEventEmitter.class)
                    .emit("locationChanged", params);
            }
        };
        listeners.put(id, l);
        if (gApiReady) {
            this.locationService.requestLocationUpdates(locationRequest, l);
        } else {
            Object[] conf = new Object[]{locationRequest, l};
            pending.add(conf);
        }
    }
    @ReactMethod
    public void clearWatch(final Integer id) {
        LocationListener l = listeners.get(id);
        if (l != null) {
            this.locationService.removeLocationUpdates(l);
            listeners.remove(id);
        }
    }

    @ReactMethod
    public void getPosition(final Callback callback) {
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