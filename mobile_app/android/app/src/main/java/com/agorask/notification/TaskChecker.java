package com.agorask.notification;

import android.content.Context;
import android.location.Location;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.agorask.BuildConfig;
import com.agorask.R;
import com.agorask.map.location.AgoraskLocationSource;
import com.github.davidmoten.geo.GeoHash;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by nolitsou on 2/21/17.
 */

public class TaskChecker {
    private static final String TAG = "TaskChecker";

    private static final int NOTIF_ID = 1;
    private static final int RADIUS = 100;
    private static final int USER_MOVED_WHEN_MORE_THAN_METERS = 5;
    private static final int REQUEST_DELAY_MINUTES = 5;
    private static final int LOCATION_DELAY_SECONDS = 5;
    private static final int GEOHASH_SIZE = 9;

    private static HashMap<String, ArrayList<Task>> cache = new HashMap<>();

    private String token = null;


    private Location lastLocation = null;

    private static TaskChecker instance;
    private Timer locationChecker;
    private long lastRequest;

    private TaskChecker(Context context) {

    }

    static synchronized TaskChecker getInstance(Context context) {
        if (instance == null) {
            synchronized (TaskChecker.class) {
                if (instance == null) {
                    instance = new TaskChecker(context);
                }
            }
        }
        return instance;
    }


    private void startLocationChecker(final Context context) {
        Log.d(TAG, "start activity checker");
        locationChecker = new Timer();
        locationChecker.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                Location lastLocation = AgoraskLocationSource
                        .getInstance(context)
                        .getLastKnownLocation();
                if (lastLocation != null && !hasMoved(lastLocation)) {
                    requestNewTasksIfNeeded(context);

                }

            }
        }, 0, LOCATION_DELAY_SECONDS * 1000);
    }
    private void stopLocationChecker() {
        if (locationChecker != null) {
            locationChecker.cancel();
        }
    }

    void start(Context context) {
        startLocationChecker(context);
    }
    void stop() {
        stopLocationChecker();
    }
    private boolean hasMoved(Location newLocation) {
        boolean moved = false;

        if (lastLocation != null && newLocation != null) {
            moved = (newLocation.distanceTo(lastLocation) >= USER_MOVED_WHEN_MORE_THAN_METERS);
        }

        this.lastLocation = newLocation;
        return moved;
    }
    private void handleNewTasks(Context context, JSONArray list, String geohash) throws JSONException {
        ArrayList<Task> tasks = new ArrayList<>();
        for(int i = 0; i < list.length(); i++) {
            Location l = new Location("");
            l.distanceTo(new Location(""));


            tasks.add(new Task(list.getJSONObject(i)));
        }
        if (cache.containsKey(geohash)) {
            ArrayList<Task> newTasks = getNewTasks(tasks, cache.get(geohash));
            notifyNewTasks(context, newTasks);
            cache.put(geohash, tasks);
        } else {
            cache.put(geohash, tasks);
            notifyTasks(context, tasks);
        }

    }

    private void notifyNewTasks(Context context, ArrayList<Task> tasks) {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle("Agorask")
                        .setContentText("There is " + tasks.size() + " tasks near you!");
        showNotification(context, mBuilder);

    }
    private void notifyTasks(Context context, ArrayList<Task> tasks) {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(context)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setContentTitle("Agorask")
                        .setContentText("There is " + tasks.size() + " tasks near you!");
        showNotification(context, mBuilder);

    }

    private void showNotification(Context context, NotificationCompat.Builder mBuilder) {
        android.app.NotificationManager notificationManager =
                (android.app.NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(NOTIF_ID, mBuilder.build());

    }

    private ArrayList<Task> getNewTasks(ArrayList<Task> current, ArrayList<Task> previous) {
        ArrayList<Task> newTasks = new ArrayList<>();
        for(Task task : current) {
            boolean found = false;
            for(Task pTask: previous) {
                if (task.equals(pTask)) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newTasks.add(task);
            }
        }
        return newTasks;
    }

    private void requestNewTasksIfNeeded(final Context context) {
        if ((System.currentTimeMillis() - lastRequest) * 60 * 1000 >= REQUEST_DELAY_MINUTES) {
            requestNewTasks(context);
        }
    }

    private void requestNewTasks(final Context context) {
        this.lastRequest = System.currentTimeMillis();
        Location location = AgoraskLocationSource.getInstance(context).getLastKnownLocation();
        OkHttpClient okClient = new OkHttpClient();
        if (location == null) return;
        final String geohash = GeoHash.encodeHash(location.getLatitude(), location.getLongitude(), GEOHASH_SIZE);

        String url = BuildConfig.API_URL + "?geohash=" + geohash + "&radius=" + RADIUS;
        if (token != null) {
            url += "&token=" + token;
        }
        Request request = new Request.Builder()
                .url(url)
                .build();

        okClient.newCall(request).enqueue(new Callback() {
            @Override public void onFailure(Call call, IOException e) {
                e.printStackTrace();
            }

            @Override public void onResponse(Call call, Response response) throws IOException {
                if (!response.isSuccessful()) throw new IOException("Unexpected code " + response);
                try {
                    JSONArray json = new JSONArray(response.body().string());
                    handleNewTasks(context, json, geohash);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        });
    }

    static class Task {
        public String id;
        public String title;

        Task(JSONObject json) throws JSONException {
            if (json.has("_id")) {
                id = json.getString("_id");
            }
            if (json.has("title")) {
                title = json.getString("title");
            }
        }

        @Override
        public boolean equals(Object obj) {
            return (obj instanceof Task && ((Task)obj).id.equals(this.id));
        }
    }
}
