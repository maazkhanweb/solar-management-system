import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import useTheme from "../../../hooks/useTheme";

import "./AIChart.css";

function AIChart({ data }) {

    const { theme } = useTheme();

    const isDark = theme === "dark";

    const COLORS = [
        "#22c55e",
        "#3b82f6",
        "#f59e0b",
        "#ef4444",
    ];

    return (

        <div className="chart-card">

            <h2>

                AI Performance Analysis

            </h2>

            <ResponsiveContainer
                width="100%"
                height={300}
            >

                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={{
                            fill: isDark
                                ? "#ffffff"
                                : "#0f172a",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >

                        {

                            data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[
                                            index % COLORS.length
                                        ]
                                    }
                                />

                            ))

                        }

                    </Pie>

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

                    <Legend
                        wrapperStyle={{
                            color: isDark
                                ? "#ffffff"
                                : "#0f172a",
                            fontSize: 14,
                        }}
                    />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default AIChart;