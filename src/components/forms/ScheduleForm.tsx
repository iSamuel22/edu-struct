
import React from 'react';
import { usePlan } from '@/context/PlanContext';
import FormStepWrapper from '@/components/FormStepWrapper';
import { PlusCircle, Trash2 } from 'lucide-react';

const ScheduleForm: React.FC = () => {
  const { currentStep, plan, updateField, addItemToArray } = usePlan();

  return (
    <FormStepWrapper 
      title="Cronograma de Desenvolvimento" 
      isActive={currentStep === 9}
      description="Planejamento das atividades ao longo do período letivo."
    >
      <div className="form-section">
        {plan.data.schedule.map((period, periodIndex) => (
          <div key={periodIndex} className="mb-8 pb-6 border-b border-border last:border-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Período: {period.period}</h3>
              {plan.data.schedule.length > 1 && (
                <button
                  onClick={() => {
                    const updatedSchedule = [...plan.data.schedule];
                    updatedSchedule.splice(periodIndex, 1);
                    updateField('data.schedule', updatedSchedule);
                  }}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                  aria-label="Remover período"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor={`schedule-period-${periodIndex}`} className="input-label">Nome do Período</label>
              <input
                type="text"
                id={`schedule-period-${periodIndex}`}
                className="input-field"
                value={period.period}
                onChange={(e) => {
                  const updatedSchedule = [...plan.data.schedule];
                  updatedSchedule[periodIndex].period = e.target.value;
                  updateField('data.schedule', updatedSchedule);
                }}
                placeholder="Ex: 1º Bimestre, Módulo 1, etc."
              />
            </div>
            
            <h4 className="text-md font-medium mt-4 mb-2">Atividades</h4>
            
            {period.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="mb-4 p-4 bg-background rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">Atividade #{activityIndex + 1}</h5>
                  {period.activities.length > 1 && (
                    <button
                      onClick={() => {
                        const updatedSchedule = [...plan.data.schedule];
                        updatedSchedule[periodIndex].activities.splice(activityIndex, 1);
                        updateField('data.schedule', updatedSchedule);
                      }}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                      aria-label="Remover atividade"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor={`activity-date-${periodIndex}-${activityIndex}`} className="input-label">Data</label>
                    <input
                      type="text"
                      id={`activity-date-${periodIndex}-${activityIndex}`}
                      className="input-field"
                      value={activity.date}
                      onChange={(e) => {
                        const updatedSchedule = [...plan.data.schedule];
                        updatedSchedule[periodIndex].activities[activityIndex].date = e.target.value;
                        updateField('data.schedule', updatedSchedule);
                      }}
                      placeholder="Data da atividade (ex: 10/05/2023)"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor={`teacher-activities-${periodIndex}-${activityIndex}`} className="input-label">Atividades do Docente</label>
                    <textarea
                      id={`teacher-activities-${periodIndex}-${activityIndex}`}
                      className="input-field"
                      value={activity.teacherActivities}
                      onChange={(e) => {
                        const updatedSchedule = [...plan.data.schedule];
                        updatedSchedule[periodIndex].activities[activityIndex].teacherActivities = e.target.value;
                        updateField('data.schedule', updatedSchedule);
                      }}
                      placeholder="Descreva as atividades do docente..."
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor={`student-activities-${periodIndex}-${activityIndex}`} className="input-label">Atividades do Discente</label>
                    <textarea
                      id={`student-activities-${periodIndex}-${activityIndex}`}
                      className="input-field"
                      value={activity.studentActivities}
                      onChange={(e) => {
                        const updatedSchedule = [...plan.data.schedule];
                        updatedSchedule[periodIndex].activities[activityIndex].studentActivities = e.target.value;
                        updateField('data.schedule', updatedSchedule);
                      }}
                      placeholder="Descreva as atividades do discente..."
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const updatedSchedule = [...plan.data.schedule];
                updatedSchedule[periodIndex].activities.push({
                  date: "",
                  teacherActivities: "",
                  studentActivities: ""
                });
                updateField('data.schedule', updatedSchedule);
              }}
              className="btn btn-outline btn-sm flex items-center gap-2 mt-2"
              aria-label="Adicionar atividade"
            >
              <PlusCircle size={14} />
              <span>Adicionar Atividade</span>
            </button>
          </div>
        ))}
        
        <button
          onClick={() => addItemToArray('data.schedule', {
            period: `Período ${plan.data.schedule.length + 1}`,
            activities: [
              {
                date: "",
                teacherActivities: "",
                studentActivities: ""
              }
            ]
          })}
          className="btn btn-outline flex items-center gap-2 mt-4"
          aria-label="Adicionar período"
        >
          <PlusCircle size={16} />
          <span>Adicionar Período</span>
        </button>
      </div>
    </FormStepWrapper>
  );
};

export default ScheduleForm;
