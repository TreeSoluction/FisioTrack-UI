import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const COLORS = {
  primary: '#0891B2',
  secondary: '#7C3AED',
  accent: '#F97316',
};

export default function Chart({
  data,
  type = 'line',
  color = COLORS.primary,
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
}: ChartProps) {
  const textColor = 'var(--color-text-muted)';
  const gridColor = 'var(--color-border)';

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      fontSize: '14px',
      color: 'var(--color-text)',
    },
  };

  const axisProps = {
    tick: { fill: textColor, fontSize: 12 },
    axisLine: { stroke: gridColor },
    tickLine: false,
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'line' ? (
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          {showTooltip && <Tooltip {...tooltipStyle} />}
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      ) : (
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps} />
          {showTooltip && <Tooltip {...tooltipStyle} />}
          {showLegend && <Legend />}
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}

export { COLORS };
