import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class SmartClipboardOverlayModule : Module() {
    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "React context is not available" }

    companion object {
        private var instance: SmartClipboardOverlayModule? = null

        fun onBubbleClick() {
            instance?.sendEvent("onBubbleClick")
        }
    }

    override fun definition() = ModuleDefinition {
        Name("SmartClipboardOverlay")

        Events("onBubbleClick")

        OnCreate {
            instance = this@SmartClipboardOverlayModule
        }

        OnDestroy {
            instance = null
        }

        Function("showBubble") {
            BubbleService.startService(context)
        }

        Function("hideBubble") {
            BubbleService.stopService(context)
        }

        Function("isBubbleVisible") {
            // Check implementation would be here
            true
        }
    }
}
