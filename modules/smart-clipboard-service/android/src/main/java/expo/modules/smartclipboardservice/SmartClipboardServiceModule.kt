import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SmartClipboardServiceModule : Module() {
    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "React context is not available" }

    companion object {
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
            // Implementation of check would go here, simplified for now
            true 
        }
    }
}
