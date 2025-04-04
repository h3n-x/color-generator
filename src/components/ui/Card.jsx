import React from 'react';

const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={`border-2 border-black bg-white overflow-hidden ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div 
      className={`p-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 
      className={`text-lg font-bold pixel-text ${className}`} 
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ className, children, ...props }) => {
  return (
    <p 
      className={`text-sm mt-1 ${className}`} 
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div 
      className={`p-4 pt-0 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div 
      className={`p-4 border-t border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
