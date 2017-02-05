package com.agorask.map;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.util.Log;
import android.content.res.Resources;

import com.facebook.react.bridge.ReadableMap;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.model.BitmapDescriptor;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Created by nolitsou on 10/22/16.
 */
public class RNMarkerView extends MapFeature {
    private static double MARKER_SIZE_WIDTH_RATIO = 0.065;
    private static int MARKER_SIZE = 70;
    private MarkerOptions options;
    private LatLng position;
    private Marker marker;
    private Integer numberOfTasks;

    public RNMarkerView(Context context) {
        super(context);
        Double size = MARKER_SIZE_WIDTH_RATIO * Resources.getSystem().getDisplayMetrics().widthPixels;
        MARKER_SIZE = size.intValue();
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

    public void setNumberOfTasks(int numberOfTasks) {
        this.numberOfTasks = numberOfTasks;
        if (marker != null) {
            this.marker.setIcon(this.drawIcon());
        }
    }

    private MarkerOptions createOptions() {
        Log.d("RNMarkerView", "create marker options");
        MarkerOptions options = new MarkerOptions()
                .position(position)
                .icon(drawIcon());
        return options;
    }

    public void update() {
        if (marker == null) {
            return;
        }
    }

    public MarkerOptions getOptions() {
        if (this.options == null) {
            this.options = createOptions();
        }
        return this.options;
    }

    private BitmapDescriptor drawIcon() {
        Bitmap.Config conf = Bitmap.Config.ARGB_8888;
        Bitmap bmp = Bitmap.createBitmap(MARKER_SIZE, MARKER_SIZE, conf);
        Canvas canvas = new Canvas(bmp);

        Paint background = new Paint();
        background.setColor(Color.parseColor("#03A9F4"));
        canvas.drawCircle(MARKER_SIZE/2,MARKER_SIZE/2,MARKER_SIZE/2, background);

        Paint circleStroke = new Paint();
        circleStroke.setStyle(Paint.Style.STROKE);
        circleStroke.setStrokeWidth(5);
        circleStroke.setColor(Color.parseColor("#EEEEEE"));
        canvas.drawCircle(MARKER_SIZE/2,MARKER_SIZE/2,MARKER_SIZE/2-2, circleStroke);

        Paint textPaint = new Paint();
        textPaint.setTextAlign(Paint.Align.CENTER);

        if (this.numberOfTasks != null) {
            textPaint.setTextSize(30);
            textPaint.setColor(Color.BLACK);
            canvas.drawText(
                    this.numberOfTasks.toString(),
                    MARKER_SIZE / 2,
                    ((canvas.getHeight() / 2) - ((textPaint.descent() + textPaint.ascent()) / 2)),
                    textPaint
            );
        }

        return BitmapDescriptorFactory.fromBitmap(bmp);
    }

    public LatLng getPosition() {
        return position;
    }

    public Object getFeature() {
        return this.marker;
    }
}
