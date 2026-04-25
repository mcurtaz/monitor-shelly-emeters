import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme, Colors } from '../theme';
import { useSettings } from '../settings';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({}: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors } = theme;
  const styles = makeStyles(colors);

  const { settings, updateSettings } = useSettings();

  const [cloudUrl, setCloudUrl] = useState(settings.cloudUrl);
  const [authKey, setAuthKey] = useState(settings.authKey);
  const [deviceId, setDeviceId] = useState(settings.deviceId);
  const [localIp, setLocalIp] = useState(settings.localIp);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      <Text style={styles.sectionLabel}>GENERAL</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>CLOUD</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Use Cloud</Text>
          <Switch
            value={settings.useCloud}
            onValueChange={v => updateSettings({ useCloud: v })}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          placeholder="Cloud URL"
          placeholderTextColor={colors.textSecondary}
          value={cloudUrl}
          onChangeText={setCloudUrl}
          onBlur={() => updateSettings({ cloudUrl })}
          autoCapitalize="none"
          keyboardType="url"
        />
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          placeholder="Auth Key"
          placeholderTextColor={colors.textSecondary}
          value={authKey}
          onChangeText={setAuthKey}
          onBlur={() => updateSettings({ authKey })}
          autoCapitalize="none"
          secureTextEntry
        />
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          placeholder="Device ID"
          placeholderTextColor={colors.textSecondary}
          value={deviceId}
          onChangeText={setDeviceId}
          onBlur={() => updateSettings({ deviceId })}
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.sectionLabel}>LOCAL</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Local IP  (e.g. 192.168.1.100)"
          placeholderTextColor={colors.textSecondary}
          value={localIp}
          onChangeText={setLocalIp}
          onBlur={() => updateSettings({ localIp })}
          autoCapitalize="none"
          keyboardType="decimal-pad"
        />
      </View>

    </ScrollView>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      padding: 16,
      paddingBottom: 40,
      gap: 8,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      letterSpacing: 0.8,
      marginTop: 12,
      marginBottom: 4,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    rowLabel: {
      fontSize: 16,
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },
    input: {
      paddingHorizontal: 16,
      paddingVertical: 13,
      fontSize: 16,
      color: colors.text,
    },
  });
