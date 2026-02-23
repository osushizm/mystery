import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportElementToPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(filename);
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}

export function createMainStoryPDF(
  title: string,
  description: string,
  timeline: Array<{ event_time: string; event_description: string }>,
  characters: Array<{ name: string; role?: string; backstory?: string }>
): string {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  // Title
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text(title, margin, yPosition);
  yPosition += 15;

  // Description
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'normal');
  const descriptionLines = pdf.splitTextToSize(description, maxWidth);
  pdf.text(descriptionLines, margin, yPosition);
  yPosition += descriptionLines.length * 7 + 10;

  // Timeline Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  pdf.text('タイムライン', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');

  timeline.forEach((event) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(`${event.event_time}`, margin, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    const eventLines = pdf.splitTextToSize(event.event_description, maxWidth - 5);
    pdf.text(eventLines, margin + 5, yPosition);
    yPosition += eventLines.length * 6 + 3;
  });

  yPosition += 5;

  // Characters Section
  pdf.setFontSize(14);
  pdf.setFont(undefined, 'bold');
  if (yPosition > pageHeight - 20) {
    pdf.addPage();
    yPosition = 20;
  }
  pdf.text('登場人物', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  characters.forEach((character) => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(character.name, margin, yPosition);
    yPosition += 6;

    if (character.role) {
      pdf.setFont(undefined, 'italic');
      pdf.text(`役割: ${character.role}`, margin + 5, yPosition);
      yPosition += 5;
    }

    if (character.backstory) {
      pdf.setFont(undefined, 'normal');
      const backstoryLines = pdf.splitTextToSize(character.backstory, maxWidth - 5);
      pdf.text(backstoryLines, margin + 5, yPosition);
      yPosition += backstoryLines.length * 5;
    }

    yPosition += 3;
  });

  return pdf.output('dataurlstring');
}

export function createCharacterSheetPDF(
  scenarioTitle: string,
  character: {
    name: string;
    role?: string;
    backstory?: string;
    goal?: string;
  }
): string {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 15;
  const maxWidth = pageWidth - 2 * margin;

  // Scenario Title
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'italic');
  pdf.text(`シナリオ: ${scenarioTitle}`, margin, yPosition);
  yPosition += 10;

  // Character Name
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text(character.name, margin, yPosition);
  yPosition += 15;

  // Role
  if (character.role) {
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`役割: ${character.role}`, margin, yPosition);
    yPosition += 10;
  }

  // Backstory
  if (character.backstory) {
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('背景ストーリー', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const backstoryLines = pdf.splitTextToSize(character.backstory, maxWidth);
    pdf.text(backstoryLines, margin, yPosition);
    yPosition += backstoryLines.length * 6 + 5;
  }

  // Goal/Secret
  if (character.goal) {
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('目的・秘密', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const goalLines = pdf.splitTextToSize(character.goal, maxWidth);
    pdf.text(goalLines, margin, yPosition);
    yPosition += goalLines.length * 6;
  }

  return pdf.output('dataurlstring');
}

export function createClueCardsPDF(
  scenarioTitle: string,
  cards: Array<{
    title: string;
    content: string;
    card_type: string;
  }>
): string {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  let cardIndex = 0;
  const cardsPerPage = 6; // 2x3 layout
  let pageCreated = false;

  cards.forEach((card, index) => {
    if (index % cardsPerPage === 0) {
      if (pageCreated) {
        pdf.addPage();
      }
      pageCreated = true;
      cardIndex = 0;
    }

    const row = Math.floor(cardIndex / 3);
    const col = cardIndex % 3;

    const cardWidth = 90;
    const cardHeight = 60;
    const xStart = 15 + col * (cardWidth + 5);
    const yStart = 15 + row * (cardHeight + 5);

    // Draw card border
    pdf.setDrawColor(100, 100, 100);
    pdf.rect(xStart, yStart, cardWidth, cardHeight);

    // Card title
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text(card.title, xStart + 3, yStart + 8, { maxWidth: cardWidth - 6 });

    // Card type
    pdf.setFontSize(7);
    pdf.setFont(undefined, 'italic');
    pdf.text(`[${card.card_type}]`, xStart + 3, yStart + 15);

    // Card content
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    const contentLines = pdf.splitTextToSize(card.content, cardWidth - 6);
    pdf.text(contentLines.slice(0, 4), xStart + 3, yStart + 20, {
      maxWidth: cardWidth - 6,
    });

    cardIndex++;
  });

  return pdf.output('dataurlstring');
}
