package com.agorask.map.location;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.agorask.R;

/**
 * Created by nolitsou on 2/3/17.
 */

public class MockLocationService extends Service {
    private final static String TAG = "MockLocationService";

    private final static int NOTIFICATION_ID = 64;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        AgoraskLocationSource locationService = AgoraskLocationSource.getInstance();
        if (locationService != null) {
            mock(locationService, intent);
        } else {
            Log.w(TAG, "LocationSource not created yet");
            startLocationSource(intent);
        }
        return START_NOT_STICKY;
    }

    private void startLocationSource(final Intent intent) {
        final AgoraskLocationSource locationSource = AgoraskLocationSource.getInstance(this);
        locationSource.addServiceListener(new AgoraskLocationSource.LocationServiceCallbacks() {

            @Override
            public void onConnected() {
                mock(locationSource, intent);
            }

            @Override
            public void onConnectionSuspended() {

            }

            @Override
            public void onConnectionFailed() {

            }
        });

    }
    

    private void unmock(AgoraskLocationSource locationSource) {
        locationSource.setMockMode(false);
        hideNotification();
    }
    private void mock(AgoraskLocationSource locationSource, Intent intent) {
        double latitude = 0;
        double longitude = 0;
        String latitudeStr = intent.getStringExtra("latitude");
        String longitudeStr = intent.getStringExtra("longitude");
        Log.d(TAG, latitude + ", " + longitude);
        if (latitudeStr == null) {
            Log.e(TAG, "Missing intent extra 'latitude'");
            return;
        }
        if (longitudeStr == null) {
            Log.e(TAG, "Missing intent extra 'longitude'");
            return;
        }
        try {
            latitude = Double.parseDouble(latitudeStr);
        } catch(Exception e) {
            Log.e(TAG, "invalide value for 'latitude'");
            return;
        }
        try {
            longitude = Double.parseDouble(longitudeStr);
        } catch(Exception e) {
            Log.e(TAG, "invalide value for 'longitude'");
            return;
        }
        Location loc = new Location("mockedLocation");
        loc.setLatitude(latitude);
        loc.setLongitude(longitude);
        locationSource.setMockLocation(loc);
        showNotification();
    }

    private void showNotification() {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(this)
                .setContentTitle("Mock location service enabled!")
                .setContentText("...")
                .setSmallIcon(R.drawable.common_google_signin_btn_icon_dark);

        NotificationManager notificationManager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        // Hide the notification after its selected

        Log.d(TAG, "Show notification");
        notificationManager.notify(NOTIFICATION_ID, mBuilder.build());
    }

    private void hideNotification() {
        Log.d(TAG, "Hiding notification");
        NotificationManager mNotificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.cancel(NOTIFICATION_ID);

    }

    @Override
    public void onDestroy(){
        AgoraskLocationSource locationService = AgoraskLocationSource.getInstance();
        if (locationService != null) {
            unmock(locationService);
        }
        super.onDestroy();
    }
}