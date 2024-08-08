import React from 'react';

const Sidebar = ({ filters, handleFilterChange }) => {
  return (
    <div className="sidebar">
      <h2>Filters</h2>
      <ul>
        {filters.map(filter => (
          <li key={filter.id}>
            <input 
              type="checkbox" 
              id={filter.id} 
              checked={filter.checked}
              onChange={() => handleFilterChange(filter.id)}
            />
            <label htmlFor={filter.id}>{filter.name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
