import React from "react";
import displayNameMap from "./constants/displayNameMap";

function ParameterList({ parameters, selected, onToggle }) {
  return (
    <div className="parameter-list">
      {parameters.map((param) => (
        <label key={param} className="parameter-item">
          <input
            type="checkbox"
            checked={selected.includes(param)}
            onChange={() => onToggle(param)}
          />
          {displayNameMap[param] || param}
        </label>
      ))}
    </div>
  );
}

export default ParameterList;

