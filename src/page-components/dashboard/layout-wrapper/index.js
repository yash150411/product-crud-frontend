import React from 'react';
import './style.css';

function LayoutWrapper({title, children}) {
  return (
    <div className="layout-wrapper">
      <div className="layout-title-wrapper">
        <h3 className="layout-title">{title}</h3>
      </div>
      <div className="layout-children-wrapper">
        {children}
      </div>
    </div>
  )
}

export default LayoutWrapper
