import { requireNativeModule, EventEmitter, EventSubscription } from 'expo-modules-core';
import { ChangePayload, SmartClipboardServiceEvents } from './SmartClipboardService.types';

const nativeModule = requireNativeModule('SmartClipboardService');
const emitter = new EventEmitter<SmartClipboardServiceEvents>(nativeModule);

const SmartClipboardService = {
  startService(): void {
    nativeModule.startService();
  },

  stopService(): void {
    nativeModule.stopService();
  },

  isServiceRunning(): boolean {
    return nativeModule.isServiceRunning();
  },

  addClipChangeListener(listener: (event: ChangePayload) => void): EventSubscription {
    return emitter.addListener('onClipChange', listener);
  },
};

export default SmartClipboardService;
