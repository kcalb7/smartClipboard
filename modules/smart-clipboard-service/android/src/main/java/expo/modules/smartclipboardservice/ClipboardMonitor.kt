package expo.modules.smartclipboardservice

import android.content.ClipboardManager
import android.content.Context
import android.util.Log

class ClipboardMonitor(private val context: Context) {
    private val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    private val listener = ClipboardManager.OnPrimaryClipChangedListener {
        onPrimaryClipChanged()
    }

    private var isMonitoring = false

    fun startMonitoring() {
        if (!isMonitoring) {
            clipboardManager.addPrimaryClipChangedListener(listener)
            isMonitoring = true
        }
    }

    fun stopMonitoring() {
        if (isMonitoring) {
            clipboardManager.removePrimaryClipChangedListener(listener)
            isMonitoring = false
        }
    }

    private fun onPrimaryClipChanged() {
        val clip = clipboardManager.primaryClip
        if (clip != null && clip.itemCount > 0) {
            val text = clip.getItemAt(0).text?.toString()
            if (text != null) {
                // Emit event to JS layer or process here logic
                Log.d("ClipboardMonitor", "Detected clip: $text")
                // In a real scenario, we would trigger an event using the Expo Module API
                // For now, it will be handled via the Module class.
                SmartClipboardServiceModule.onClipChange(text)
            }
        }
    }
}
