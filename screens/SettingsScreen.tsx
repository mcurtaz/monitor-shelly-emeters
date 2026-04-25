import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme, Colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({}: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = makeStyles(theme.colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Pressable
        onPress={toggleTheme}
        style={({ pressed }) => [styles.toggleButton, pressed && styles.pressed]}
      >
        <Text style={styles.toggleText}>
          {isDark ? '☀️  Switch to Light' : '🌙  Switch to Dark'}
        </Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
    },
    title: {
      fontSize: 24,
      color: colors.text,
    },
    toggleButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pressed: {
      opacity: 0.6,
    },
    toggleText: {
      fontSize: 16,
      color: colors.text,
    },
  });
