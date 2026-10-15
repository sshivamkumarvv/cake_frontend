import { BAKERY_INFO } from './data';
import { CartItem } from './types';

export interface OrderDetailsForWhatsApp {
  orderId: string;
  customerName: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  deliveryDate: string;
  deliverySlot: string;
  addressLine: string;
  landmark?: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  orderNotes?: string;
}

export function generateWhatsAppOrderText(order: OrderDetailsForWhatsApp): string {
  const itemsList = order.items
    .map((item, idx) => {
      const details = [
        `• *${item.quantity}x ${item.title}*`,
        `  - Weight: ${item.weight || 'Standard'}`,
        item.flavor ? `  - Flavor: ${item.flavor}` : null,
        item.isEggless ? `  - Dietary: 100% Eggless 🌱` : null,
        item.customMessage ? `  - Message on Cake: "${item.customMessage}"` : null,
        `  - Price: ₹${(item.unitPrice * item.quantity).toLocaleString('en-IN')}`,
      ]
        .filter(Boolean)
        .join('\n');
      return details;
    })
    .join('\n\n');

  const paymentLabel =
    order.paymentMethod === 'upi'
      ? 'Instant UPI (Send QR / Link)'
      : order.paymentMethod === 'cod'
      ? 'Pay on Delivery'
      : 'Card Payment';

  const message = [
    `🎂 *NEW CAKE ORDER - BAKEISTRY STUDIO*`,
    `━━━━━━━━━━━━━━━━━━`,
    `*Order Reference:* #${order.orderId}`,
    `*Customer:* ${order.customerName}`,
    `*Contact Phone:* +91 ${order.phone}`,
    ``,
    `📋 *ORDER DETAILS:*`,
    itemsList,
    ``,
    `📅 *DELIVERY SCHEDULE:*`,
    `• Date: *${order.deliveryDate}*`,
    `• Slot: *${order.deliverySlot}*`,
    ``,
    `📍 *DELIVERY ADDRESS:*`,
    `${order.addressLine}`,
    order.landmark ? `Landmark: ${order.landmark}` : null,
    `${order.city} - ${order.pincode}`,
    ``,
    `💰 *PAYMENT SUMMARY:*`,
    `• Subtotal: ₹${order.subtotal.toLocaleString('en-IN')}`,
    order.discount > 0 ? `• Discount: -₹${order.discount.toLocaleString('en-IN')}` : null,
    `• Delivery: ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}`,
    `• *Total Payable: ₹${order.total.toLocaleString('en-IN')}*`,
    `• *Payment Mode:* ${paymentLabel}`,
    order.orderNotes ? `\n📝 *Notes:* ${order.orderNotes}` : null,
    `━━━━━━━━━━━━━━━━━━`,
    `_Hello Chef Mitali, I have placed this celebration order on your website. Please confirm availability and dispatch!_`,
  ]
    .filter((line) => line !== null)
    .join('\n');

  return message;
}

export function getBakeryWhatsAppNumber(): string {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || BAKERY_INFO.whatsapp;
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits || '918198978095';
}

export function getWhatsAppOrderUrl(order: OrderDetailsForWhatsApp): string {
  const text = generateWhatsAppOrderText(order);
  const number = getBakeryWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getDirectCakeWhatsAppUrl(cake: {
  name: string;
  price: number;
  weight?: string;
  isEggless?: boolean;
}): string {
  const text = [
    `Hello Chef Mitali! 🎂`,
    `I would like to order the *${cake.name}*.`,
    cake.weight ? `• Selected Weight: ${cake.weight}` : null,
    cake.isEggless ? `• 100% Eggless: Yes 🌱` : null,
    `• Price: Starting from ₹${cake.price.toLocaleString('en-IN')}`,
    ``,
    `Could you please share your delivery availability for today/this week in ${BAKERY_INFO.location} (within 10 km)? Thank you!`,
  ]
    .filter(Boolean)
    .join('\n');

  const number = getBakeryWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getGeneralWhatsAppUrl(): string {
  const text = `Hello Chef Mitali! I have a question regarding cake orders & custom celebration designs at Bakeistry Studio.`;
  const number = getBakeryWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
