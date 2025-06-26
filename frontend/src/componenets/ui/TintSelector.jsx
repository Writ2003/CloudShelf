import { Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import { useState } from "react";

const TintSelector = ({ onTintChange }) => {
  const [tint, setTint] = useState("default");

  const handleChange = (e) => {
    setTint(e.target.value);
    onTintChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <RadioGroup row value={tint} onChange={handleChange} >
        <FormControlLabel value="default" control={<Radio />} label={<span className="text-sm font-serif">Default</span>}/>
        <FormControlLabel value="sepia" control={<Radio />} label={<span className="text-sm font-serif">Sepia</span>}/>
        <FormControlLabel value="night" control={<Radio />} label={<span className="text-sm font-serif">Night</span>}/>
      </RadioGroup>
    </div>
  );
};

export default TintSelector;
