// JamaicanAddressForm.js
import { useState, useEffect } from "react";

function JamaicanAddressForm({ onAddressChange }) {
  const [street, setStreet] = useState("");
  const [unit, setUnit] = useState("");
  const [postalZone, setPostalZone] = useState("");
  const [parish, setParish] = useState("");
  const [country] = useState("Jamaica");

  useEffect(() => {
    const fullAddress = `${street}${unit ? `, ${unit}` : ""}, ${postalZone}, ${parish}, ${country}`;
    onAddressChange(fullAddress);
  }, [street, unit, postalZone, parish, country, onAddressChange]);

  return (
    <div>
      <div className="form-group">
        <label htmlFor="street">Street Address</label>
        <input
          id="street"
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="123 Hope Road"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="unit">Apartment/Unit (optional)</label>
        <input
          id="unit"
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="Apt 4B"
        />
      </div>

      <div className="form-group">
        <label htmlFor="postalZone">Postal Zone / Town</label>
        <input
          id="postalZone"
          type="text"
          value={postalZone}
          onChange={(e) => setPostalZone(e.target.value)}
          placeholder="Kingston 6"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="parish">Parish</label>
        <select
          id="parish"
          value={parish}
          onChange={(e) => setParish(e.target.value)}
          required
        >
          <option value="">Select Parish</option>
          <option value="Kingston">Kingston</option>
          <option value="St. Andrew">St. Andrew</option>
          <option value="St. Catherine">St. Catherine</option>
          <option value="Clarendon">Clarendon</option>
          <option value="Manchester">Manchester</option>
          <option value="St. Elizabeth">St. Elizabeth</option>
          <option value="Westmoreland">Westmoreland</option>
          <option value="Hanover">Hanover</option>
          <option value="St. James">St. James</option>
          <option value="Trelawny">Trelawny</option>
          <option value="St. Ann">St. Ann</option>
          <option value="St. Mary">St. Mary</option>
          <option value="Portland">Portland</option>
          <option value="St. Thomas">St. Thomas</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <input id="country" type="text" value={country} disabled />
      </div>
    </div>
  );
}

export default JamaicanAddressForm;
