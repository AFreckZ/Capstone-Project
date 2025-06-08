import React, { useState } from "react";
import "../css/BusinessProfileForm.css";

const BusinessProfileForm = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    description: "",
    image: null,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.businessName) newErrors.businessName = "Business name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.description) newErrors.description = "Please enter a description.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match.";
  }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Business Profile Submitted:", formData);
    // Handle backend submission logic here
  };

  return (
    <div className="business-form-container">
      <h2>Create Business Profile</h2>
      <form className="business-form" onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="form-group">
          <label>Business Logo</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {previewImage && <img src={previewImage} alt="Preview" className="preview-image" />}
        </div>

        {/* Business Name */}
        <div className="form-group">
          <label>Business Name *</label>
          <input name="businessName" value={formData.businessName} onChange={handleChange} />
          {errors.businessName && <span className="error">{errors.businessName}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>


        {/* Password */}
<div className="form-group">
  <label>Password *</label>
  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
    />
    <button
      type="button"
      className="toggle-visibility"
      onClick={() => setShowPassword((prev) => !prev)}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
  {errors.password && <span className="error">{errors.password}</span>}
</div>

{/* Confirm Password */}
<div className="form-group">
  <label>Confirm Password *</label>
  <div className="password-wrapper">
    <input
      type={showConfirmPassword ? "text" : "password"}
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
    />
    <button
      type="button"
      className="toggle-visibility"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
  </div>
  {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
</div>
        

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />
        </div>


        {/* Description */}
        <div className="form-group">
          <label>Business Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <button type="submit" className="submit-btn">Save Business Profile</button>
      </form>
    </div>
  );
};

export default BusinessProfileForm;
