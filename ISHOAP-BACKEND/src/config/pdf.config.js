import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export function generateReceipt(order) {
    const receiptsDir = path.resolve('public', 'receipts');

    // Ensure the directory exists
    if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
    }

    // Create a document
    const doc = new PDFDocument({ margin: 50 });

    const filePath = path.join(receiptsDir, `receipt-${order._id}.pdf`);

    // Stream the output to a file
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);
    doc.font('Helvetica');

    // Company Information
    doc.fontSize(16)
        .text('Ishaop', 50, 50)
        .fontSize(10)
        .text('Your Trust, Our Priority - Delivering Excellence Every Time!', 50, 70)
        .text('Ameerpet', 50, 85)
        .text('Hyderabad, 500016', 50, 100)
        .text('Phone: (+91) 7462070700', 50, 115);

    // Customer Information
    doc.text('TO:', 50, 150)
        .text(order.AddressId.name, 50, 165)
        .text(`${order.AddressId.city}, ${order.AddressId.state}`, 50, 180)
        .text(`${order.AddressId.city}, ${order.AddressId.postalCode}`, 50, 195)
        .text(order.AddressId.mobile, 50, 210);

    // Invoice Number, Date
    doc.text('Receipt no:', 400, 50)
        .text(order._id, 470, 50)
        .text('DATE:', 400, 70)
        .text(new Date().toLocaleDateString(), 470, 70);

    // Draw a line
    doc.moveTo(50, 250).lineTo(550, 250).stroke();

    // Table Headers
    doc.fontSize(12)
        .text('NAME', 50, 260)
        .text('QUANTITY', 250, 260, { width: 90, align: 'right' })
        .text('PRICE', 340, 260, { width: 90, align: 'right' })
        .text('TOTAL', 430, 260, { width: 90, align: 'right' });

    // Draw another line
    doc.moveTo(50, 280).lineTo(550, 280).stroke();

    // Add order items
    let position = 300;
    order.products.forEach(product => {
        let description = product.productId.name || 'Unknown Product';
        const maxLength = 45; 
        if (description.length > maxLength) {
            description = description.substring(0, maxLength - 3) + '...'; // Trim and add ellipsis
        }

        const quantity = product.quantity || 0;
        const price = product.productId.price || 0;
        const total = quantity * price;

        doc.fontSize(10)
            .text(description, 50, position, { width: 180, align: 'left' })  // Adjusted width
            .text(quantity.toString(), 250, position, { width: 90, align: 'right' })
            .text(`${price.toFixed(2)}`, 340, position, { width: 90, align: 'right' })
            .text(`${total.toFixed(2)}`, 430, position, { width: 90, align: 'right' });

        position += 20;
    });

    // Draw total line
    doc.moveTo(50, position + 10).lineTo(550, position + 10).stroke();
    doc.fontSize(12)
        .text('TOTAL:', 380, position + 20, { width: 90, align: 'right' })
        .text(`${order.totalPrice.toFixed(2)}`, 470, position + 20, { width: 90, align: 'right' });

    // Footer
    const footerY = doc.page.height - 100;
    doc.fontSize(10)
        .text('Thank you for your shopping with Ishaop!', 50, footerY + 20, { align: 'center' });

    // Finalize the PDF
    doc.end();

    return filePath;
}
