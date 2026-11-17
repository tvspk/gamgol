package app.gamgol.substation;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
    WebView web;
    Bridge bridge;
    private CameraClient camera;   // camera only for scanning the sync pairing QR code

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setStatusBarColor(Color.parseColor("#28475b"));
        getWindow().setNavigationBarColor(Color.parseColor("#e9e0c8"));
        getWindow().getDecorView().setSystemUiVisibility(android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#e9e0c8"));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);          // localStorage keeps the progress
        s.setAllowFileAccess(true);
        s.setTextZoom(100);
        s.setMediaPlaybackRequiresUserGesture(false);   // a newsletter column plays sentence after sentence
        bridge = new Bridge(this);
        web.addJavascriptInterface(bridge, "AndroidApp");
        web.setWebViewClient(new LocalOnlyClient());
        camera = new CameraClient(this);
        web.setWebChromeClient(camera);
        setContentView(web);
        if (saved != null) web.restoreState(saved);
        else web.loadUrl("file:///android_asset/index.html");
    }

    /** Leaving the app: write any progress still waiting in the save timer, and upload it at once when sync is on
     *  (a quick upload, before Android may stop the process). */
    @Override
    protected void onPause() {
        if (web != null) web.evaluateJavascript("try{window.__flush&&window.__flush()}catch(e){}try{window.__syLeave&&window.__syLeave()}catch(e){}", null);
        super.onPause();
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] results) {
        if (req == CameraClient.REQ_CAMERA && camera != null) camera.permissionResult();
    }

    @Override
    protected void onDestroy() {
        if (bridge != null) bridge.shutdown();
        super.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("window.__appBack ? window.__appBack() : false", new BackResult(this));
    }
}
