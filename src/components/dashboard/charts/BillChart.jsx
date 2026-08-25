import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import useTheme from "../../../hooks/useTheme";

import "./BillChart.css";

function BillChart({ data }) {

    const { theme } = useTheme();

    const isDark = theme === "dark";

    return (

        <div className="chart-card">

            <h2>

                WAPDA Bill Trend

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <AreaChart
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

                    <Area
                        type="monotone"
                        dataKey="bill"
                        stroke="#f59e0b"
                        fill="#fde68a"
                        strokeWidth={3}
                    />

                </AreaChart>

            </ResponsiveContainer>

        </div>

    );

}

export default BillChart;