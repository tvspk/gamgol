package app.gamgol.substation;

import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Nothing outside the app's own page is ever loaded. */
public class LocalOnlyClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
        return !r.getUrl().toString().startsWith("file:///android_asset/");
    }
}
