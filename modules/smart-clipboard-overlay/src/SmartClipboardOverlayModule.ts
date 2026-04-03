import { requireNativeModule, EventEmitter, EventSubscription } from 'expo-modules-core';
import { SmartClipboardOverlayEvents } from './SmartClipboardOverlay.types';

const nativeModule = requireNativeModule('SmartClipboardOverlay');
const emitter = new EventEmitter<SmartClipboardOverlayEvents>(nativeModule);

const SmartClipboardOverlay = {
  showBubble(): void {
    nativeModule.showBubble();
  },

  hideBubble(): void {
    nativeModule.hideBubble();
  },

  isBubbleVisible(): boolean {
    return nativeModule.isBubbleVisible();
  },

  addBubbleClickListener(listener: () => void): EventSubscription {
    return emitter.addListener('onBubbleClick', listener);
  },
};

export default SmartClipboardOverlay;
