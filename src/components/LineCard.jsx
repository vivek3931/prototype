// src/components/LineCard.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function LineCard({ line, onReset }) {
  const isTripped = line.status === 'TRIPPED';
  const cardClass = isTripped ? 'line-card tripped' : 'line-card';

  return (
    <div className={cardClass}>
      <div className="card-header">
        <h4>{line.name}</h4>
        <span className={`status-badge ${isTripped ? 'status-tripped' : 'status-on'}`}>
          {line.status}
        </span>
      </div>
      <div className="card-body">
        <p className="voltage-reading">{line.voltage.toFixed(2)} V</p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={line.history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: '#ccc' }}/>
                <Tooltip 
                    contentStyle={{ backgroundColor: '#222', border: '1px solid #555' }}
                    labelStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="voltage" stroke={isTripped ? "#ff4d4d" : "#82ca9d"} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card-footer">
        <button onClick={() => onReset(line.id)} disabled={!isTripped}>
          Manual Reset
        </button>
      </div>
    </div>
  );
}

export default LineCard;