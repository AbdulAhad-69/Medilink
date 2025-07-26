package com.austrianpainter.medilink;

import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

/**
 * MediLink Splash Screen
 * Displays the app logo with animations before launching main app
 */
public class SplashActivity extends AppCompatActivity {
    
    private static final int SPLASH_DURATION = 3000; // 3 seconds
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Create splash layout programmatically
        createSplashLayout();
        
        // Start animations
        startAnimations();
        
        // Auto-transition to main activity
        new Handler().postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        }, SPLASH_DURATION);
    }
    
    private void createSplashLayout() {
        // Set background color
        getWindow().getDecorView().setBackgroundColor(
            ContextCompat.getColor(this, R.color.medilink_charcoal));
        
        // Create main container
        android.widget.LinearLayout mainLayout = new android.widget.LinearLayout(this);
        mainLayout.setOrientation(android.widget.LinearLayout.VERTICAL);
        mainLayout.setGravity(android.view.Gravity.CENTER);
        mainLayout.setPadding(50, 0, 50, 0);
        
        // Create blood drop icon (using a red circle as placeholder)
        ImageView bloodDropIcon = new ImageView(this);
        bloodDropIcon.setId(View.generateViewId());
        
        // Create a red circle drawable for blood drop
        android.graphics.drawable.GradientDrawable bloodDrop = new android.graphics.drawable.GradientDrawable();
        bloodDrop.setShape(android.graphics.drawable.GradientDrawable.OVAL);
        bloodDrop.setColor(ContextCompat.getColor(this, R.color.medilink_red));
        bloodDrop.setSize(200, 200);
        
        bloodDropIcon.setImageDrawable(bloodDrop);
        android.widget.LinearLayout.LayoutParams iconParams = 
            new android.widget.LinearLayout.LayoutParams(200, 200);
        iconParams.setMargins(0, 0, 0, 50);
        bloodDropIcon.setLayoutParams(iconParams);
        
        // Create app name
        TextView appName = new TextView(this);
        appName.setText("MediLink");
        appName.setTextColor(ContextCompat.getColor(this, R.color.white));
        appName.setTextSize(36);
        appName.setTypeface(android.graphics.Typeface.DEFAULT_BOLD);
        appName.setGravity(android.view.Gravity.CENTER);
        android.widget.LinearLayout.LayoutParams nameParams = 
            new android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
        nameParams.setMargins(0, 0, 0, 20);
        appName.setLayoutParams(nameParams);
        
        // Create tagline
        TextView tagline = new TextView(this);
        tagline.setText("\"Your Health. Our Mission.\"");
        tagline.setTextColor(ContextCompat.getColor(this, R.color.medilink_gray));
        tagline.setTextSize(16);
        tagline.setTypeface(android.graphics.Typeface.DEFAULT, android.graphics.Typeface.ITALIC);
        tagline.setGravity(android.view.Gravity.CENTER);
        android.widget.LinearLayout.LayoutParams taglineParams = 
            new android.widget.LinearLayout.LayoutParams(
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT,
                android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
        taglineParams.setMargins(0, 0, 0, 100);
        tagline.setLayoutParams(taglineParams);
        
        // Create loading indicator
        android.widget.ProgressBar progressBar = new android.widget.ProgressBar(this);
        progressBar.setIndeterminate(true);
        progressBar.getIndeterminateDrawable().setColorFilter(
            ContextCompat.getColor(this, R.color.medilink_red),
            android.graphics.PorterDuff.Mode.SRC_IN);
        
        // Add views to layout
        mainLayout.addView(bloodDropIcon);
        mainLayout.addView(appName);
        mainLayout.addView(tagline);
        mainLayout.addView(progressBar);
        
        setContentView(mainLayout);
        
        // Store references for animations
        bloodDropIcon.setTag("bloodDrop");
        appName.setTag("appName");
        tagline.setTag("tagline");
    }
    
    private void startAnimations() {
        View bloodDrop = findViewWithTag("bloodDrop");
        View appName = findViewWithTag("appName");
        View tagline = findViewWithTag("tagline");
        
        // Blood drop pulse animation
        if (bloodDrop != null) {
            ObjectAnimator pulseAnimator = ObjectAnimator.ofFloat(bloodDrop, "scaleX", 1.0f, 1.2f, 1.0f);
            pulseAnimator.setDuration(1500);
            pulseAnimator.setRepeatCount(ObjectAnimator.INFINITE);
            pulseAnimator.setInterpolator(new DecelerateInterpolator());
            pulseAnimator.start();
            
            ObjectAnimator pulseAnimatorY = ObjectAnimator.ofFloat(bloodDrop, "scaleY", 1.0f, 1.2f, 1.0f);
            pulseAnimatorY.setDuration(1500);
            pulseAnimatorY.setRepeatCount(ObjectAnimator.INFINITE);
            pulseAnimatorY.setInterpolator(new DecelerateInterpolator());
            pulseAnimatorY.start();
        }
        
        // Fade in animations
        if (appName != null) {
            appName.setAlpha(0f);
            ObjectAnimator fadeInName = ObjectAnimator.ofFloat(appName, "alpha", 0f, 1f);
            fadeInName.setDuration(1000);
            fadeInName.setStartDelay(500);
            fadeInName.start();
        }
        
        if (tagline != null) {
            tagline.setAlpha(0f);
            ObjectAnimator fadeInTagline = ObjectAnimator.ofFloat(tagline, "alpha", 0f, 1f);
            fadeInTagline.setDuration(1000);
            fadeInTagline.setStartDelay(1000);
            fadeInTagline.start();
        }
    }
}