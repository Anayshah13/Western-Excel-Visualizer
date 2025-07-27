import React, { useState } from "react";
import displayNameMap from "./constants/displayNameMap";
import parameterGroups from "./constants/parameterGroups";
import { RiArrowDropDownLine } from "react-icons/ri";


function ParameterList({ selected, onToggle }) {
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroupDropdown = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const isGroupChecked = (groupParams) =>
    groupParams.every((p) => selected.includes(p));

  const isGroupIndeterminate = (groupParams) =>
    groupParams.some((p) => selected.includes(p)) &&
    !groupParams.every((p) => selected.includes(p));

  return (
    <div className="parameter-list">
      {Object.entries(parameterGroups).map(([groupName, groupParams]) => {
        const groupChecked = isGroupChecked(groupParams);
        const groupIndeterminate = isGroupIndeterminate(groupParams);
        const isExpanded = expandedGroups[groupName] || false;

        return (
          <div key={groupName} style={{ marginBottom: "0.8vw"}}>
            <div
              className="parameter-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <span
                onClick={() => toggleGroupDropdown(groupName)}
                style={{
                  transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.8s",
                  display: "inline-block",
                  fontSize: "0rem",
                }}
              >
               <RiArrowDropDownLine size={24}/> 
              </span>

              <label style={{ flex: 1 }}>
                <input
                  type="checkbox"
                  checked={groupChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = groupIndeterminate;
                  }}
                  onChange={() => {
                    groupParams.forEach((param) => {
                      const shouldSelect = !groupChecked;
                      const currentlySelected = selected.includes(param);
                      if (shouldSelect && !currentlySelected) onToggle(param);
                      if (!shouldSelect && currentlySelected) onToggle(param);
                    });
                  }}
                />
                {groupName}
              </label>
            </div>

            {isExpanded && (
              <div style={{ marginTop: "8px", paddingLeft: "1.5rem" }}>
                {groupParams.map((param) => (
                  <label key={param} className="parameter-item" style={{ display: "block", marginBottom: "4px" }}>
                    <input
                      type="checkbox"
                      checked={selected.includes(param)}
                      onChange={() => onToggle(param)}
                    />
                    {displayNameMap[param] || param}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ParameterList;
