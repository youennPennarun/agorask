package com.agorask.map;

import android.graphics.Point;
import android.location.Location;
import android.util.Log;
import android.view.View;

import com.agorask.map.location.AgoraskLocationSource;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RNMapView extends MapView
    implements OnMapReadyCallback, GoogleMap.OnMapLongClickListener {

    private final String TAG = "RNMapView";


    private final List<MapFeature> features = new ArrayList<>();
    private final Map<Marker, RNMarkerView> markers = new HashMap<>();
    private final MapManager mapManager;
    private final ReactApplicationContext context;
    private final AgoraskLocationSource locationSource;
    private GoogleMap map;

    public RNMapView(ReactApplicationContext reactContext,MapManager mapManager) {
        super(reactContext);
        this.context = reactContext;
        this.locationSource = AgoraskLocationSource.getInstance(reactContext);
        this.locationSource.addServiceListener(new AgoraskLocationSource.LocationServiceCallbacks() {

            @Override
            public void onConnected() {
                zoomOnUserLocation();
            }

            @Override
            public void onConnectionSuspended() {

            }

            @Override
            public void onConnectionFailed() {

            }
        });

        this.mapManager = mapManager;

        super.onCreate(null);
        super.onResume();
        super.getMapAsync(this);
        Log.i(TAG, "getMapAsync");
    }

    @Override
    public void onMapReady(final GoogleMap map) {
        Log.i(TAG, "onMapReady");
        this.map = map;
        map.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                RNMarkerView clickedMarker = markers.get(marker);
                Log.i(TAG, "onMarkerClick");

                if (clickedMarker != null){
                    WritableMap event = new WritableNativeMap();
                    LatLng latLng = clickedMarker.getPosition();
                    event.putDouble("latitude", latLng.latitude);
                    event.putDouble("longitude", latLng.longitude);

                    Point point = map.getProjection().toScreenLocation(latLng);
                    event.putDouble("x", point.x);
                    event.putDouble("y", point.y);
                    Log.i(TAG, "Push 'onPress' event");
                    mapManager.pushEvent(clickedMarker, "onPress", event);
                    return true;
                }
                return false;
            }
        });
        mapManager.pushEvent(this, "onMapReady", new WritableNativeMap());

        map.setOnMapLongClickListener(this);
        map.getUiSettings().setMyLocationButtonEnabled(true);
        map.setMyLocationEnabled(true);
        zoomOnUserLocation();

        // We need to be sure to disable location-tracking when app enters background, in-case some other module
        // has acquired a wake-lock and is controlling location-updates, otherwise, location-manager will be left
        // updating location constantly, killing the battery, even though some other location-mgmt module may
        // desire to shut-down location-services.
        LifecycleEventListener listener = new LifecycleEventListener() {
            @Override
            public void onHostResume() {
                map.setMyLocationEnabled(true);
                zoomOnUserLocation();
            }
            @Override
            public void onHostPause() {
                map.setMyLocationEnabled(false);
            }

            @Override
            public void onHostDestroy() {
            }
        };

        context.addLifecycleEventListener(listener);
    }

    @Override
    public void onMapLongClick(LatLng latLng) {
        WritableMap event = new WritableNativeMap();
        event.putDouble("lat", latLng.latitude);
        event.putDouble("lng", latLng.longitude);
        Point point = map.getProjection().toScreenLocation(latLng);
        event.putDouble("x", point.x);
        event.putDouble("y", point.y);
        Log.i(TAG, "Push 'onLongPress' event");
        mapManager.pushEvent(this, "onLongPress", event);
    }

    public void zoomOnUserLocation() {
        if (map == null) {
            return;
        }
        Location location = locationSource.getLastKnownLocation();
        if (location != null) {
            Log.d(TAG, "Zoom on user: " + location);
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(new LatLng(location.getLatitude(), location.getLongitude()))      // Sets the center of the map to location user
                    .zoom(12)                   // Sets the zoom
                    .build();                   // Creates a CameraPosition from the builder
            map.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        } else {
            Log.d(TAG, "Unable to retrieve user's location. Skipping zoom on user location");
        }
    }

    public void addFeature(View child, int index) {
        if (child instanceof RNMarkerView) {
            RNMarkerView marker = (RNMarkerView) child;
            marker.add(map);
            features.add(index, marker);
            markers.put((Marker)marker.getFeature(), marker);
        } else {
            Log.e("RNMap", "Cannot add a child of class " + child.getClass());
        }
    }
    public void removeFeatureAt(int index) {
        Log.i(TAG, "removeFeatureAt " + index);
        MapFeature feature = features.remove(index);
        if (feature instanceof RNMarkerView) {
            markers.remove(feature.getFeature());
        }
        feature.remove(map);
    }

    public int getFeatureCount() {
        return features.size();
    }

    public View getFeatureAt(int index) {
        return features.get(index);
    }
}