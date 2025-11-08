"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { semester: "2022.1", average: 7.2 },
  { semester: "2022.2", average: 7.4 },
  { semester: "2023.1", average: 7.6 },
  { semester: "2023.2", average: 7.7 },
  { semester: "2024.1", average: 7.8 },
]

export function PerformanceChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="semester" stroke="#64748b" fontSize={12} />
          <YAxis domain={[6.5, 8.5]} stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
            }}
          />
          <Line type="monotone" dataKey="average" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
