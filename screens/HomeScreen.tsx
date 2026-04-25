import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme, Colors } from '../theme';
import { useSettings, Settings } from '../settings';
import { isValidUrl } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type PollConfig =
	| { active: true; url: string; interval: number }
	| { active: false };

function buildPollConfig(s: Settings): PollConfig {
	if (s.useCloud && isValidUrl(s.cloudUrl) && s.deviceId.trim() && s.authKey.trim()) {
		const url =
			`${s.cloudUrl}/device/status` +
			`?id=${encodeURIComponent(s.deviceId)}` +
			`&auth_key=${encodeURIComponent(s.authKey)}`;
		return { active: true, url, interval: 4000 };
	}
	if (!s.useCloud && s.localIp.trim()) {
		return { active: true, url: `http://${s.localIp}/status`, interval: 2500 };
	}
	return { active: false };
}

export default function HomeScreen({ navigation }: Props) {
	const { theme } = useTheme();
	const styles = makeStyles(theme.colors);
	const { settings } = useSettings();

	const [data, setData] = useState<unknown>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const pollConfig = buildPollConfig(settings);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		if (!pollConfig.active || errorMsg !== null) {
			return;
		}

		const { url, interval } = pollConfig;

		async function poll(): Promise<void> {
			try {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`HTTP ${response.status}`);
				}
				const json: unknown = await response.json();
				setData(json);
			} catch (err) {
				if (intervalRef.current !== null) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
			}
		}

		poll();
		intervalRef.current = setInterval(poll, interval);

		return () => {
			if (intervalRef.current !== null) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [
		settings.useCloud,
		settings.cloudUrl,
		settings.authKey,
		settings.deviceId,
		settings.localIp,
		errorMsg,
	]);

	function dismissError(): void {
		setErrorMsg(null);
	}

	function goToSettings(): void {
		setErrorMsg(null);
		navigation.navigate('Settings');
	}

	return (
		<View style={styles.container}>
			<Text style={styles.placeholder}>
				{pollConfig.active ? 'Polling…' : 'Configure a device in Settings'}
			</Text>

			<Modal
				visible={errorMsg !== null}
				transparent
				animationType="fade"
				onRequestClose={dismissError}
			>
				<View style={styles.overlay}>
					<View style={styles.dialog}>
						<Text style={styles.dialogTitle}>Connection Error</Text>
						<Text style={styles.dialogMessage}>{errorMsg}</Text>
						<View style={styles.dialogActions}>
							<Pressable
								style={({ pressed }) => [
									styles.dialogButtonSecondary,
									pressed && styles.dialogButtonPressed,
								]}
								onPress={dismissError}
							>
								<Text style={styles.dialogButtonSecondaryText}>Dismiss</Text>
							</Pressable>
							<Pressable
								style={({ pressed }) => [
									styles.dialogButton,
									pressed && styles.dialogButtonPressed,
								]}
								onPress={goToSettings}
							>
								<Text style={styles.dialogButtonText}>Settings</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
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
		},
		placeholder: {
			fontSize: 16,
			color: colors.textSecondary,
		},
		overlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.5)',
			alignItems: 'center',
			justifyContent: 'center',
			padding: 32,
		},
		dialog: {
			width: '100%',
			backgroundColor: colors.surface,
			borderRadius: 12,
			borderWidth: 1,
			borderColor: colors.border,
			padding: 24,
			gap: 12,
		},
		dialogTitle: {
			fontSize: 18,
			fontWeight: '600',
			color: colors.text,
		},
		dialogMessage: {
			fontSize: 15,
			color: colors.textSecondary,
			lineHeight: 22,
		},
		dialogActions: {
			flexDirection: 'row',
			justifyContent: 'flex-end',
			gap: 8,
			marginTop: 4,
		},
		dialogButton: {
			backgroundColor: colors.primary,
			borderRadius: 8,
			paddingHorizontal: 20,
			paddingVertical: 10,
		},
		dialogButtonSecondary: {
			borderRadius: 8,
			paddingHorizontal: 20,
			paddingVertical: 10,
		},
		dialogButtonPressed: {
			opacity: 0.7,
		},
		dialogButtonText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.surface,
		},
		dialogButtonSecondaryText: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.textSecondary,
		},
	});
