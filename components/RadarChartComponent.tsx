import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RadarDataPoint } from '../types';

const data: RadarDataPoint[] = [
  { subject: 'Liderança', A: 60, B: 90, fullMark: 150 },
  { subject: 'Vendas', A: 90, B: 110, fullMark: 150 },
  { subject: 'Finanças', A: 120, B: 100, fullMark: 150 },
  { subject: 'Estratégia', A: 70, B: 120, fullMark: 150 },
  { subject: 'Tecnologia', A: 50, B: 100, fullMark: 150 },
  { subject: 'RH', A: 65, B: 85, fullMark: 150 },
];

export const RadarChartComponent: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid gridType="circle" stroke="#e2e8f0" />
        <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} 
        />
        <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
        <Radar
          name="Sua Empresa"
          dataKey="A"
          stroke="#135bec"
          strokeWidth={3}
          fill="#135bec"
          fillOpacity={0.2}
        />
        <Radar
          name="Alta Performance"
          dataKey="B"
          stroke="#94a3b8"
          strokeWidth={2}
          strokeDasharray="4 4"
          fill="transparent"
          fillOpacity={0}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};