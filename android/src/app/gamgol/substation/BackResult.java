package app.gamgol.substation;

import android.app.Activity;
import android.webkit.ValueCallback;

/** Back button: the game goes back to the board first; on the board, the app goes to the background. */
/*  Raw type on purpose: with ValueCallback<String> javac 21+ writes a bridge method with an unnamed parameter,
 *  which the d8 version used here cannot read. */
@SuppressWarnings({"rawtypes", "unchecked"})
public class BackResult implements ValueCallback {
    private final Activity act;
    public BackResult(Activity act) { this.act = act; }

    @Override
    public void onReceiveValue(Object value) {
        if (!"true".equals(value)) act.moveTaskToBack(true);
    }
}
