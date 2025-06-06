// // React version of the Python itinerary generator
// import React, { useEffect, useState } from 'react';

// const activities = [
//   {
//     name: 'Fort Rocky Tours',
//     cost: 90,
//     duration: 120,
//     date: '2025-04-03',
//     start_time: '10:00',
//     end_time: '16:00',
//     tags: ['tour (historical)'],
//     priority: 2,
//     type: 'venue',
//   },
//   {
//     name: 'UWI Carnival',
//     cost: 50,
//     duration: 120,
//     date: '2025-04-03',
//     start_time: '12:00',
//     end_time: '17:00',
//     tags: ['outdoor activity', 'party'],
//     priority: 1,
//     type: 'event',
//   },
//   {
//     name: 'Jamaica Food and Beverage',
//     cost: 70,
//     duration: 270,
//     date: '2025-04-06',
//     start_time: '14:00',
//     end_time: '19:00',
//     tags: ['outdoor food and dining', 'outdoor festival'],
//     priority: 1,
//     type: 'event',
//   },
//   {
//     name: 'Devon House',
//     cost: 30,
//     duration: 180,
//     date: '2025-04-06',
//     start_time: '10:00',
//     end_time: '22:00',
//     tags: ['tour (historical)', 'outdoor activity', 'outdoor food and dining'],
//     priority: 2,
//     type: 'venue',
//   },
// ];

// const preferences = [
//   { name: 'Outdoor festival', weight: 10 },
//   { name: 'Tours (historical)', weight: 9 },
//   { name: 'Outdoor Food and Dining', weight: 8 },
//   { name: 'Outdoor Activity', weight: 7 },
//   { name: 'Indoor Activity', weight: 6 },
//   { name: 'Indoor Festival', weight: 5 },
//   { name: 'Indoor Food and Dining', weight: 4 },
//   { name: 'Beach', weight: 3 },
//   { name: 'Tours (Nature)', weight: 2 },
//   { name: 'Live Music/concert', weight: 1 },
// ];

// const preferredSlots = [
//   { date: '2025-04-03', start: '10:00', end: '16:00' },
//   { date: '2025-04-04', start: '14:00', end: '18:00' },
//   { date: '2025-04-06', start: '10:00', end: '19:00' },
// ];

// const budget = 300;

// function timeToMinutes(timeStr) {
//   const [h, m] = timeStr.split(':').map(Number);
//   return h * 60 + m;
// }

// function hasTimeConflict(act1, act2) {
//   if (act1.date !== act2.date) return false;
//   const s1 = timeToMinutes(act1.start_time);
//   const e1 = s1 + act1.duration;
//   const s2 = timeToMinutes(act2.start_time);
//   const e2 = s2 + act2.duration;
//   return !(e1 <= s2 || e2 <= s1);
// }

// function fitsPreferredSlot(activity) {
//   return preferredSlots.some((slot) => {
//     if (activity.date !== slot.date) return false;
//     const actStart = timeToMinutes(activity.start_time);
//     const actEnd = actStart + activity.duration;
//     const slotStart = timeToMinutes(slot.start);
//     const slotEnd = timeToMinutes(slot.end);
//     return actStart >= slotStart && actEnd <= slotEnd;
//   });
// }

// function normalizeTag(text) {
//   return text.toLowerCase().replace(/[()\-]/g, '').replace(/s\b/, '').trim();
// }

// function calculatePreferenceScore(activity) {
//   const normTags = activity.tags.map(normalizeTag);
//   let score = 0;
//   for (const pref of preferences) {
//     const prefNorm = normalizeTag(pref.name);
//     if (normTags.includes(prefNorm)) {
//       score += pref.weight * 2;
//     }
//   }
//   return score;
// }

// function generateOptimalItinerary() {
//   const valid = activities.filter(fitsPreferredSlot);
//   let best = [], bestScore = 0;
//   for (let r = 1; r <= valid.length; r++) {
//     const combos = combinations(valid, r);
//     for (const combo of combos) {
//       const cost = combo.reduce((sum, a) => sum + a.cost, 0);
//       if (cost > budget) continue;
//       const conflict = combo.some((a, i) =>
//         combo.some((b, j) => j > i && hasTimeConflict(a, b))
//       );
//       if (conflict) continue;
//       let score = combo.reduce((sum, a) => sum + calculatePreferenceScore(a), 0);
//       score += cost * 0.3;
//       if (score > bestScore || (score === bestScore && combo.length > best.length)) {
//         best = combo;
//         bestScore = score;
//       }
//     }
//   }
//   return best.sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
// }

// function combinations(arr, k) {
//   if (k === 0) return [[]];
//   if (arr.length < k) return [];
//   const [first, ...rest] = arr;
//   const withFirst = combinations(rest, k - 1).map((combo) => [first, ...combo]);
//   const withoutFirst = combinations(rest, k);
//   return [...withFirst, ...withoutFirst];
// }

// export default function ItineraryPlanner() {
//   const [itinerary, setItinerary] = useState([]);

//   useEffect(() => {
//     const result = generateOptimalItinerary();
//     setItinerary(result);
//   }, []);

//   const totalCost = itinerary.reduce((sum, a) => sum + a.cost, 0);
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Weighted Preference Itinerary</h1>
//       <p>Budget: ${budget}</p>
//       {itinerary.length === 0 ? (
//         <p>No valid itinerary found within constraints.</p>
//       ) : (
//         <div>
//           {Array.from(new Set(itinerary.map((a) => a.date))).map((date) => (
//             <div key={date} className="mt-4">
//               <h2 className="text-xl font-semibold">
//                 {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//               </h2>
//               {itinerary
//                 .filter((a) => a.date === date)
//                 .map((a, i) => (
//                   <div key={i} className="ml-4">
//                     <p>{a.start_time}-{a.end_time}: {a.name}</p>
//                     <ul className="ml-6 list-disc">
//                       <li>Cost: ${a.cost}</li>
//                       <li>Duration: {a.duration} mins</li>
//                       <li>Type: {a.type}</li>
//                       <li>Tags: {a.tags.join(', ')}</li>
//                     </ul>
//                   </div>
//                 ))}
//             </div>
//           ))}
//           <p className="mt-4 font-semibold">Total Cost: ${totalCost}/{budget}</p>
//           <p>Budget Remaining: ${budget - totalCost}</p>
//         </div>
//       )}
//     </div>
//   );
// }
// React version of the Python itinerary generator
import React, { useEffect, useState } from 'react';

const activities = [
  {
    name: 'Fort Rocky Tours',
    cost: 90,
    duration: 120,
    date: '2025-04-03',
    start_time: '10:00',
    end_time: '16:00',
    tags: ['tour (historical)'],
    priority: 2,
    type: 'venue',
  },
  {
    name: 'UWI Carnival',
    cost: 50,
    duration: 120,
    date: '2025-04-03',
    start_time: '12:00',
    end_time: '17:00',
    tags: ['outdoor activity', 'party'],
    priority: 1,
    type: 'event',
  },
  {
    name: 'Jamaica Food and Beverage',
    cost: 70,
    duration: 270,
    date: '2025-04-06',
    start_time: '14:00',
    end_time: '19:00',
    tags: ['outdoor food and dining', 'outdoor festival'],
    priority: 1,
    type: 'event',
  },
  {
    name: 'Devon House',
    cost: 30,
    duration: 180,
    date: '2025-04-06',
    start_time: '10:00',
    end_time: '22:00',
    tags: ['tour (historical)', 'outdoor activity', 'outdoor food and dining'],
    priority: 2,
    type: 'venue',
  },
];

const preferences = [
  { name: 'Outdoor festival', weight: 10 },
  { name: 'Tours (historical)', weight: 9 },
  { name: 'Outdoor Food and Dining', weight: 8 },
  { name: 'Outdoor Activity', weight: 7 },
  { name: 'Indoor Activity', weight: 6 },
  { name: 'Indoor Festival', weight: 5 },
  { name: 'Indoor Food and Dining', weight: 4 },
  { name: 'Beach', weight: 3 },
  { name: 'Tours (Nature)', weight: 2 },
  { name: 'Live Music/concert', weight: 1 },
];

const preferredSlots = [
  { date: '2025-04-03', start: '10:00', end: '16:00' },
  { date: '2025-04-04', start: '14:00', end: '18:00' },
  { date: '2025-04-06', start: '10:00', end: '19:00' },
];

const budget = 300;

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function hasTimeConflict(act1, act2) {
  if (act1.date !== act2.date) return false;
  const s1 = timeToMinutes(act1.start_time);
  const e1 = s1 + act1.duration;
  const s2 = timeToMinutes(act2.start_time);
  const e2 = s2 + act2.duration;
  return !(e1 <= s2 || e2 <= s1);
}

function fitsPreferredSlot(activity) {
  return preferredSlots.some((slot) => {
    if (activity.date !== slot.date) return false;
    const actStart = timeToMinutes(activity.start_time);
    const actEnd = actStart + activity.duration;
    const slotStart = timeToMinutes(slot.start);
    const slotEnd = timeToMinutes(slot.end);
    return actStart >= slotStart && actEnd <= slotEnd;
  });
}

function normalizeTag(text) {
  return text.toLowerCase().replace(/[()\-]/g, '').replace(/s\b/, '').trim();
}

function calculatePreferenceScore(activity) {
  const normTags = activity.tags.map(normalizeTag);
  let score = 0;
  for (const pref of preferences) {
    const prefNorm = normalizeTag(pref.name);
    if (normTags.includes(prefNorm)) {
      score += pref.weight * 2;
    }
  }
  return score;
}

function generateOptimalItinerary() {
  const valid = activities.filter(fitsPreferredSlot);
  let best = [], bestScore = 0;
  for (let r = 1; r <= valid.length; r++) {
    const combos = combinations(valid, r);
    for (const combo of combos) {
      const cost = combo.reduce((sum, a) => sum + a.cost, 0);
      if (cost > budget) continue;
      const conflict = combo.some((a, i) =>
        combo.some((b, j) => j > i && hasTimeConflict(a, b))
      );
      if (conflict) continue;
      let score = combo.reduce((sum, a) => sum + calculatePreferenceScore(a), 0);
      score += cost * 0.3;
      if (score > bestScore || (score === bestScore && combo.length > best.length)) {
        best = combo;
        bestScore = score;
      }
    }
  }
  return best.sort((a, b) => a.date.localeCompare(b.date) || a.start_time.localeCompare(b.start_time));
}

function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  const withFirst = combinations(rest, k - 1).map((combo) => [first, ...combo]);
  const withoutFirst = combinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export default function ItineraryPlanner() {
  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    const result = generateOptimalItinerary();
    setItinerary(result);
  }, []);

  const totalCost = itinerary.reduce((sum, a) => sum + a.cost, 0);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weighted Preference Itinerary</h1>
      <p>Budget: ${budget}</p>
      {itinerary.length === 0 ? (
        <p>No valid itinerary found within constraints.</p>
      ) : (
        <div>
          {Array.from(new Set(itinerary.map((a) => a.date))).map((date) => (
            <div key={date} className="mt-4">
              <h2 className="text-xl font-semibold">
                {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
              {itinerary
                .filter((a) => a.date === date)
                .map((a, i) => (
                  <div key={i} className="ml-4">
                    <p>{a.start_time}-{a.end_time}: {a.name}</p>
                    <ul className="ml-6 list-disc">
                      <li>Cost: ${a.cost}</li>
                      <li>Duration: {a.duration} mins</li>
                      <li>Type: {a.type}</li>
                      <li>Tags: {a.tags.join(', ')}</li>
                    </ul>
                  </div>
                ))}
            </div>
          ))}
          <p className="mt-4 font-semibold">Total Cost: ${totalCost}/{budget}</p>
          <p>Budget Remaining: ${budget - totalCost}</p>
        </div>
      )}
    </div>
  );
}
