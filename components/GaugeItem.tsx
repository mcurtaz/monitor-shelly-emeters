import { type ComponentProps } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface ArcGaugeProps {
	value: number;
	min: number;
	max: number;
	size: number;
	strokeWidth?: number;
	trackColor: string;
	valueColor: string;
}

export interface GaugeItemProps {
	value: number;
	min: number;
	max: number;
	size: number;
	strokeWidth?: number;
	trackColor: string;
	valueColor: string;
	iconName: IoniconName;
	iconColor: string;
	labelColor: string;
}

function buildArcPath(
	cx: number,
	cy: number,
	r: number,
	startGaugeDeg: number,
	endGaugeDeg: number,
): string {
	// gauge degrees: 0 = leftmost (min), 180 = rightmost (max), arc curves upward
	// maps to standard math angle: stdDeg = 180 - gaugeDeg
	const toRad = (gaugeDeg: number) => ((180 - gaugeDeg) * Math.PI) / 180;
	const sx = cx + r * Math.cos(toRad(startGaugeDeg));
	const sy = cy - r * Math.sin(toRad(startGaugeDeg));
	const ex = cx + r * Math.cos(toRad(endGaugeDeg));
	const ey = cy - r * Math.sin(toRad(endGaugeDeg));
	const largeArc = endGaugeDeg - startGaugeDeg > 180 ? 1 : 0;
	// sweep=0 (CCW in SVG y-down space) → arc goes upward through the top
	return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 0 ${ex} ${ey}`;
}

export function ArcGauge({ value, min, max, size, strokeWidth = 12, trackColor, valueColor }: ArcGaugeProps) {
	const cx = size / 2;
	const cy = size / 2;
	const r = size / 2 - strokeWidth;
	const svgHeight = size / 2 + strokeWidth;

	const clamped = Math.min(max, Math.max(min, value));
	const gaugeAngle = ((clamped - min) / (max - min)) * 180;

	const bgPath = buildArcPath(cx, cy, r, 0, 180);
	const valuePath = gaugeAngle > 0 ? buildArcPath(cx, cy, r, 0, gaugeAngle) : null;

	return (
		<Svg width={size} height={svgHeight}>
			<Path
				d={bgPath}
				stroke={trackColor}
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				fill="none"
			/>
			{valuePath && (
				<Path
					d={valuePath}
					stroke={valueColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					fill="none"
				/>
			)}
		</Svg>
	);
}

export function GaugeItem({ value, min, max, size, strokeWidth, trackColor, valueColor, iconName, iconColor, labelColor }: GaugeItemProps) {
	const kw = (value / 1000).toFixed(2);
	return (
		<View style={{ alignItems: 'center' }}>
			<ArcGauge
				value={value}
				min={min}
				max={max}
				size={size}
				strokeWidth={strokeWidth}
				trackColor={trackColor}
				valueColor={valueColor}
			/>
			<Ionicons name={iconName} size={20} color={iconColor} style={{ marginTop: 6 }} />
			<Text style={{ color: labelColor, fontSize: 13, marginTop: 2 }}>{kw} kW</Text>
		</View>
	);
}
