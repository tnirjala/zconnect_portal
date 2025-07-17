import React, { useEffect, useState } from 'react';

const UserMoodList = () => {
  const [moods, setMoods] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:5000/api/counselor/moods')
      .then(res => res.json())
      .then(data => {
        if (data.success) setMoods(data.moods);
      })
      .catch(err => console.error('Mood fetch failed', err));
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 p-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
          User Mood Logs
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gradient-to-r from-pink-200 to-rose-200">
              <tr>
                <th className="border border-pink-300 p-3 text-left font-semibold text-pink-800">Name</th>
                <th className="border border-pink-300 p-3 text-left font-semibold text-pink-800">Email</th>
                <th className="border border-pink-300 p-3 text-left font-semibold text-pink-800">Mood</th>
                <th className="border border-pink-300 p-3 text-left font-semibold text-pink-800">Logged At</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {moods.map((mood, index) => (
                <tr key={mood.id} className={`hover:bg-pink-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-pink-25' : 'bg-white'}`}>
                  <td className="border border-pink-200 p-3 text-gray-800">{mood.name}</td>
                  <td className="border border-pink-200 p-3 text-gray-800">{mood.email}</td>
                  <td className="border border-pink-200 p-3 capitalize">
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-400 to-rose-400 text-white">
                      {mood.mood_today}
                    </span>
                  </td>
                  <td className="border border-pink-200 p-3 text-gray-600">
                    {new Date(mood.last_mood_logged).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {moods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-pink-600 text-lg">No mood logs found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMoodList;