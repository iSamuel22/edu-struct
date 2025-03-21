import { TeachingPlan } from './storage';
import jsPDF from 'jspdf';

// Export plan as plain text
export const exportAsTxt = (plan: TeachingPlan): void => {
  try {
    const { data } = plan;
    
    // Format the plan content
    let content = `PLANO DE ENSINO\n`;
    content += `==================================\n\n`;
    
    // Identification
    content += `1. IDENTIFICAÇÃO DO COMPONENTE CURRICULAR\n`;
    content += `----------------------------------\n`;
    content += `Nome: ${data.identification.courseName}\n`;
    content += `Abreviatura: ${data.identification.courseAbbreviation}\n`;
    content += `Professor: ${data.identification.professorName}\n`;
    content += `Matrícula SIAPE: ${data.identification.siapeCode}\n`;
    content += `Carga Horária Total: ${data.identification.totalHours}h\n`;
    content += `Carga Horária Semanal: ${data.identification.weeklyHours}h\n`;
    content += `Carga Horária Teórica: ${data.identification.theoreticalHours}h\n`;
    content += `Carga Horária Prática: ${data.identification.practicalHours}h\n`;
    content += `Carga Horária Presencial: ${data.identification.inPersonHours}h\n\n`;
    
    // Syllabus
    content += `2. EMENTA\n`;
    content += `----------------------------------\n`;
    content += `${data.syllabus || "Não informado"}\n\n`;
    
    // Objectives
    content += `3. OBJETIVOS DO COMPONENTE CURRICULAR\n`;
    content += `----------------------------------\n`;
    content += `${data.objectives || "Não informado"}\n\n`;
    
    // Justification
    content += `4. JUSTIFICATIVA DA MODALIDADE DE ENSINO\n`;
    content += `----------------------------------\n`;
    content += `${data.justification || "Não informado"}\n\n`;
    
    // Extension
    content += `5. ATIVIDADES CURRICULARES DE EXTENSÃO\n`;
    content += `----------------------------------\n`;
    content += `Possui atividades de extensão: ${data.extension.hasExtension ? "Sim" : "Não"}\n`;
    if (data.extension.hasExtension) {
      content += `Tipo de Atividade: ${data.extension.type}\n`;
      content += `Resumo: ${data.extension.summary}\n`;
      content += `Justificativa: ${data.extension.justification}\n`;
      content += `Objetivos: ${data.extension.objectives}\n`;
      content += `Envolvimento com a comunidade: ${data.extension.communityInvolvement}\n`;
    }
    content += `\n`;
    
    // Content
    content += `6. CONTEÚDO PROGRAMÁTICO\n`;
    content += `----------------------------------\n`;
    data.content.byPeriod.forEach((period, index) => {
      content += `${period.period}:\n`;
      content += `Conteúdo: ${period.content}\n`;
      content += `Relações Interdisciplinares: ${period.interdisciplinaryRelations}\n`;
      if (index < data.content.byPeriod.length - 1) content += `\n`;
    });
    content += `\n`;
    
    // Methodology
    content += `7. PROCEDIMENTOS METODOLÓGICOS\n`;
    content += `----------------------------------\n`;
    content += `${data.methodology || "Não informado"}\n\n`;
    
    // Resources
    content += `8. RECURSOS E INFRAESTRUTURA\n`;
    content += `----------------------------------\n`;
    content += `${data.resources || "Não informado"}\n\n`;
    
    // Visits
    content += `9. VISITAS TÉCNICAS E AULAS PRÁTICAS\n`;
    content += `----------------------------------\n`;
    if (data.visits.length > 0 && data.visits[0].location) {
      data.visits.forEach((visit, index) => {
        content += `Visita ${index + 1}:\n`;
        content += `Local: ${visit.location}\n`;
        content += `Data prevista: ${visit.date}\n`;
        content += `Materiais necessários: ${visit.materials}\n`;
        if (index < data.visits.length - 1) content += `\n`;
      });
    } else {
      content += `Não há visitas técnicas planejadas.\n`;
    }
    content += `\n`;
    
    // Schedule
    content += `10. CRONOGRAMA DE DESENVOLVIMENTO\n`;
    content += `----------------------------------\n`;
    data.schedule.forEach((period, periodIndex) => {
      content += `${period.period}:\n`;
      period.activities.forEach((activity, activityIndex) => {
        content += `Data: ${activity.date}\n`;
        content += `Atividades do docente: ${activity.teacherActivities}\n`;
        content += `Atividades do discente: ${activity.studentActivities}\n`;
        if (activityIndex < period.activities.length - 1) content += `\n`;
      });
      if (periodIndex < data.schedule.length - 1) content += `\n`;
    });
    content += `\n`;
    
    // Bibliography
    content += `11. BIBLIOGRAFIA\n`;
    content += `----------------------------------\n`;
    content += `Bibliografia Básica:\n${data.bibliography.basic || "Não informado"}\n\n`;
    content += `Bibliografia Complementar:\n${data.bibliography.complementary || "Não informado"}\n\n`;
    
    // Signatures
    content += `12. ASSINATURAS\n`;
    content += `----------------------------------\n`;
    content += `Professor: ${data.signatures.professorSignature}\n`;
    content += `Coordenador: ${data.signatures.coordinatorSignature}\n`;
    content += `Componente Curricular: ${data.signatures.componentName}\n`;
    content += `Curso: ${data.signatures.courseName}\n`;
    content += `Data: ${data.signatures.date}\n\n`;
    
    content += `Documento gerado em: ${new Date().toLocaleDateString('pt-BR')}\n`;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.title || 'plano-de-ensino'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting plan as TXT:', error);
    throw new Error('Failed to export plan as TXT');
  }
};

// Export plan as PDF
export const exportAsPdf = (plan: TeachingPlan): void => {
  try {
    const { data } = plan;
    const doc = new jsPDF();
    
    // Set font size and type
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    // Title
    doc.text('PLANO DE ENSINO', 105, 20, { align: 'center' });
    doc.line(20, 25, 190, 25);
    
    // Reset font for content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 35;
    const lineHeight = 6;
    const marginLeft = 20;
    const pageWidth = 190;
    
    // Helper function to add text with word wrapping
    const addText = (text: string, y: number, options?: any) => {
      const defaultOptions = { maxWidth: 170, align: 'left' };
      const finalOptions = { ...defaultOptions, ...options };
      
      if (y > 280) {
        doc.addPage();
        yPosition = 20;
        return addText(text, yPosition, options);
      }
      
      doc.text(text, marginLeft, y, finalOptions);
      // Approximate height taken by text to return next Y position
      const lines = doc.splitTextToSize(text, finalOptions.maxWidth).length;
      return y + (lineHeight * lines);
    };
    
    // Helper function to add section heading
    const addSectionHeading = (text: string, y: number) => {
      doc.setFont('helvetica', 'bold');
      y = addText(text, y);
      doc.line(marginLeft, y, pageWidth, y);
      doc.setFont('helvetica', 'normal');
      return y + lineHeight;
    };
    
    // 1. Identification
    yPosition = addSectionHeading('1. IDENTIFICAÇÃO DO COMPONENTE CURRICULAR', yPosition);
    yPosition = addText(`Nome: ${data.identification.courseName}`, yPosition + lineHeight);
    yPosition = addText(`Abreviatura: ${data.identification.courseAbbreviation}`, yPosition);
    yPosition = addText(`Professor: ${data.identification.professorName}`, yPosition);
    yPosition = addText(`Matrícula SIAPE: ${data.identification.siapeCode}`, yPosition);
    yPosition = addText(`Carga Horária Total: ${data.identification.totalHours}h`, yPosition);
    yPosition = addText(`Carga Horária Semanal: ${data.identification.weeklyHours}h`, yPosition);
    yPosition = addText(`Carga Horária Teórica: ${data.identification.theoreticalHours}h`, yPosition);
    yPosition = addText(`Carga Horária Prática: ${data.identification.practicalHours}h`, yPosition);
    yPosition = addText(`Carga Horária Presencial: ${data.identification.inPersonHours}h`, yPosition);
    
    // 2. Syllabus
    yPosition = addSectionHeading('2. EMENTA', yPosition + lineHeight);
    yPosition = addText(`${data.syllabus || "Não informado"}`, yPosition + lineHeight);
    
    // 3. Objectives
    yPosition = addSectionHeading('3. OBJETIVOS DO COMPONENTE CURRICULAR', yPosition + lineHeight);
    yPosition = addText(`${data.objectives || "Não informado"}`, yPosition + lineHeight);
    
    // 4. Justification
    yPosition = addSectionHeading('4. JUSTIFICATIVA DA MODALIDADE DE ENSINO', yPosition + lineHeight);
    yPosition = addText(`${data.justification || "Não informado"}`, yPosition + lineHeight);
    
    // 5. Extension
    yPosition = addSectionHeading('5. ATIVIDADES CURRICULARES DE EXTENSÃO', yPosition + lineHeight);
    yPosition = addText(`Possui atividades de extensão: ${data.extension.hasExtension ? "Sim" : "Não"}`, yPosition + lineHeight);
    if (data.extension.hasExtension) {
      yPosition = addText(`Tipo de Atividade: ${data.extension.type}`, yPosition);
      yPosition = addText(`Resumo: ${data.extension.summary}`, yPosition);
      yPosition = addText(`Justificativa: ${data.extension.justification}`, yPosition);
      yPosition = addText(`Objetivos: ${data.extension.objectives}`, yPosition);
      yPosition = addText(`Envolvimento com a comunidade: ${data.extension.communityInvolvement}`, yPosition);
    }
    
    // 6. Content
    yPosition = addSectionHeading('6. CONTEÚDO PROGRAMÁTICO', yPosition + lineHeight);
    data.content.byPeriod.forEach((period, index) => {
      yPosition = addText(`${period.period}:`, yPosition + lineHeight, { fontStyle: 'bold' });
      yPosition = addText(`Conteúdo: ${period.content}`, yPosition);
      yPosition = addText(`Relações Interdisciplinares: ${period.interdisciplinaryRelations}`, yPosition);
    });
    
    // 7. Methodology
    yPosition = addSectionHeading('7. PROCEDIMENTOS METODOLÓGICOS', yPosition + lineHeight);
    yPosition = addText(`${data.methodology || "Não informado"}`, yPosition + lineHeight);
    
    // 8. Resources
    yPosition = addSectionHeading('8. RECURSOS E INFRAESTRUTURA', yPosition + lineHeight);
    yPosition = addText(`${data.resources || "Não informado"}`, yPosition + lineHeight);
    
    // 9. Visits
    yPosition = addSectionHeading('9. VISITAS TÉCNICAS E AULAS PRÁTICAS', yPosition + lineHeight);
    if (data.visits.length > 0 && data.visits[0].location) {
      data.visits.forEach((visit, index) => {
        yPosition = addText(`Visita ${index + 1}:`, yPosition + lineHeight, { fontStyle: 'bold' });
        yPosition = addText(`Local: ${visit.location}`, yPosition);
        yPosition = addText(`Data prevista: ${visit.date}`, yPosition);
        yPosition = addText(`Materiais necessários: ${visit.materials}`, yPosition);
      });
    } else {
      yPosition = addText(`Não há visitas técnicas planejadas.`, yPosition + lineHeight);
    }
    
    // 10. Schedule
    yPosition = addSectionHeading('10. CRONOGRAMA DE DESENVOLVIMENTO', yPosition + lineHeight);
    data.schedule.forEach((period, periodIndex) => {
      yPosition = addText(`${period.period}:`, yPosition + lineHeight, { fontStyle: 'bold' });
      period.activities.forEach((activity, activityIndex) => {
        yPosition = addText(`Data: ${activity.date}`, yPosition);
        yPosition = addText(`Atividades do docente: ${activity.teacherActivities}`, yPosition);
        yPosition = addText(`Atividades do discente: ${activity.studentActivities}`, yPosition);
      });
    });
    
    // 11. Bibliography
    yPosition = addSectionHeading('11. BIBLIOGRAFIA', yPosition + lineHeight);
    yPosition = addText(`Bibliografia Básica:`, yPosition + lineHeight, { fontStyle: 'bold' });
    yPosition = addText(`${data.bibliography.basic || "Não informado"}`, yPosition);
    yPosition = addText(`Bibliografia Complementar:`, yPosition + lineHeight, { fontStyle: 'bold' });
    yPosition = addText(`${data.bibliography.complementary || "Não informado"}`, yPosition);
    
    // 12. Signatures
    yPosition = addSectionHeading('12. ASSINATURAS', yPosition + lineHeight);
    yPosition = addText(`Professor: ${data.signatures.professorSignature}`, yPosition + lineHeight);
    yPosition = addText(`Coordenador: ${data.signatures.coordinatorSignature}`, yPosition);
    yPosition = addText(`Componente Curricular: ${data.signatures.componentName}`, yPosition);
    yPosition = addText(`Curso: ${data.signatures.courseName}`, yPosition);
    yPosition = addText(`Data: ${data.signatures.date}`, yPosition);
    
    // Date generated
    yPosition = addText(`Documento gerado em: ${new Date().toLocaleDateString('pt-BR')}`, yPosition + lineHeight * 2);
    
    // Save the PDF
    doc.save(`${plan.title || 'plano-de-ensino'}.pdf`);
  } catch (error) {
    console.error('Error exporting plan as PDF:', error);
    throw new Error('Failed to export plan as PDF');
  }
};
