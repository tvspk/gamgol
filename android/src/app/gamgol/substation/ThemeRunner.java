package app.gamgol.substation;

import android.graphics.Color;
import android.view.View;

/** Applies light or dark colours to the status bar, navigation bar and WebView. */
public class ThemeRunner implements Runnable {
    private final MainActivity a;
    private final boolean dark;
    public ThemeRunner(MainActivity a, boolean dark) { this.a = a; this.dark = dark; }

    @Override
    public void run() {
        a.getWindow().setStatusBarColor(Color.parseColor(dark ? "#1a2c38" : "#28475b"));
        a.getWindow().setNavigationBarColor(Color.parseColor(dark ? "#161d22" : "#e9e0c8"));
        if (a.web != null) a.web.setBackgroundColor(Color.parseColor(dark ? "#161d22" : "#e9e0c8"));
        View d = a.getWindow().getDecorView();
        int f = d.getSystemUiVisibility();
        if (dark) f &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR; else f |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        d.setSystemUiVisibility(f);
    }
}
