import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionStatus, FieldStatus } from '../types/checklist';

interface ChecklistItemProps {
  section: SectionStatus;
  currentStep: number;
  onNavigate: (step: number) => void;
  stepIndex: number;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  section,
  currentStep,
  onNavigate,
  stepIndex
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    if (section.isComplete && section.isValid) {
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    } else if (section.isComplete && section.isValid === false) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else if (section.isRequired) {
      return <Circle className="h-5 w-5 text-gray-400" />;
    } else {
      return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getFieldStatusIcon = (field: FieldStatus) => {
    if (field.isComplete && field.isValid) {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    } else if (field.isComplete && field.isValid === false) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    } else if (field.isRequired) {
      return <Circle className="h-4 w-4 text-gray-400" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-300" />;
    }
  };

  const handleNavigate = () => {
    onNavigate(stepIndex);
  };

  return (
    <div className={`
      border rounded-md overflow-hidden mb-2 
      ${currentStep === stepIndex ? 'border-primary bg-primary/5' : 'border-border'}
    `}>
      <div 
        className={`
          flex items-center justify-between p-3 cursor-pointer
          ${section.isComplete && !section.isValid ? 'bg-amber-50' : ''}
          ${section.isComplete && section.isValid ? 'bg-emerald-50/50' : ''}
        `}
        onClick={handleNavigate}
      >
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <span className={`font-medium ${section.isRequired ? '' : 'text-muted-foreground'}`}>
            {section.title}
            {section.isRequired && <span className="text-red-500">*</span>}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {section.fields && section.fields.length > 0 && (
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && section.fields && section.fields.length > 0 && (
        <div className="p-3 pt-0 border-t border-border">
          {section.fields.map((field, index) => (
            <div 
              key={field.id} 
              className={`
                flex items-center gap-2 py-1.5 px-3 text-sm ml-4 border-l-2
                ${field.isValid === false ? 'border-amber-300' : 'border-gray-200'}
              `}
            >
              {getFieldStatusIcon(field)}
              <span className={field.isRequired ? 'font-medium' : 'text-muted-foreground'}>
                {field.name}
                {field.isRequired && <span className="text-red-500 text-xs">*</span>}
              </span>
              {field.isValid === false && field.validationMessage && (
                <span className="text-amber-500 text-xs ml-auto">{field.validationMessage}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {section.isValid === false && section.validationMessage && (
        <div className="p-2 bg-amber-50 border-t border-amber-200 text-xs text-amber-700">
          {section.validationMessage}
        </div>
      )}
    </div>
  );
};

export default ChecklistItem;