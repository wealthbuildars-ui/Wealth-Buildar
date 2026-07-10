# Add project-specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/share/android-sdk/tools/proguard/proguard-android.txt
# You can edit the include path and change the file name in build.gradle.

# Keep WebView JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep classes loaded by WebView chrome/chrome-clients
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void *(...);
}

-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(...);
}
