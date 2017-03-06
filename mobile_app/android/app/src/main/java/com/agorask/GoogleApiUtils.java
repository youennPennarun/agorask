package com.agorask;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;

import java.util.ArrayList;

/**
 * Created by nolitsou on 2/21/17.
 */

public class GoogleApiUtils implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {
    private static GoogleApiUtils instance;
    private final GoogleApiClient client;

    private ArrayList<GoogleApiClient.ConnectionCallbacks> connectionCallbacks = new ArrayList<>();

    private GoogleApiUtils(Context context) {
        this.client = new GoogleApiClient.Builder(context)
                .addApi(LocationServices.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();
        this.client.connect();
    }

    public synchronized static GoogleApiUtils getInstance(Context context) {
        if (instance == null) {
            synchronized (GoogleApiUtils.class) {
                if (instance == null) {
                    instance = new GoogleApiUtils(context);
                }
            }
        }
        return instance;
    }

    public GoogleApiClient getClient() {
        return client;
    }

    public synchronized void addConnectionCallback(GoogleApiClient.ConnectionCallbacks callback) {
        connectionCallbacks.add(callback);
    }
    public synchronized void removeConnectionCallback(GoogleApiClient.ConnectionCallbacks callback) {
        connectionCallbacks.remove(callback);
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        for (GoogleApiClient.ConnectionCallbacks callback: connectionCallbacks) {
            callback.onConnected(bundle);
        }
    }

    @Override
    public void onConnectionSuspended(int i) {
        for (GoogleApiClient.ConnectionCallbacks callback: connectionCallbacks) {
            callback.onConnectionSuspended(i);
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }
}
