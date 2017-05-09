package com.agorask.notification;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.support.annotation.Nullable;

/**
 * Created by nolitsou on 3/5/17.
 */

public class TaskCheckerService extends Service {
    private final static String TAG = "ActivityRecognized";
    private final TaskChecker taskChecker;

    public TaskCheckerService() {
        this.taskChecker = TaskChecker.getInstance(this);
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        taskChecker.start(this);
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        taskChecker.stop();
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

}
