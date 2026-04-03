package expo.modules.smartclipboardservice

import android.app.ActivityManager
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SmartClipboardServiceModule : Module() {
    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "React context is not available" }

    companion object {
        // WeakRef-style: null-safe singleton for event emission from native layer
        private var instance: SmartClipboardServiceModule? = null

        fun onClipChange(text: String) {
            instance?.sendEvent("onClipChange", mapOf("text" to text))
        }
    }

    override fun definition() = ModuleDefinition {
        Name("SmartClipboardService")

        Events("onClipChange")

        OnCreate {
            instance = this@SmartClipboardServiceModule
        }

        OnDestroy {
            instance = null
        }

        Function("startService") {
            ClipboardForegroundService.startService(context)
        }

        Function("stopService") {
            ClipboardForegroundService.stopService(context)
        }

        Function("isServiceRunning") {
            @Suppress("DEPRECATION")
            val manager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
            @Suppress("DEPRECATION")
            manager.getRunningServices(Integer.MAX_VALUE).any {
                it.service.className == ClipboardForegroundService::class.java.name
            }
        }
    }
}
