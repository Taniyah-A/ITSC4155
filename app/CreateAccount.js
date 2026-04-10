import React, { useState } from 'react';

const CreateProfile = () => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-[#FDF5E6] flex flex-col items-center p-8">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-10">
        <span className="font-bold text-gray-700">Adventure Academy</span>
        <button className="text-sm underline">Help</button>
      </div>

      <h2 className="text-3xl font-bold text-[#4A4A4A] mb-8">Create Your Profile</h2>

      {/* Avatar Selection Placeholder */}
      <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-[#70F3FF] flex items-center justify-center mb-6 overflow-hidden">
        <span className="text-gray-400 text-sm">Add Photo</span>
      </div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">Explorer Name</label>
          <input 
            type="text" 
            placeholder="e.g. BrainyExplorer20"
            className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[#70F3FF] outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Age</label>
            <input type="number" className="w-full p-4 rounded-2xl border-2 border-gray-200 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Grade</label>
            <select className="w-full p-4 rounded-2xl border-2 border-gray-200 outline-none bg-white">
              <option>1st Grade</option>
              <option>2nd Grade</option>
              <option>3rd Grade</option>
            </select>
          </div>
        </div>

        <button className="w-full bg-[#FF6B6B] text-white font-bold py-4 rounded-full text-xl shadow-lg hover:bg-red-500 transition-colors mt-4">
          Let's Go!
        </button>
      </div>
    </div>
  );
};

export default CreateProfile;