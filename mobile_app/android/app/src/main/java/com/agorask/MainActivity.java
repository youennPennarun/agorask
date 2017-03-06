package com.agorask;

import android.os.Bundle;

import com.agorask.map.location.AgoraskLocationSource;
import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "agorask";
    }

    @Override
    protected void onSaveInstanceState(Bundle state) {
        super.onSaveInstanceState(state);
        AgoraskLocationSource locationSource = AgoraskLocationSource.getInstance();
        if (locationSource != null && state != null) {
            locationSource.onSaveInstanceState(state);
        }
    }
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        GoogleApiUtils.getInstance(this);
        AgoraskLocationSource locationSource = AgoraskLocationSource.getInstance();
        if (locationSource != null && state != null) {
            locationSource.updateValuesFromBundle(state);
        }
    }
}
