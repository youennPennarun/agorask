package com.agorask.map;

import android.content.Context;

import com.facebook.react.views.view.ReactViewGroup;
import com.google.android.gms.maps.GoogleMap;

/**
 * Created by nolitsou on 10/22/16.
 */
public abstract class MapFeature extends ReactViewGroup {

    public MapFeature(Context context) {
        super(context);
    }

    public abstract Object getFeature();

    public abstract void add(GoogleMap map);

    public abstract void remove(GoogleMap map);
}
