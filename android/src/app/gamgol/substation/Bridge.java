package app.gamgol.substation;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import java.util.Locale;

/** Lets the game copy a transfer code to the clipboard, match the system bars, and speak Korean
 *  with the phone's own voice (Mnemo Hooks words that have no recording); app version and download of a new version. */
public class Bridge implements TextToSpeech.OnInitListener {
    private final Context ctx;
    private TextToSpeech tts;
    private volatile boolean ttsOk = false;

    public Bridge(Context ctx) {
        this.ctx = ctx;
        try { tts = new TextToSpeech(ctx.getApplicationContext(), this); } catch (Exception e) { tts = null; }
    }

    @Override
    public void onInit(int status) {
        if (status != TextToSpeech.SUCCESS || tts == null) return;
        int r = tts.setLanguage(Locale.KOREAN);
        ttsOk = r != TextToSpeech.LANG_MISSING_DATA && r != TextToSpeech.LANG_NOT_SUPPORTED;
        if (ttsOk) tts.setSpeechRate(0.9f);
    }

    @JavascriptInterface
    public boolean ttsKo() { return ttsOk; }

    @JavascriptInterface
    public void say(String text) { if (ttsOk && tts != null) tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "mh"); }

    @JavascriptInterface
    public void hush() { if (tts != null) tts.stop(); }

    public void shutdown() { if (tts != null) { tts.shutdown(); tts = null; ttsOk = false; } }

    @JavascriptInterface
    public void copy(String text) {
        ClipboardManager cm = (ClipboardManager) ctx.getSystemService(Context.CLIPBOARD_SERVICE);
        if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("Gamgol transfer code", text));
    }

    /** versionName of the installed app (the page compares it with the latest release on GitHub). */
    @JavascriptInterface
    public String version() {
        try { return ctx.getPackageManager().getPackageInfo(ctx.getPackageName(), 0).versionName; }
        catch (Exception e) { return ""; }
    }

    /** Opens a release download in the browser: only this project's releases on GitHub. */
    @JavascriptInterface
    public void open(String url) {
        if (url == null || !url.startsWith("https://github.com/tvspk/gamgol/releases/") || !(ctx instanceof MainActivity)) return;
        MainActivity a = (MainActivity) ctx;
        a.runOnUiThread(new OpenTask(a, url));
    }

    /** Matches the system bars and the page background to the chosen look. */
    @JavascriptInterface
    public void setDark(final boolean dark) {
        if (ctx instanceof MainActivity) {
            final MainActivity a = (MainActivity) ctx;
            a.runOnUiThread(new ThemeRunner(a, dark));
        }
    }
}
