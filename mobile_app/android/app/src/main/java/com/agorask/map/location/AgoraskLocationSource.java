package com.agorask.map.location;

import android.content.Context;
import android.location.Location;
import android.os.Bundle;
import android.os.SystemClock;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;

import com.agorask.GoogleApiUtils;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

import java.text.DateFormat;
import java.util.ArrayList;
import java.util.Date;

import static com.google.android.gms.location.LocationServices.FusedLocationApi;
import static junit.framework.Assert.assertTrue;

/**
 * Created by nolitsou on 2/3/17.
 */

public class AgoraskLocationSource implements GoogleApiClient.OnConnectionFailedListener, GoogleApiClient.ConnectionCallbacks, LocationListener {
    private static final String REQUESTING_LOCATION_UPDATES_KEY = "REQUESTING_LOCATION_UPDATES_KEY";
    private static final String LOCATION_KEY = "LOCATION_KEY";
    private static final String LAST_UPDATED_TIME_STRING_KEY = "LAST_UPDATED_TIME_STRING_KEY";
    private static final String TAG = "AgoraskLocationSource";

    private final ArrayList<LocationServiceCallbacks> serviceListeners = new ArrayList<>();
    private final ArrayList<AgoraskLocationListener> locationListeners = new ArrayList<>();

    private static AgoraskLocationSource instance = null;
    private final Context context;
    private final GoogleApiUtils googleClientUtils;
    private Location lastLocation;
    private boolean requestingLocationUpdates = false;
    private String lastUpdateTime;

    public boolean isConnected = false;

    private AgoraskLocationSource(Context context)
    {
        this.context = context;
        this.googleClientUtils = GoogleApiUtils.getInstance(context);
        googleClientUtils.addConnectionCallback(this);
        if (googleClientUtils.getClient().isConnected()) {
            onConnected(null);
        }

    }

    public static AgoraskLocationSource getInstance(Context context) {
        if (instance == null) {
            synchronized (AgoraskLocationSource.class) {
                if (instance == null) {
                    instance = new AgoraskLocationSource(context);
                }
            }
        }
        return instance;
    }
    public static AgoraskLocationSource getInstance() {
        return instance;
    }

    public void addServiceListener(LocationServiceCallbacks listener) {
        if (!serviceListeners.contains(listener)) {
            serviceListeners.add(listener);
        }
    }
    public void removeServiceListener(LocationServiceCallbacks listener) {
        if (serviceListeners.contains(listener)) {
            serviceListeners.remove(listener);
        }
    }

    public void addLocationListener(AgoraskLocationListener listener) {
        if (!locationListeners.contains(listener)) {
            locationListeners.add(listener);
        }
    }
    public void removeLocationListener(AgoraskLocationListener listener) {
        if (locationListeners.contains(listener)) {
            locationListeners.remove(listener);
        }
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        isConnected = true;
        Log.d(TAG, "Connected...");
        for(LocationServiceCallbacks listener: serviceListeners) {
            listener.onConnected();
        }
    }

    @Override
    public void onConnectionSuspended(int i) {
        for(LocationServiceCallbacks listener: serviceListeners) {
            listener.onConnectionSuspended();
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        isConnected = false;
        for(LocationServiceCallbacks listener: serviceListeners) {
            listener.onConnectionFailed();
        }
    }

    public void requestLocationUpdates(LocationRequest request, LocationListener callback) {
        FusedLocationApi.requestLocationUpdates(googleClientUtils.getClient(), request, callback);
    }

    public void removeLocationUpdates(LocationListener callback) {
        FusedLocationApi.removeLocationUpdates(googleClientUtils.getClient(), callback);
    }

    public Location getLastKnownLocation() {
        Location updatedLocation = LocationServices.FusedLocationApi
                .getLastLocation(googleClientUtils.getClient());
        if (updatedLocation != null) {
            lastLocation = updatedLocation;
            lastUpdateTime = DateFormat.getTimeInstance().format(new Date());
        }
        Log.d(TAG, "last location = " + lastLocation);
        return lastLocation;
    }


    @Override
    public void onLocationChanged(Location location) {
        lastLocation = location;
        Log.d(TAG, "Location changed! " + lastLocation);
        lastUpdateTime = DateFormat.getTimeInstance().format(new Date());
        for(AgoraskLocationListener listener: locationListeners) {
            listener.locationChanged(location);
        }
    }

    public void onSaveInstanceState(Bundle savedInstanceState) {
        savedInstanceState.putBoolean(REQUESTING_LOCATION_UPDATES_KEY,
                requestingLocationUpdates);
        savedInstanceState.putParcelable(LOCATION_KEY, lastLocation);
        savedInstanceState.putString(LAST_UPDATED_TIME_STRING_KEY, lastUpdateTime);
    }
    public void updateValuesFromBundle(Bundle savedInstanceState) {
        if (savedInstanceState != null) {
            if (savedInstanceState.keySet().contains(REQUESTING_LOCATION_UPDATES_KEY)) {
                requestingLocationUpdates = savedInstanceState.getBoolean(
                        REQUESTING_LOCATION_UPDATES_KEY);
            }
            if (savedInstanceState.keySet().contains(LOCATION_KEY)) {
                lastLocation = savedInstanceState.getParcelable(LOCATION_KEY);
            }

            if (savedInstanceState.keySet().contains(LAST_UPDATED_TIME_STRING_KEY)) {
                lastUpdateTime = savedInstanceState.getString(
                        LAST_UPDATED_TIME_STRING_KEY);
            }
        }
    }

    public void setMockLocation(final Location location) {
        Log.d(TAG, "set mock location to " + location);
        long currentTime = System.currentTimeMillis();
        long elapsedTimeNanos = SystemClock.elapsedRealtimeNanos();
        location.setElapsedRealtimeNanos(elapsedTimeNanos);
        location.setTime(currentTime);
        location.setAccuracy(1);
        try {
            FusedLocationApi.setMockMode(googleClientUtils.getClient(), true)
                    .setResultCallback(new ResultCallback<Status>() {
                @Override
                public void onResult(Status status) {
                    assertTrue(status.isSuccess());
                    LocationServices.FusedLocationApi.setMockLocation(googleClientUtils.getClient(), location)
                            .setResultCallback(new ResultCallback<Status>() {
                                @Override
                                public void onResult(Status status) {
                                    assertTrue(status.isSuccess());
                                    onLocationChanged(location);
                                }
                    });
                }
            });
        } catch(SecurityException e) {
            Log.e(TAG, e.getMessage());
        }
    }

    public void setMockMode(boolean isMocked) {

        Log.d(TAG, "set mock mod to " + isMocked);
        try {
            FusedLocationApi.setMockMode(googleClientUtils.getClient(), isMocked);
        } catch(SecurityException e) {
        Log.e(TAG, e.getMessage());
    }

    }

    public interface LocationServiceCallbacks {
        void onConnected();
        void onConnectionSuspended();
        void onConnectionFailed();
    }

    public interface AgoraskLocationListener {
        void locationChanged(Location location);
    }

}
