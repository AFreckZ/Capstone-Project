import React, { useState } from "react";
import "../css/TouristProfileForm.css";
//import countries from '../json/countries.json';
// All countries with emoji flags (shortened for preview — full list below)
const countries = [
  { code: "US", name: "🇺🇸 United States" },
  { code: "JM", name: "🇯🇲 Jamaica" },
  { code: "GB", name: "🇬🇧 United Kingdom" },
  { code: "CA", name: "🇨🇦 Canada" },
  { code: "FR", name: "🇫🇷 France" },
  { code: "DE", name: "🇩🇪 Germany" },
  { code: "IN", name: "🇮🇳 India" },
  { code: "BR", name: "🇧🇷 Brazil" },
  { code: "NG", name: "🇳🇬 Nigeria" },
  { code: "ZA", name: "🇿🇦 South Africa" },
  { code: "JP", name: "🇯🇵 Japan" },
  { code: "CN", name: "🇨🇳 China" },
  { code: "AU", name: "🇦🇺 Australia" },
  { code: "MX", name: "🇲🇽 Mexico" },
  { code: "IT", name: "🇮🇹 Italy" },
  { code: "ES", name: "🇪🇸 Spain" },
  // You can copy in the full list (shown below)
];

const TouristProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    interests: "",
    travelDates: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.country) newErrors.country = "Please select a country.";
    if (!formData.interests) newErrors.interests = "Please share your interests.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Submitted:", formData);
    // Backend logic here
  };

  return (
    <div className="tourist-form-container">
      <h2>Create Tourist Profile</h2>
      <form className="tourist-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name *</label>
          <input name="fullName" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email *</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        {/* Country */}
        <div className="form-group">
          <label>Country of Origin *</label>

            <select>
            {countries.map((country) => (
                <option key={country.code} value={country.code}>
                {country.name}
                </option>
            ))}
            </select>

          {errors.country && <span className="error">{errors.country}</span>}
        </div>
 {/*
        
        <div className="form-group">
          <label>Travel Interests *</label>
          <textarea name="interests" value={formData.interests} onChange={handleChange} />
          {errors.interests && <span className="error">{errors.interests}</span>}
        </div>

        
       
        <div className="form-group">
          <label>Expected Travel Dates</label>
          <input name="travelDates" value={formData.travelDates} onChange={handleChange} />
        </div>
*/}
        <button type="submit" className="submit-btn">Make Preferences</button>
      </form>
    </div>
  );
};

export default TouristProfileForm;
