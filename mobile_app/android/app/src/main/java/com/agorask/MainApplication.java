package com.agorask;

import android.app.Application;

import com.agorask.notification.TaskChecker;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.microsoft.codepush.react.CodePush;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
  private TaskChecker taskChecker;

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new ReactMaterialKitPackage(),
            new ReactNativeConfigPackage(),
          new CustomPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
