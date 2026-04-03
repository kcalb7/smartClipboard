package expo.modules.smartclipboardoverlay

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.util.Log
import android.view.Gravity
import android.view.WindowManager

class BubbleService : Service() {
    private val TAG = "BubbleService"
    private lateinit var windowManager: WindowManager
    private var bubbleView: BubbleView? = null

    companion object {
        fun startService(context: Context) {
            val intent = Intent(context, BubbleService::class.java)
            context.startService(intent)
        }

        fun stopService(context: Context) {
            val intent = Intent(context, BubbleService::class.java)
            context.stopService(intent)
        }
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        showBubble()
    }

    private fun showBubble() {
        if (bubbleView != null) return

        val overlayType = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        else
            @Suppress("DEPRECATION")
            WindowManager.LayoutParams.TYPE_PHONE

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            overlayType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                    or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                    or WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 0
            y = 200
        }

        try {
            bubbleView = BubbleView(this, windowManager, params)
            windowManager.addView(bubbleView, params)
            Log.d(TAG, "Bubble shown")
        } catch (e: Exception) {
            Log.e(TAG, "Failed to show bubble: ${e.message}")
            bubbleView = null
        }
    }

    override fun onDestroy() {
        hideBubble()
        super.onDestroy()
    }

    private fun hideBubble() {
        bubbleView?.let { view ->
            try {
                if (view.isAttachedToWindow) {
                    windowManager.removeView(view)
                    Log.d(TAG, "Bubble hidden")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Failed to remove bubble view: ${e.message}")
            } finally {
                bubbleView = null
            }
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
