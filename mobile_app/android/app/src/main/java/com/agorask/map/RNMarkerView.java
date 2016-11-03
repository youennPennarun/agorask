package com.agorask.map;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Created by nolitsou on 10/22/16.
 */
public class RNMarkerView extends MapFeature {

    private MarkerOptions options;
    private LatLng position;
    private Marker marker;

    public RNMarkerView(Context context) {
        super(context);
    }

    @Override
    public void add(GoogleMap map) {
        Log.d("RNMarkerView", "Add new marker");
        this.marker = map.addMarker(getOptions());
    }

    @Override
    public void remove(GoogleMap map) {
        marker.remove();
        marker = null;
    }
    public void setCoordinate(ReadableMap coordinate) {
        Log.d("RNMarkerView", "set marker coordinate");
        this.position = new LatLng(coordinate.getDouble("latitude"), coordinate.getDouble("longitude"));
        if (marker != null) {
            marker.setPosition(position);
        }
    }

    private MarkerOptions createOptions() {
        Log.d("RNMarkerView", "create marker options");
        MarkerOptions options = new MarkerOptions()
                .position(position);
        return options;
    }

    public MarkerOptions getOptions() {
        if (this.options == null) {
            this.options = createOptions();
        }
        return this.options;
    }

    public LatLng getPosition() {
        return position;
    }

    public Object getFeature() {
        return this.marker;
    }
}
