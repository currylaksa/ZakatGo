
const HalfCircleBackground = ({ children, title, bgClassName = 'bg-neutral', headerClassName = 'h-48 bg-primary', titleClassName = 'text-xl font-bold text-white' }) => {
  return (
    <div className={`min-h-screen ${bgClassName} relative overflow-hidden`}>
      {/* Curved header background */}
      <div 
        className={`absolute top-0 left-0 right-0 ${headerClassName} z-0`}
        style={{ 
          borderBottomLeftRadius: '80% 30%', 
          borderBottomRightRadius: '80% 30%'
        }}
      />
      
      {/* Page title */}
      {title && (
        <div className="relative z-10 px-4 pt-20 md:pt-24 pb-4">
          <h1 className={titleClassName}>{title}</h1>
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