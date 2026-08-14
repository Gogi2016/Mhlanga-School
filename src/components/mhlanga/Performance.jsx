import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const DATA = [
  { year: '2023', enrollment: 96, passRate: 89 },
  { year: '2024', enrollment: 104, passRate: 96 },
  { year: '2025', enrollment: 112, passRate: 98 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="basalt-bg border border-white/15 p-3 text-xs">
      <div className="font-display text-sm mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === 'enrollment' ? 'Enrollment' : 'Pass Rate'}: {p.value}
          {p.dataKey === 'passRate' ? '%' : ' learners'}
        </div>
      ))}
    </div>
  );
}

export default function Performance() {
  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-14 reveal">
        <div className="lg:col-span-7">
          <p className="text-xs tracking-[0.3em] uppercase text-[#D27D2D] mb-5">Performance</p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            GRADE 12 SCHOOL PERFORMANCE<br /><span className="ochre">PAST THREE YEARS.</span>
          </h2>
        </div>
        <p className="lg:col-span-5 text-[#F4F4F4]/60 leading-relaxed">
          A record of rising outcomes across the Mtontsasa Circuit — enrollment growth and
          pass rate, side by side.
        </p>
      </div>

      <div className="reveal">
        <div className="h-80 sm:h-[26rem]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA} margin={{ top: 36, right: 10, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(244,244,244,0.08)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: 'rgba(244,244,244,0.6)', fontSize: 13, fontFamily: 'Archivo Black' }}
                axisLine={{ stroke: 'rgba(244,244,244,0.15)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(244,244,244,0.5)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 130]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,244,244,0.04)' }} />
              <Bar dataKey="enrollment" name="Enrollment" fill="#D27D2D" radius={[4, 4, 0, 0]} maxBarSize={56}>
                <LabelList dataKey="enrollment" position="top" fill="#D27D2D" fontSize={13} fontFamily="Archivo Black" />
              </Bar>
              <Bar dataKey="passRate" name="Pass Rate" fill="#00A3AD" radius={[4, 4, 0, 0]} maxBarSize={56}>
                <LabelList dataKey="passRate" position="top" fill="#00A3AD" fontSize={13} fontFamily="Archivo Black" formatter={(v) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-8 mt-8 text-sm text-[#F4F4F4]/75">
          <span className="flex items-center gap-2"><span className="w-4 h-4 bg-[#D27D2D]" /> Enrollment (learners)</span>
          <span className="flex items-center gap-2"><span className="w-4 h-4 bg-[#00A3AD]" /> Pass Rate (%)</span>
        </div>
      </div>
    </section>
  );
}