
import React, { ReactNode } from 'react';

interface FormStepWrapperProps {
  title: string;
  isActive: boolean;
  children: ReactNode;
  description?: string;
}

const FormStepWrapper: React.FC<FormStepWrapperProps> = ({
  title,
  isActive,
  children,
  description
}) => {
  // Only render the content if the step is active
  if (!isActive) return null;

  return (
    <div className="form-step entering animate-scale-in">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FormStepWrapper;
