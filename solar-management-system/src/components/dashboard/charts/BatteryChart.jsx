import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import useTheme from "../../../hooks/useTheme";

import "./BatteryChart.css";

function BatteryChart({ data }) {

    const { theme } = useTheme();

    const isDark = theme === "dark";

    return (

        <div className="chart-card">

            <h2>

                Battery Health

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <BarChart
                    data={data}
                >

                    <CartesianGrid
                        stroke={
                            isDark
                                ? "#334155"
                                : "#d1d5db"
                        }
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="battery"
                        stroke={
                            isDark
                                ? "#cbd5e1"
                                : "#475569"
                        }
                        tick={{
                            fill: isDark
                                ? "#cbd5e1"
                                : "#475569",
                        }}
                    />

                    <YAxis
                        stroke={
                            isDark
                                ? "#cbd5e1"
                                : "#475569"
                        }
                        tick={{
                            fill: isDark
                                ? "#cbd5e1"
                                : "#475569",
                        }}
                    />

                    <Tooltip
                        contentStyle={{
                            background: isDark
                                ? "#1e293b"
                                : "#ffffff",
                            border: isDark
                                ? "1px solid #334155"
                                : "1px solid #e2e8f0",
                            borderRadius: "10px",
                            color: isDark
                                ? "#ffffff"
                                : "#0f172a",
                        }}
                        labelStyle={{
                            color: isDark
                                ? "#ffffff"
                                : "#0f172a",
                        }}
                    />

                    <Bar
                        dataKey="health"
                        fill="#16a34a"
                        radius={[6, 6, 0, 0]}
                    />

                </BarChart>

            </ResponsiveContainer>

        </div>

    );

}

export default BatteryChart;