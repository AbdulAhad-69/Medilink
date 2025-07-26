package com.austrianpainter.medilink;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

/**
 * MediLink - Healthcare App for Android
 * "Your Health. Our Mission."
 * 
 * Main Activity that hosts the MediLink web app in a WebView
 * with native Android integrations for healthcare features.
 */
public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ValueCallback<Uri[]> fileUploadCallback;
    private static final int PERMISSION_REQUEST_CODE = 1001;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1002;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        
        // Create WebView programmatically for better control
        webView = new WebView(this);
        setContentView(webView);
        
        // Apply window insets for edge-to-edge display
        ViewCompat.setOnApplyWindowInsetsListener(webView, (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Request necessary permissions
        requestPermissions();
        
        // Setup WebView
        setupWebView();
        
        // Load MediLink app
        loadMediLinkApp();
    }

    /**
     * Setup WebView with healthcare app optimizations
     */
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript for full app functionality
        webSettings.setJavaScriptEnabled(true);
        
        // Enable DOM storage for app data
        webSettings.setDomStorageEnabled(true);
        
        // Enable database storage
        webSettings.setDatabaseEnabled(true);
        
        // Enable local storage
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Enable geolocation for donor mapping
        webSettings.setGeolocationEnabled(true);
        
        // Enable mixed content for medical APIs
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Optimize for mobile healthcare use
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setBuiltInZoomControls(false);
        webSettings.setDisplayZoomControls(false);
        
        // Set user agent for mobile optimization
        webSettings.setUserAgentString(webSettings.getUserAgentString() + " MediLink/1.0 Healthcare");

        // Setup WebViewClient for navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle emergency calls
                if (url.startsWith("tel:")) {
                    Intent intent = new Intent(Intent.ACTION_CALL);
                    intent.setData(Uri.parse(url));
                    if (ContextCompat.checkSelfPermission(MainActivity.this, 
                            Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
                        startActivity(intent);
                    } else {
                        Toast.makeText(MainActivity.this, "Call permission required for emergency calls", 
                                Toast.LENGTH_SHORT).show();
                    }
                    return true;
                }
                
                // Handle external links
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (!url.contains("localhost") && !url.contains("127.0.0.1")) {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                }
                
                return false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject Android-specific features
                injectAndroidFeatures();
            }
        });

        // Setup WebChromeClient for advanced features
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, 
                    GeolocationPermissions.Callback callback) {
                // Grant geolocation permission for donor mapping
                callback.invoke(origin, true, false);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Handle camera permission for prescription scanning
                request.grant(request.getResources());
            }

            @Override
            public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
                // Handle JavaScript alerts from MediLink
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_LONG).show();
                result.confirm();
                return true;
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                    FileChooserParams fileChooserParams) {
                // Handle file upload for prescription images
                fileUploadCallback = filePathCallback;
                
                Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                intent.addCategory(Intent.CATEGORY_OPENABLE);
                intent.setType("image/*");
                
                startActivityForResult(Intent.createChooser(intent, "Select Prescription Image"), 
                        FILE_CHOOSER_REQUEST_CODE);
                return true;
            }
        });

        // Add JavaScript interface for native Android features
        webView.addJavascriptInterface(new MediLinkAndroidInterface(), "MediLinkAndroid");
    }

    /**
     * Load the MediLink web app
     */
    private void loadMediLinkApp() {
        // Load from assets or local server
        String url = "file:///android_asset/medilink/index.html";
        webView.loadUrl(url);
    }

    /**
     * Inject Android-specific features into the web app
     */
    private void injectAndroidFeatures() {
        String androidFeatures = 
            "window.isAndroidApp = true;" +
            "window.androidVersion = '" + android.os.Build.VERSION.RELEASE + "';" +
            "console.log('MediLink Android features injected');";
        
        webView.evaluateJavascript(androidFeatures, null);
    }

    /**
     * JavaScript interface for Android native features
     */
    public class MediLinkAndroidInterface {
        
        @JavascriptInterface
        public void makeEmergencyCall(String phoneNumber) {
            runOnUiThread(() -> {
                Intent intent = new Intent(Intent.ACTION_CALL);
                intent.setData(Uri.parse("tel:" + phoneNumber));
                if (ContextCompat.checkSelfPermission(MainActivity.this, 
                        Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
                    startActivity(intent);
                } else {
                    Toast.makeText(MainActivity.this, "Emergency call permission required", 
                            Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void showToast(String message) {
            runOnUiThread(() -> {
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show();
            });
        }

        @JavascriptInterface
        public void vibrate(int milliseconds) {
            // Vibrate for emergency notifications
            android.os.Vibrator vibrator = (android.os.Vibrator) getSystemService(VIBRATOR_SERVICE);
            if (vibrator != null) {
                vibrator.vibrate(milliseconds);
            }
        }

        @JavascriptInterface
        public String getDeviceInfo() {
            return "Android " + android.os.Build.VERSION.RELEASE + " - " + android.os.Build.MODEL;
        }
    }

    /**
     * Request necessary permissions for healthcare features
     */
    private void requestPermissions() {
        String[] permissions = {
            Manifest.permission.CAMERA,
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.CALL_PHONE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.READ_EXTERNAL_STORAGE
        };

        ActivityCompat.requestPermissions(this, permissions, PERMISSION_REQUEST_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            
            if (allGranted) {
                Toast.makeText(this, "MediLink permissions granted - Full functionality enabled", 
                        Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Some permissions denied - Limited functionality", 
                        Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (fileUploadCallback != null) {
                Uri[] results = null;
                if (resultCode == RESULT_OK && data != null) {
                    results = new Uri[]{data.getData()};
                }
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}