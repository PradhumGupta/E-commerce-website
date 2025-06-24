import { BarChart2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function AnalyticsTab() {
  // Dummy data for the analytics graph
  const analyticsData = [
    { name: "Jan", Sales: 4000, Revenue: 2400 },
    { name: "Feb", Sales: 3000, Revenue: 1398 },
    { name: "Mar", Sales: 2000, Revenue: 9800 },
    { name: "Apr", Sales: 2780, Revenue: 3908 },
    { name: "May", Sales: 1890, Revenue: 4800 },
    { name: "Jun", Sales: 2390, Revenue: 3800 },
    { name: "Jul", Sales: 3490, Revenue: 4300 },
  ];
  return (
    <>
      <h3 className="card-title text-2xl font-bold mb-4 flex items-center gap-2">
        <BarChart2 className="size-6 text-primary" /> Sales & Revenue Analytics
      </h3>
      <p className="text-base-content/70 mb-6">
        Overview of sales and revenue trends over the last few months.
      </p>
      <div className="h-80 w-full">
        {" "}
        {/* Responsive container for the chart */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={analyticsData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <YAxis
              stroke="currentColor"
              tick={{ fill: "currentColor", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--fallback-b1,oklch(var(--b1)/1))",
                border: "none",
                borderRadius: "0.5rem",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "var(--fallback-bc,oklch(var(--bc)/1))" }}
              itemStyle={{ color: "var(--fallback-bc,oklch(var(--bc)/1))" }}
              cursor={{
                stroke: "currentColor",
                strokeWidth: 1,
                strokeOpacity: 0.3,
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
                color: "var(--fallback-bc,oklch(var(--bc)/1))",
              }}
            />
            <Line
              type="monotone"
              dataKey="Sales"
              stroke="oklch(var(--p))" // Use DaisyUI primary color
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="oklch(var(--s))" // Use DaisyUI secondary color
              strokeWidth={2}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

export default AnalyticsTab;
