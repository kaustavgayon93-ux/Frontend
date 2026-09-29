import os
import shutil

base_dir = r"C:\Users\kaust\.gemini\antigravity\scratch\mrvfrontend"
android_dir = os.path.join(base_dir, "android")
src_source = os.path.join(base_dir, "android-source", "source")

if os.path.exists(android_dir):
    shutil.rmtree(android_dir)

os.makedirs(android_dir, exist_ok=True)

# Copy gradle wrapper & scripts
shutil.copytree(os.path.join(src_source, "gradle"), os.path.join(android_dir, "gradle"))
shutil.copy(os.path.join(src_source, "gradlew"), android_dir)
shutil.copy(os.path.join(src_source, "gradlew.bat"), android_dir)
shutil.copy(os.path.join(src_source, "gradle.properties"), android_dir)
shutil.copy(os.path.join(src_source, "settings.gradle"), android_dir)
shutil.copy(os.path.join(src_source, "signingKey.keystore"), android_dir)

# Top level build.gradle
top_build_gradle = """buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.4.0'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
"""
with open(os.path.join(android_dir, "build.gradle"), "w", encoding="utf-8") as f:
    f.write(top_build_gradle)

# app directory
app_dir = os.path.join(android_dir, "app")
os.makedirs(app_dir, exist_ok=True)

# Copy signing keystore to app as well
shutil.copy(os.path.join(src_source, "signingKey.keystore"), os.path.join(app_dir, "signingKey.keystore"))

# app/build.gradle
app_build_gradle = """plugins {
    id 'com.android.application'
}

android {
    namespace 'in.gov.assam.assac.mrv'
    compileSdkVersion 34

    defaultConfig {
        applicationId 'in.gov.assam.assac.mrv'
        minSdkVersion 24
        targetSdkVersion 34
        versionCode 2
        versionName '2.0.0'
    }

    signingConfigs {
        release {
            storeFile file("signingKey.keystore")
            storePassword "CXhThGG5x58X"
            keyAlias "assac-mrv"
            keyPassword "CXhThGG5x58X"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            signingConfig signingConfigs.release
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'androidx.core:core:1.12.0'
    implementation 'com.google.android.material:material:1.11.0'
}
"""
with open(os.path.join(app_dir, "build.gradle"), "w", encoding="utf-8") as f:
    f.write(app_build_gradle)

# src/main
main_dir = os.path.join(app_dir, "src", "main")
os.makedirs(main_dir, exist_ok=True)

# Copy res/ (icons, splash, drawables)
res_src = os.path.join(src_source, "app", "src", "main", "res")
res_dst = os.path.join(main_dir, "res")
shutil.copytree(res_src, res_dst)

# AndroidManifest.xml
manifest_content = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="in.gov.assam.assac.mrv">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="ASSAC MRV Field"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.AppCompat.Light.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:screenOrientation="portrait">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
with open(os.path.join(main_dir, "AndroidManifest.xml"), "w", encoding="utf-8") as f:
    f.write(manifest_content)

# java MainActivity
java_pkg_dir = os.path.join(main_dir, "java", "in", "gov", "assam", "assac", "mrv")
os.makedirs(java_pkg_dir, exist_ok=True)

main_activity_code = """package in.gov.assam.assac.mrv;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends Activity {
    private WebView webView;
    private static final int PERMISSION_REQUEST_CODE = 1001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setGeolocationEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        webView.setWebViewClient(new WebViewClient());

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION
            }, PERMISSION_REQUEST_CODE);
        }

        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"""
with open(os.path.join(java_pkg_dir, "MainActivity.java"), "w", encoding="utf-8") as f:
    f.write(main_activity_code)

# Copy www assets
assets_dst = os.path.join(main_dir, "assets", "www")
os.makedirs(assets_dst, exist_ok=True)
shutil.copy(os.path.join(base_dir, "public", "field-collect-offline.html"), os.path.join(assets_dst, "index.html"))

print(f"[OK] Android project created successfully in {android_dir}")
