package expo.modules.smartclipboardservice

import android.content.ClipboardManager
import android.content.Context
import android.util.Log

class ClipboardMonitor(private val context: Context) {
    private val TAG = "ClipboardMonitor"
    private val clipboardManager = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager

    private val listener = ClipboardManager.OnPrimaryClipChangedListener {
        onPrimaryClipChanged()
    }

    private var isMonitoring = false

    fun startMonitoring() {
        if (!isMonitoring) {
            clipboardManager.addPrimaryClipChangedListener(listener)
            isMonitoring = true
            Log.d(TAG, "Clipboard monitoring started")
        }
    }

    fun stopMonitoring() {
        if (isMonitoring) {
            clipboardManager.removePrimaryClipChangedListener(listener)
            isMonitoring = false
            Log.d(TAG, "Clipboard monitoring stopped")
        }
    }

    private fun onPrimaryClipChanged() {
        try {
            val clip = clipboardManager.primaryClip
            if (clip != null && clip.itemCount > 0) {
                val text = clip.getItemAt(0).text?.toString()
                if (!text.isNullOrBlank()) {
                    Log.d(TAG, "New clip detected (length=${text.length})")
                    SmartClipboardServiceModule.onClipChange(text)
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error reading clipboard: ${e.message}")
        }
    }
}
