import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      orderId,
      customerName,
      phone,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      deliveryDate,
      deliverySlot,
      addressLine,
      landmark,
      city,
      pincode,
      paymentMethod,
      orderNotes,
    } = body;

    // Summarize items for single row in Google Sheets
    const itemsSummary = (items || [])
      .map(
        (it: any) =>
          `${it.quantity}x ${it.title} (${it.weight || '0.5kg'}, ${it.flavor || 'Signature'}${
            it.isEggless ? ', Eggless 🌱' : ''
          })`
      )
      .join(' | ');

    // Extract all cake inscriptions
    const cakeInscriptions = (items || [])
      .map((it: any) => (it.customMessage ? `"${it.customMessage}" (${it.title})` : null))
      .filter(Boolean)
      .join('; ') || 'None';

    const hasEggless = (items || []).some((it: any) => it.isEggless) ? 'Yes (100% Eggless 🌱)' : 'Standard';

    const fullAddress = [addressLine, landmark ? `Landmark: ${landmark}` : null, `${city || 'Bhiwadi'} - ${pincode || '301019'}`]
      .filter(Boolean)
      .join(', ');

    const cleanPhoneDigits = (phone || '').replace(/\D/g, '');
    const formattedPhone = cleanPhoneDigits.length === 10 ? `91${cleanPhoneDigits}` : cleanPhoneDigits;
    const customerWhatsAppUrl = formattedPhone ? `https://wa.me/${formattedPhone}` : '';

    const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    const payloadForSheets = {
      timestamp: istTime,
      orderId: orderId || `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'NEW - Awaiting WhatsApp Confirmation',
      customerName: customerName || 'Guest Customer',
      phone: phone || '',
      customerWhatsAppUrl,
      deliveryDate: deliveryDate || 'Today',
      deliverySlot: deliverySlot || 'Evening',
      itemsSummary,
      cakeInscription: cakeInscriptions,
      dietary: hasEggless,
      address: fullAddress,
      pincode: pincode || '301019',
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      total: total || subtotal || 0,
      paymentMethod: paymentMethod === 'cod' ? 'Cash / UPI on Delivery' : 'WhatsApp Instant UPI / QR',
      paymentStatus: paymentMethod === 'cod' ? 'Collect on Delivery' : 'Verify UPI Screenshot',
      notes: orderNotes || 'None',
    };

    // If user has configured Google Sheets Webhook App Script URL
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let sheetSynced = false;

    if (webhookUrl) {
      try {
        const sheetResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadForSheets),
        });
        if (sheetResponse.ok) {
          sheetSynced = true;
        }
      } catch (sheetError) {
        console.error('Failed to post to Google Sheets webhook:', sheetError);
      }
    } else {
      console.log('Order received (Google Sheets Webhook URL not yet configured):', payloadForSheets);
    }

    return NextResponse.json({
      success: true,
      orderId: payloadForSheets.orderId,
      sheetSynced,
      message: 'Order recorded successfully',
    });
  } catch (error: any) {
    console.error('Error processing order API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}
