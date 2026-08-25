import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import useTheme from "../../../hooks/useTheme";

import "./ProductionChart.css";

function ProductionChart({ data }) {

    const { theme } = useTheme();

    const isDark = theme === "dark";

    return (

        <div className="chart-card">

            <h2>

                Solar Production

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <LineChart
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
                        dataKey="month"
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

                    <Line
                        type="monotone"
                        dataKey="production"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{
                            r: 4,
                        }}
                        activeDot={{
                            r: 7,
                        }}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default ProductionChart;