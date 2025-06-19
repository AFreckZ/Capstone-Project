// // InterestPage.js
// import React, { useState } from "react";
// import "../css/Preferences.css";
// import { useNavigate} from "react-router-dom";

// // list of preference types
// const categories = [
//   "Concert",
//   "Party",
//   "Festival",
//   "Sport",
//   "Art/Talent",
//   "Outdoor Adventure",
//   "Indoor Adventure",
//   "Museum/Historical Site",
//   "Local Food/Dining",
//   "Unique Food/Dining",
//   "Club/Bar/Party",
//   "Live Music"
// ];

// export default function InterestPage() {
//   const [selected, setSelected] = useState([]);
//   const [message, setMessage] = useState({ text: '', type: '', visible: false });
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const toggleSelection = (category) => {
//     if (message.visible) {
//       setMessage({ text: '', type: '', visible: false });
//     }
    
//     const index = selected.indexOf(category);
//     if (index > -1) {
//       const newSelected = [...selected];
//       newSelected.splice(index, 1);
//       setSelected(newSelected);
//     } else {
//       setSelected([...selected, category]);
//     }
//   };

//   const getBadgeNumber = (category) => {
//     const index = selected.indexOf(category);
//     return index > -1 ? index + 1 : null;
//   };
//   const showMessage = (text, type) => {
//     setMessage({ text, type, visible: true });
//     if (type === 'success') {
//       setTimeout(() => {
//         setMessage({ text: '', type: '', visible: false });
//       }, 5000);
//     }
//   };

// const handleSavePreferences = async () => {
//   const selectedPrefs = selected;
//   const total = selectedPrefs.length;

//     if (total === 0) {
//       showMessage("Please select at least one preference before saving.", "error");
//       return;
//     }

//     setIsLoading(true);
//     setMessage({ text: '', type: '', visible: false });


//   // Create weighted preferences: first selected gets highest weight
//   const weightedPrefs = selectedPrefs.map((tag, index) => ({
//     tag,
//     weight: total - index,
//   }));

//     console.log("Sending preferences:", JSON.stringify(weightedPrefs, null, 2));

//   try {
//     const response = await fetch("http://localhost:5001/api/prefer/preferences", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Add auth token or user ID if needed
//       },
//       body: JSON.stringify({ preferences: weightedPrefs }),
//     });

//     const result = await response.json();

//      if (response.ok) {
//       console.log("Preferences saved:", result);
//       showMessage(
//         `Your preferences has been saved`, 
//           "success"
//       );
//       //navigate('/generate');
//       // Optionally redirect after successful save
//       // setTimeout(() => window.location.href = '/dashboard', 2000);
//     } else {
//       console.error("Failed to save preferences:", response.status);
//       showMessage(
//         result.error || 'Failed to save preferences. Please try again.', 
//           "error"
//         );
//     }
//   } catch (error) {
//     console.error("Error saving preferences:", error);
//           showMessage(
//         "Network error: Could not connect to server. Please check your connection and try again.", 
//         "error"
//       );
//     } finally {
//       setIsLoading(false);
//   }
// };
//   return (
//     <div className="interest-container">
//       <header className="interest-header">
//         <div className="header-content">
//           <div className="logo">Yaad Quest</div>
//           <nav className="nav-links">
//             <a href="#">Home</a>
//             <a href="#">Explore</a>
//             <a href="#">Activities</a>
//             <a href="#">About Us</a>
//             <a href="#">Contact</a>
//           </nav>
//           <div className="avatar"></div>
//         </div>
//       </header>

//       <div className="hero-image">
//         <h1>Choose Your Preferences</h1>
//       </div>
//       <div className="instructions">
//         <p>Please select the types of events and venues that you would like to visit.</p>
      
//       </div>
//          {message.visible && (
//         <div className={`message ${message.type}`}>
//           {message.text}
//         </div>
//       )}
//       <div className="category-grid">
       
//         {categories.map((category) => (
//           <div
//             key={category}
//             onClick={() => toggleSelection(category)}
//             className={`category-item ${selected.includes(category) ? "selected" : ""}`}
//           >
//             {getBadgeNumber(category) && (
//               <span className="badge">{getBadgeNumber(category)}</span>
//             )}
//             <span className="category-label">{category}</span>
//           </div>
//         ))}
//       </div>

//       <div className="save-button-wrapper" onClick={handleSavePreferences}>
//         <button className="save-button" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Preferences →'}</button>
         
//       </div>

//       <footer className="interest-footer">
//         <div className="footer-content">
//           <div className="footer-section">
//             <div className="footer-logo">Yaad Quest</div>
//           </div>
//           <div className="footer-section">
//             <h3>Company</h3>
//             <p>About Us</p>
//             <h3>Contact</h3>
//             <p>Email</p>
//           </div>
//           <div className="footer-section">
//             <h3>Further</h3>
//             <p>Activities</p>
//             <p>Restaurants</p>
//             <div className="footer-icons">
//               <div className="icon pink"></div>
//               <div className="store-badge">Google Play</div>
//               <div className="store-badge">App Store</div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
// InterestPage.js
// InterestPage.js
import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext'; // Import your auth context
import "../css/Preferences.css";
import { useNavigate} from "react-router-dom";

// list of preference types
const categories = [
  "Concert",
  "Party",
  "Festival",
  "Sport",
  "Art/Talent",
  "Outdoor Adventure",
  "Indoor Adventure",
  "Museum/Historical Site",
  "Local Food/Dining",
  "Unique Food/Dining",
  "Club/Bar/Party",
  "Live Music"
];

export default function InterestPage() {
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '', visible: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Get auth context
  const { user, userId, isAuthenticated, token, getAuthHeaders } = useAuth();

  const toggleSelection = (category) => {
    if (message.visible) {
      setMessage({ text: '', type: '', visible: false });
    }
    
    const index = selected.indexOf(category);
    if (index > -1) {
      const newSelected = [...selected];
      newSelected.splice(index, 1);
      setSelected(newSelected);
    } else {
      setSelected([...selected, category]);
    }
  };

  const getBadgeNumber = (category) => {
    const index = selected.indexOf(category);
    return index > -1 ? index + 1 : null;
  };

  const showMessage = (text, type) => {
    setMessage({ text, type, visible: true });
    if (type === 'success') {
      setTimeout(() => {
        setMessage({ text: '', type: '', visible: false });
      }, 5000);
    }
  };

  const handleSavePreferences = async () => {
    // Check if user is authenticated
    if (!isAuthenticated || !userId || !token) {
      showMessage("Please log in to save your preferences.", "error");
      return;
    }

    const selectedPrefs = selected;
    const total = selectedPrefs.length;

    if (total === 0) {
      showMessage("Please select at least one preference before saving.", "error");
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '', visible: false });

    // Create weighted preferences: first selected gets highest weight
    const weightedPrefs = selectedPrefs.map((tag, index) => ({
      tag,
      weight: total - index,
    }));

    console.log("Sending preferences:", JSON.stringify(weightedPrefs, null, 2));
    console.log("User ID:", userId);
    console.log("Token available:", !!token);

    try {
      // Use the token directly from auth context
      console.log("Using token from auth context");

      // Let's test different endpoint patterns to find the working one
      const endpointsToTry = [
        "http://localhost:5001/api/preferences",
        "http://localhost:5001/preferences",
        "http://localhost:5001/api/prefer/preferences", // Your original endpoint
        "/api/preferences",
        "/preferences",
      ];

      let response = null;
      let successfulEndpoint = null;

      // Try each endpoint until we find one that works
      for (const endpoint of endpointsToTry) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          
          response = await fetch(endpoint, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ preferences: weightedPrefs }),
          });

          console.log(`${endpoint} - Response status: ${response.status}`);
          
          if (response.status !== 404) {
            successfulEndpoint = endpoint;
            console.log(`Found working endpoint: ${endpoint}`);
            break;
          }
        } catch (err) {
          console.log(`${endpoint} - Error: ${err.message}`);
          continue;
        }
      }

      if (!successfulEndpoint) {
        console.error("All endpoints returned 404 - API server may not be running");
        showMessage("API server appears to be down. Please contact support.", "error");
        setIsLoading(false);
        return;
      }

      console.log(`Using successful endpoint: ${successfulEndpoint}`);
      console.log("Final response status:", response.status);

      // Check if response is JSON or HTML
      const contentType = response.headers.get('content-type');
      console.log("Response content-type:", contentType);

      let result;
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const textResult = await response.text();
        console.log("Non-JSON response:", textResult.substring(0, 200));
        throw new Error(`Server returned HTML instead of JSON. Check if backend is running on correct port.`);
      }

      console.log("Response data:", result);

      if (response.ok) {
        console.log("Preferences saved successfully:", result);
        showMessage(
          `Your ${total} preference${total > 1 ? 's have' : ' has'} been saved successfully!`, 
          "success"
        );
        
        // Navigate back to profile page after successful save
        setTimeout(() => {
          navigate('/tourist-profile');
        }, 2000);
        
      } else {
        console.error("Failed to save preferences:", response.status, result);
        
        if (response.status === 401) {
          showMessage("Access token required. Please log in again.", "error");
        } else if (response.status === 403) {
          showMessage("Invalid or expired token. Please log in again.", "error");
        } else if (response.status === 404) {
          showMessage("Tourist profile not found. Please complete your trip setup first.", "error");
        } else if (response.status === 400) {
          showMessage(
            result.error || "Invalid preference data. Please try again.", 
            "error"
          );
        } else {
          showMessage(
            result.error || `Failed to save preferences (${response.status}). Please try again.`, 
            "error"
          );
        }
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      
      if (error.message.includes('HTML instead of JSON')) {
        showMessage(
          "Server configuration error. Please check if the backend API is running correctly.", 
          "error"
        );
      } else {
        showMessage(
          "Network error: Could not connect to server. Please check your connection and try again.", 
          "error"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show login message if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <div className="interest-container">
        <header className="interest-header">
          <div className="header-content">
            <div className="logo">Yaad Quest</div>
            <nav className="nav-links">
              <a href="#">Home</a>
              <a href="#">Explore</a>
              <a href="#">Activities</a>
              <a href="#">About Us</a>
              <a href="#">Contact</a>
            </nav>
            <div className="avatar"></div>
          </div>
        </header>

        <div className="hero-image">
          <h1>Please Log In</h1>
        </div>
        
        <div className="instructions">
          <p>You must be logged in to set your preferences.</p>
          <button onClick={() => navigate('/login')} className="save-button">
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interest-container">
      <header className="interest-header">
        <div className="header-content">
          <div className="logo">Yaad Quest</div>
          <nav className="nav-links">
            <a href="/tourist-profile">Home</a>
            <a href="/search">Explore</a>
            <a href="#">Activities</a>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
          </nav>
          <div className="avatar">{user?.username?.charAt(0)?.toUpperCase()}</div>
        </div>
      </header>

      <div className="hero-image">
        <h1>Choose Your Preferences</h1>
      </div>
      
      <div className="instructions">
        <p>Please select the types of events and venues that you would like to visit.</p>
        <p><small>Your first selection will have the highest priority.</small></p>
      </div>
      
      {message.visible && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => toggleSelection(category)}
            className={`category-item ${selected.includes(category) ? "selected" : ""}`}
          >
            {getBadgeNumber(category) && (
              <span className="badge">{getBadgeNumber(category)}</span>
            )}
            <span className="category-label">{category}</span>
          </div>
        ))}
      </div>

      <div className="save-button-wrapper" onClick={handleSavePreferences}>
        <button className="save-button" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Preferences →'}
        </button>
      </div>

      <footer className="interest-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">Yaad Quest</div>
          </div>
          <div className="footer-section">
            <h3>Company</h3>
            <p>About Us</p>
            <h3>Contact</h3>
            <p>yaadquest@gmail.com</p>
          </div>
          <div className="footer-section">
            <h3>Further</h3>
            <p>Activities</p>
            <p>Restaurants</p>
            <div className="footer-icons">
              <div className="icon pink"></div>
              <div className="store-badge">Google Play</div>
              <div className="store-badge">App Store</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}