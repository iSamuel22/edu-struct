import { TeachingPlan } from './storage';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Export plan as PDF (modelo institucional)
export const exportAsPdf = (plan: TeachingPlan): void => {
  try {
    const { data } = plan;
    const doc = new jsPDF();

    // Configurações gerais
    const marginLeft = 20;
    const pageWidth = 170;
    let yPosition = 30;

    // Função para adicionar cabeçalho em todas as páginas
    const addHeader = () => {
      // Caminho relativo para a imagem
      const logoPath = '../../public/selo.png'; // Caminho relativo ao arquivo atual

      // Adiciona a imagem no PDF
      doc.addImage(logoPath, 'PNG', 90, 15, 30, 20); // Ajusta o valor de y para 15

      // Adiciona o texto do cabeçalho abaixo da imagem
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text("MINISTÉRIO DA EDUCAÇÃO", 105, 50, { align: 'center' });
      doc.text("SECRETARIA DE EDUCAÇÃO PROFISSIONAL E TECNOLÓGICA", 105, 55, { align: 'center' });
      doc.text("INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA FLUMINENSE", 105, 60, { align: 'center' });
      doc.setFont('helvetica', 'italic');
      doc.text("Campus Itaperuna", 105, 65, { align: 'center' });
      doc.setFont('helvetica', 'normal');
    };

    // Função para verificar e adicionar nova página se necessário
    const checkPageBreak = (y: number, spaceNeeded = 10) => {
      if (y + spaceNeeded > 280) {
        doc.addPage();
        addHeader(); // Adiciona cabeçalho em novas páginas
        return 30;
      }
      return y;
    };

    // Adiciona cabeçalho na primeira página
    addHeader();

    // Atualiza yPosition para começar abaixo do cabeçalho
    yPosition = 75; // Ajuste para começar abaixo do texto do cabeçalho

    // Título do documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    yPosition += 20; // Aumenta o espaço antes do título
    doc.text("PLANO DE ENSINO", 105, yPosition, { align: 'center' });
    yPosition += 10;

    // Informações do curso (centralizadas)
    doc.setFontSize(10);
    doc.text(`Curso: ${data.identification.courseName}`, 105, yPosition, { align: 'center' });
    yPosition += 5;
    doc.text(`Eixo Tecnológico Gestão e Negócios`, 105, yPosition + 5, { align: 'center' });
    yPosition += 5;
    doc.text(`Ano: ${plan.data.signatures.date}`, 105, yPosition + 10, { align: 'center' });
    yPosition += 20; // Aumentado de 20 para 30 para evitar sobreposição

    // 1. IDENTIFICAÇÃO DO COMPONENTE CURRICULAR (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '1) IDENTIFICAÇÃO DO COMPONENTE CURRICULAR',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Componente Curricular', data.identification.courseName || '-'],
        ['Abreviatura', data.identification.courseAbbreviation || '-'],
        ['Carga horária presencial', `${data.identification.inPersonHours}h/a` || '0h/a'],
        ['', '0h, 0h/a, 0%'], // Linha adicional conforme modelo
        ['Carga horária de atividades teóricas', data.identification.theoreticalHours ? `${data.identification.theoreticalHours}h/a` : '-'],
        ['Carga horária de atividades práticas', data.identification.practicalHours ? `${data.identification.practicalHours}h/a` : '-'],
        ['Carga horária de atividades de Extensão', data.identification.extensionHours ? `${data.identification.extensionHours}h/a` : '-'],
        ['Carga horária total', `${data.identification.totalHours}h/a` || '0h/a'],
        ['Carga horária/Aula Semanal', data.identification.weeklyHours ? `${data.identification.weeklyHours}h00min/ ${data.identification.weeklyHours}h/a` : '0h00min/ 0h/a'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 2. EMENTA (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '2) EMENTA',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Ementa', data.syllabus || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 3. OBJETIVOS (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '3) OBJETIVOS DO COMPONENTE CURRICULAR',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Objetivos', data.objectives || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 4. JUSTIFICATIVA (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '4) JUSTIFICATIVA DA MODALIDADE DE ENSINO',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Justificativa', data.justification || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 5. ATIVIDADES DE EXTENSÃO (Tabela única)
    yPosition = checkPageBreak(yPosition, 30);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '5) ATIVIDADES CURRICULARES DE EXTENSÃO',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ...(data.extension.hasExtension ? [
          ['Resumo:', data.extension.summary || '-'],
          ['Justificativa:', data.extension.justification || '-'],
          ['Objetivos:', data.extension.objectives || '-'],
          ['Envolvimento com a comunidade:', data.extension.communityInvolvement || '-'],
        ] : [['Atividades de Extensão', 'Não se aplica']]),
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 6. CONTEÚDO PROGRAMÁTICO (Tabela única)
    yPosition = checkPageBreak(yPosition, 30);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '6) CONTEÚDO',
          colSpan: 3,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['BIMESTRE', 'CONTEÚDO', 'RELAÇÃO INTERDISCIPLINAR'],
        ...data.content.byPeriod.map(period => [
          period.period,
          period.content || '-',
          period.interdisciplinaryRelations || '-'
        ]),
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 9,
        cellPadding: 5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'left' },
        1: { cellWidth: 70, halign: 'left' },
        2: { cellWidth: 70, halign: 'left' }
      },
      headStyles: { 
        fillColor: [220, 220, 220], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 7. METODOLOGIA (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '7) PROCEDIMENTOS METODOLÓGICOS',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Metodologia', data.methodology || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 8. RECURSOS (Tabela única)
    yPosition = checkPageBreak(yPosition, 20);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '8) RECURSOS FÍSICOS, MATERIAIS DIDÁTICOS E LABORATÓRIOS',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Recursos', data.resources || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        valign: 'middle',
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 9. VISITAS TÉCNICAS (Tabela única)
    yPosition = checkPageBreak(yPosition, 30);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '9) VISITAS TÉCNICAS E AULAS PRÁTICAS PREVISTAS',
          colSpan: 3,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Local/Empresa', 'Data Prevista', 'Materiais/Equipamentos/Ônibus'],
        ...((data.visits.length > 0 && data.visits[0].location) ? data.visits.map(visit => [
          visit.location || '-',
          visit.date || '-',
          visit.materials || '-'
        ]) : [['Visitas Técnicas', '', 'Não se aplica']]),
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 9,
        cellPadding: 5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, halign: 'left' },
        1: { cellWidth: 50, halign: 'left' },
        2: { cellWidth: 50, halign: 'left' }
      },
      headStyles: { 
        fillColor: [220, 220, 220], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 10. CRONOGRAMA (Tabela única)
    yPosition = checkPageBreak(yPosition, 30);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '10) CRONOGRAMA DE DESENVOLVIMENTO',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['Data', 'Conteúdo / Atividade docente e/ou discente'],
        ...data.schedule.flatMap(period => [
          [{
            content: period.period,
            colSpan: 2,
            styles: { fontStyle: 'bold', fillColor: [240, 240, 240] }
          }],
          ...period.activities.map(activity => [
            activity.date,
            `Docente: ${activity.teacherActivities || '-'}\nDiscente: ${activity.studentActivities || '-'}`
          ])
        ]),
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 9,
        cellPadding: 5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left',
        minCellHeight: 10
      },
      columnStyles: {
        0: { cellWidth: 30, halign: 'left' },
        1: { cellWidth: 140, halign: 'left' }
      },
      headStyles: { 
        fillColor: [220, 220, 220], 
        textColor: [0, 0, 0], 
        fontStyle: 'bold',
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      },
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 11. BIBLIOGRAFIA (Tabela única)
    yPosition = checkPageBreak(yPosition, 30);
    autoTable(doc, {
      startY: yPosition,
      theme: 'grid',
      body: [
        [{
          content: '11) BIBLIOGRAFIA',
          colSpan: 2,
          styles: { 
            fontSize: 12,
            fontStyle: 'bold',
            fillColor: [230, 230, 230],
            halign: 'center',
            lineColor: [0, 0, 0],
            lineWidth: 0.5
          }
        }],
        ['11.1) Bibliografia básica', data.bibliography.basic || '-'],
        ['11.2) Bibliografia complementar', data.bibliography.complementary || '-'],
      ],
      margin: { left: marginLeft },
      styles: { 
        fontSize: 9,
        cellPadding: 5,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
        halign: 'left'
      },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', halign: 'left' },
        1: { cellWidth: 100, halign: 'left' }
      },
      tableWidth: 'wrap',
      bodyStyles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.5
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 15; // Espaço após a tabela
    yPosition += 10; // Espaço adicional entre tópicos

    // 12. ASSINATURAS (Layout em linha)
    yPosition = checkPageBreak(yPosition, 30);
    doc.setFontSize(10);
    doc.text("Nome do Professor: ___________________________", marginLeft, yPosition);
    doc.text("Professor", marginLeft, yPosition + 10);
    
    doc.text("Nome do Coordenador: ___________________________", 105, yPosition);
    doc.text("Coordenador", 105, yPosition + 10);
    
    yPosition += 20;
    doc.text(`Componente Curricular: ${data.signatures.componentName || ''}`, marginLeft, yPosition);
    doc.text(`Curso: ${data.signatures.courseName || ''}`, marginLeft, yPosition + 10);

    // Data de geração
    doc.text(`Documento gerado em: ${new Date().toLocaleDateString('pt-BR')}`, marginLeft, 280);

    // Salvar o PDF
    doc.save(`${plan.title || 'plano-de-ensino'}.pdf`);
  } catch (error) {
    console.error('Error exporting plan as PDF:', error);
    throw new Error('Failed to export plan as PDF');
  }
};

// Export plan as plain text (mantido conforme original)
export const exportAsTxt = (plan: TeachingPlan): void => {
  // ... (código original mantido)
};