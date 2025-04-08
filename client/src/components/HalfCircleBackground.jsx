import React from 'react';

const HalfCircleBackground = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-neutral relative overflow-hidden">
      {/* Green background with curved bottom */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 bg-primary z-0"
        style={{ 
          borderBottomLeftRadius: '80% 30%', 
          borderBottomRightRadius: '80% 30%'
        }}
      >
      </div>
      
      {/* Page title */}
      {title && (
        <div className="relative z-10 px-4 pt-3 pb-4">
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 px-4">
        {children}
      </div>
    </div>
  );
};

export default HalfCircleBackground; 