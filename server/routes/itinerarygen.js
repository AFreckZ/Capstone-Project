import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ItineraryGenerator = ({ userId }) => {
  // State for data from database
  const [activities, setActivities] = useState([]);
  const [preferences, setPreferences] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // User inputs
  const [budget, setBudget] = useState(300);
  const [customTimeSlots, setCustomTimeSlots] = useState([]);
  
  // Results
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  // Fetch all data from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [activitiesRes, preferencesRes, timeSlotsRes] = await Promise.all([
          axios.get(`/api/activities?userId=${userId}`),
          axios.get(`/api/preferences?userId=${userId}`),
          axios.get(`/api/time-slots?userId=${userId}`)
        ]);
        
        setActivities(activitiesRes.data);
        setPreferences(preferencesRes.data);
        setTimeSlots(timeSlotsRes.data);
        setCustomTimeSlots(timeSlotsRes.data); // Initialize with db time slots
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Utility functions
  const timeToMinutes = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const hasTimeConflict = (act1, act2) => {
    if (act1.date !== act2.date) return false;
    
    const start1 = timeToMinutes(act1.start_time);
    const end1 = start1 + act1.duration;
    const start2 = timeToMinutes(act2.start_time);
    const end2 = start2 + act2.duration;
    
    return !(end1 <= start2 || end2 <= start1);
  };

  const fitsPreferredSlot = (activity) => {
    return customTimeSlots.some(slot => {
      if (activity.date !== slot.date) return false;
      
      const actStart = timeToMinutes(activity.start_time);
      const actEnd = actStart + activity.duration;
      const slotStart = timeToMinutes(slot.start);
      const slotEnd = timeToMinutes(slot.end);
      
      return actStart >= slotStart && actEnd <= slotEnd;
    });
  };

  const calculatePreferenceScore = (activity) => {
    return activity.tags.reduce((score, tag) => {
      const normalizedTag = tag.toLowerCase()
        .replace(/[()\-]/g, '')
        .replace(/\s*s\b/g, '')
        .trim();
        
      const pref = preferences.find(p => 
        p.category_name.toLowerCase() === normalizedTag
      );
      return score + (pref ? pref.weight_value * 2 : 0);
    }, 0);
  };

  // Core algorithm
  const generateOptimalItinerary = () => {
    const algorithmSteps = [];
    
    // Step 1: Filter by preferred slots
    const filteredActivities = activities.filter(fitsPreferredSlot);
    algorithmSteps.push({
      step: "Filter by Preferred Slots",
      result: `Filtered to ${filteredActivities.length} activities`
    });

    // Step 2: Generate all valid combinations
    let bestCombo = [];
    let bestScore = 0;
    let bestCost = 0;

    // Helper function to generate combinations
    const getCombinations = (arr, size) => {
      const result = [];
      
      function combine(start, current) {
        if (current.length === size) {
          result.push([...current]);
          return;
        }
        
        for (let i = start; i < arr.length; i++) {
          current.push(arr[i]);
          combine(i + 1, current);
          current.pop();
        }
      }
      
      combine(0, []);
      return result;
    };

    for (let r = 1; r <= filteredActivities.length; r++) {
      const combinations = getCombinations(filteredActivities, r);
      
      for (const combo of combinations) {
        const totalCost = combo.reduce((sum, act) => sum + act.cost, 0);
        if (totalCost > budget) continue;

        // Check for time conflicts
        let conflict = false;
        for (let i = 0; i < combo.length; i++) {
          for (let j = i + 1; j < combo.length; j++) {
            if (hasTimeConflict(combo[i], combo[j])) {
              conflict = true;
              break;
            }
          }
          if (conflict) break;
        }
        if (conflict) continue;

        // Calculate score
        const score = combo.reduce(
          (sum, act) => sum + calculatePreferenceScore(act), 
          0
        );
        const adjustedScore = score + totalCost * 0.3;

        if (adjustedScore > bestScore || 
            (adjustedScore === bestScore && combo.length > bestCombo.length)) {
          bestCombo = combo;
          bestScore = adjustedScore;
          bestCost = totalCost;
        }
      }
    }

    algorithmSteps.push({
      step: "Optimization",
      result: `Selected ${bestCombo.length} activities with score ${bestScore.toFixed(1)}`
    });

    // Sort by date and time
    const sortedItinerary = [...bestCombo].sort((a, b) => {
      if (a.date === b.date) {
        return timeToMinutes(a.start_time) - timeToMinutes(b.start_time);
      }
      return new Date(a.date) - new Date(b.date);
    });

    return {
      itinerary: sortedItinerary,
      algorithmSteps
    };
  };

  // Handler functions
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { itinerary, algorithmSteps } = generateOptimalItinerary();
      setResult(itinerary);
      setSteps(algorithmSteps);
    } catch (err) {
      setError('Error generating itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    
    setSaveStatus('saving');
    try {
      await axios.post('/api/itineraries', {
        userId,
        activities: result,
        totalCost: result.reduce((sum, act) => sum + act.cost, 0),
        budget
      });
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
    }
  };

  const handleAddTimeSlot = () => {
    setCustomTimeSlots([
      ...customTimeSlots,
      { date: new Date().toISOString().split('T')[0], start: '10:00', end: '18:00' }
    ]);
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updated = [...customTimeSlots];
    updated[index][field] = value;
    setCustomTimeSlots(updated);
  };

  // Render functions
  const renderTimeSlots = () => (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Preferred Time Slots</h3>
      {customTimeSlots.map((slot, index) => (
        <div key={index} className="mb-3 p-3 border rounded">
          <input
            type="date"
            value={slot.date}
            onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
            className="w-full mb-2 p-1 border rounded"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={slot.start}
              onChange={(e) => handleTimeSlotChange(index, 'start', e.target.value)}
              className="flex-1 p-1 border rounded"
            />
            <input
              type="time"
              value={slot.end}
              onChange={(e) => handleTimeSlotChange(index, 'end', e.target.value)}
              className="flex-1 p-1 border rounded"
            />
          </div>
        </div>
      ))}
      <button 
        onClick={handleAddTimeSlot}
        className="text-blue-600 text-sm"
      >
        + Add Time Slot
      </button>
    </div>
  );

  const renderActivity = (activity) => (
    <div key={activity.id} className="border rounded-lg p-4 mb-3">
      <div className="flex justify-between">
        <h4 className="font-medium">{activity.name}</h4>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {activity.type}
        </span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {activity.start_time} - {activity.end_time} • {activity.duration} mins
      </div>
      <div className="mt-2">Cost: ${activity.cost}</div>
      <div className="mt-1 text-sm">
        Tags: {activity.tags.join(', ')}
      </div>
    </div>
  );

  const renderResult = () => {
    if (!result) return null;
    
    const totalCost = result.reduce((sum, act) => sum + act.cost, 0);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Itinerary</h2>
          <div className="text-lg">
            <span className="font-medium">Total: </span>
            ${totalCost} / ${budget}
          </div>
        </div>

        {result.reduce((groups, activity) => {
          const date = activity.date;
          if (!groups[date]) groups[date] = [];
          groups[date].push(activity);
          return groups;
        }, {}).map((date, activities) => (
          <div key={date} className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <div className="space-y-3">
              {activities.map(renderActivity)}
            </div>
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Save Itinerary'}
        </button>
        {saveStatus === 'success' && (
          <p className="text-green-600 mt-2">Itinerary saved successfully!</p>
        )}
        {saveStatus === 'error' && (
          <p className="text-red-600 mt-2">Failed to save itinerary</p>
        )}
      </div>
    );
  };

  // Main render
  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-600 p-8">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tourist Itinerary Generator</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Preferences Panel */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium">Budget: ${budget}</label>
              <input
                type="range"
                min="100"
                max="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            {renderTimeSlots()}
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isGenerating ? 'Generating...' : 'Generate Itinerary'}
            </button>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Algorithm Steps */}
          {steps.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Algorithm Steps</h3>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold">{step.step}</div>
                    <div className="text-sm text-gray-600">{step.result}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Results */}
          {renderResult()}
          
          {/* Empty State */}
          {!result && steps.length === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p>Configure your preferences and generate an itinerary</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerator;