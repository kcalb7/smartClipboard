import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Button, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Native Modules — typed wrappers
import SmartClipboardService from '@/modules/smart-clipboard-service';
import SmartClipboardOverlay from '@/modules/smart-clipboard-overlay';

export default function HomeScreen() {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev.slice(0, 19)]);
  };

  useEffect(() => {
    // Listen for clipboard changes using the typed wrapper
    const serviceSub = SmartClipboardService.addClipChangeListener((event) => {
      addLog(`📋 Clip: ${event.text}`);
    });

    // Listen for bubble clicks using the typed wrapper
    const overlaySub = SmartClipboardOverlay.addBubbleClickListener(() => {
      addLog('👆 Bubble clicada!');
    });

    return () => {
      serviceSub.remove();
      overlaySub.remove();
    };
  }, []);

  const clearLogs = () => setLogs([]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1565C0', dark: '#0D47A1' }}
      headerImage={
        <ThemedView style={styles.headerContent}>
           <ThemedText type="title" style={{ color: '#FFF' }}>SmartClipboard</ThemedText>
        </ThemedView>
      }>
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Debug Nativo</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.debugSection}>
        <ThemedText type="subtitle">Monitoramento (Service)</ThemedText>
        <View style={styles.buttonRow}>
          <Button title="Start Service" onPress={() => SmartClipboardService.startService()} color="#4CAF50" />
          <Button title="Stop Service" onPress={() => SmartClipboardService.stopService()} color="#F44336" />
        </View>

        <ThemedText type="subtitle">Bolha (Overlay)</ThemedText>
        <View style={styles.buttonRow}>
          <Button title="Show Bubble" onPress={() => SmartClipboardOverlay.showBubble()} color="#2196F3" />
          <Button title="Hide Bubble" onPress={() => SmartClipboardOverlay.hideBubble()} color="#9E9E9E" />
        </View>
      </ThemedView>

      <ThemedView style={styles.logContainer}>
        <View style={styles.logHeader}>
          <ThemedText type="defaultSemiBold">Logs de Eventos:</ThemedText>
          <Button title="Limpar" onPress={clearLogs} />
        </View>
        <View style={styles.logBox}>
          {logs.length === 0 ? (
            <ThemedText style={styles.emptyLog}>Nenhum evento detectado ainda.</ThemedText>
          ) : (
            logs.map((log, index) => (
              <ThemedText key={index} style={styles.logItem}>{log}</ThemedText>
            ))
          )}
        </View>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText type="defaultSemiBold">Importante:</ThemedText>
        <ThemedText>
          Para testar os módulos nativos, você precisa rodar:{'\n'}
          <ThemedText type="defaultSemiBold">npx expo run:android</ThemedText>{'\n'}
          (O Expo Go não suporta código nativo customizado).
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerContent: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1565C0',
  },
  debugSection: {
    gap: 12,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginVertical: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  logContainer: {
    gap: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logBox: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
  },
  logItem: {
    color: '#00FF00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    marginBottom: 4,
  },
  emptyLog: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: '#FFFBE6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE58F',
  },
});
