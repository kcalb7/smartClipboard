const { withAndroidManifest, withPlugins } = require('@expo/config-plugins');

const withSmartClipboardManifest = (config) => {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    // Add permissions
    const permissions = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.POST_NOTIFICATIONS',
    ];

    if (!androidManifest['uses-permission']) {
      androidManifest['uses-permission'] = [];
    }

    permissions.forEach((permission) => {
      if (!androidManifest['uses-permission'].find((p) => p.$['android:name'] === permission)) {
        androidManifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    });

    // Add services
    const application = androidManifest.application[0];
    if (!application.service) {
      application.service = [];
    }

    const services = [
      {
        name: 'expo.modules.smartclipboardservice.ClipboardForegroundService',
        foregroundServiceType: 'specialUse', // Or another appropriate type
      },
      {
        name: 'expo.modules.smartclipboardoverlay.BubbleService',
      },
    ];

    services.forEach((service) => {
      if (!application.service.find((s) => s.$['android:name'] === service.name)) {
        const serviceEntry = {
          $: {
            'android:name': service.name,
            'android:exported': 'false',
          },
        };
        if (service.foregroundServiceType) {
          serviceEntry.$['android:foregroundServiceType'] = service.foregroundServiceType;
        }
        application.service.push(serviceEntry);
      }
    });

    return config;
  });
};

module.exports = (config) => {
  return withPlugins(config, [withSmartClipboardManifest]);
};
