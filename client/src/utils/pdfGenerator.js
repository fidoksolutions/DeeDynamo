import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateQuotationPDF(quote) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', 14, 22);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote #: ${quote.quote_number}`, 14, 32);
  doc.text(`Date: ${new Date(quote.issue_date).toLocaleDateString()}`, 14, 38);
  if (quote.expiry_date)
    doc.text(`Valid until: ${new Date(quote.expiry_date).toLocaleDateString()}`, 14, 44);

  // Client
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 56);
  doc.setFont('helvetica', 'normal');
  doc.text(quote.client.name, 14, 62);
  if (quote.client.email) doc.text(quote.client.email, 14, 68);
  if (quote.client.phone) doc.text(quote.client.phone, 14, 74);

  // Line items table
  doc.autoTable({
    startY: 85,
    head: [['Description', 'Qty', 'Unit Price', 'Tax%', 'Total']],
    body: quote.items.map(i => [
      i.description,
      i.quantity,
      `$${parseFloat(i.unit_price).toFixed(2)}`,
      `${i.tax_rate}%`,
      `$${parseFloat(i.line_total).toFixed(2)}`,
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [30, 64, 175] },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Subtotal: $${parseFloat(quote.subtotal).toFixed(2)}`, 130, finalY);
  doc.text(`Tax: $${parseFloat(quote.tax_total).toFixed(2)}`, 130, finalY + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${parseFloat(quote.total).toFixed(2)}`, 130, finalY + 14);

  if (quote.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Notes: ${quote.notes}`, 14, finalY + 24);
  }

  doc.save(`Quotation-${quote.quote_number}.pdf`);
}

// Re-use same pattern for invoices — generateInvoicePDF(invoice)
