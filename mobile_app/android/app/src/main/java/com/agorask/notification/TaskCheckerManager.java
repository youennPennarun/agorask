package com.agorask.notification;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.agorask.R;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by nolitsou on 3/3/17.
 */

public class TaskCheckerManager extends ReactContextBaseJavaModule {
    private final static String TAG = "TaskCheckerManager";
    private final ReactApplicationContext context;

    private static final int NOTIF_ID = 3;
    private final TaskChecker checker;


    public TaskCheckerManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.context = reactContext;
        this.checker = TaskChecker.getInstance(context);
    }


    private void showNotification() {

        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle("Agorask")
                        .setContentText("Task checker should be running");
        android.app.NotificationManager notificationManager =
                (android.app.NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(NOTIF_ID, mBuilder.build());

    }
    @Override
    public String getName() {
        return "TaskChecker";
    }

    @ReactMethod
    public void start() {
        Log.d(TAG, "Start task checker service");
        context.startService(new Intent(context, TaskCheckerService.class));
        showNotification();
    }

    @ReactMethod
    public void stop() {
        Log.d(TAG, "Stop task checker service");
        context.stopService(new Intent(context, TaskCheckerService.class));
        String ns = Context.NOTIFICATION_SERVICE;
        NotificationManager nMgr = (NotificationManager) context.getSystemService(ns);
        nMgr.cancel(NOTIF_ID);

    }
}
