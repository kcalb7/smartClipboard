const { withAndroidManifest, withPlugins } = require('@expo/config-plugins');

const withSmartClipboardManifest = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;
    const application = androidManifest.application[0];

    // --- Permissions ---
    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    const permissions = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.FOREGROUND_SERVICE',
      // Required from Android 14 (API 34) onwards for foreground service type declaration
      'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
      'android.permission.POST_NOTIFICATIONS',
      // Required for clipboard access in foreground service on Android 10+
      'android.permission.READ_CLIPBOARD_IN_BACKGROUND',
    ];

    permissions.forEach((permission) => {
      const exists = androidManifest['uses-permission'].find(
        (p) => p.$['android:name'] === permission
      );
      if (!exists) {
        androidManifest['uses-permission'].push({ $: { 'android:name': permission } });
      }
    });

    // --- Services ---
    if (!application.service) {
      application.service = [];
    }

    const servicesToAdd = [
      {
        name: 'expo.modules.smartclipboardservice.ClipboardForegroundService',
        exported: 'false',
        // On Android 14+ you must declare a foregroundServiceType
        foregroundServiceType: 'specialUse',
      },
      {
        name: 'expo.modules.smartclipboardoverlay.BubbleService',
        exported: 'false',
      },
    ];

    servicesToAdd.forEach((svc) => {
      const exists = application.service.find(
        (s) => s.$['android:name'] === svc.name
      );
      if (!exists) {
        const entry = {
          $: {
            'android:name': svc.name,
            'android:exported': svc.exported,
          },
        };
        if (svc.foregroundServiceType) {
          entry.$['android:foregroundServiceType'] = svc.foregroundServiceType;
        }
        application.service.push(entry);
      }
    });

    return config;
  });
};

module.exports = (config) => {
  return withPlugins(config, [withSmartClipboardManifest]);
};
