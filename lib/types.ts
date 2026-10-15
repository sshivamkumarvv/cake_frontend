export type CakeCategory =
  | 'All'
  | 'Bestsellers'
  | 'Celebration Cakes'
  | 'Birthday Cakes'
  | 'Chocolate Decadence'
  | 'Eggless Collection'
  | 'Custom & Wedding';

export interface CakeOptionWeight {
  label: string;
  value: string;
  multiplier: number;
}

export interface CakeOptionFlavor {
  id: string;
  name: string;
  notes: string;
  extraPrice: number;
}

export interface CakeProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  price: number; // base price in INR for 0.5kg or standard size
  originalPrice?: number;
  category: CakeCategory;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isEggless: boolean;
  images: string[];
  weights: CakeOptionWeight[];
  flavors: CakeOptionFlavor[];
  egglessChoiceAvailable: boolean;
  preparationTime: string;
  servings: string;
  shelfLife: string;
  storage: string;
  ingredients: string[];
  allergens: string[];
  customMessageLimit?: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  videoUrl: string;
  summary: string;
  resources?: { name: string; type: string; size: string }[];
}

export interface CourseSection {
  id: string;
  title: string;
  duration: string;
  lessons: CourseLesson[];
}

export interface BakingCourse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Masterclass' | 'All Levels';
  category: 'Celebration Cakes' | 'Buttercream & Piping' | 'French Pastry' | 'Eggless Baking' | 'Breads & Sourdough' | 'Chocolate Art';
  price: number;
  originalPrice: number;
  rating: number;
  studentCount: number;
  duration: string;
  lessonCount: number;
  thumbnail: string;
  previewVideoUrl: string;
  instructor: {
    name: string;
    role: string;
    bio: string;
    image: string;
    credentials: string[];
  };
  highlights: string[];
  whatYouWillLearn: string[];
  includes: string[];
  prerequisites: string[];
  curriculum: CourseSection[];
  faqs: { question: string; answer: string }[];
}

export interface CartItem {
  cartItemId: string;
  type: 'cake' | 'course';
  productId: string;
  slug: string;
  title: string;
  image: string;
  unitPrice: number;
  quantity: number;
  weight?: string;
  flavor?: string;
  isEggless?: boolean;
  customMessage?: string;
  specialInstructions?: string;
  deliveryDate?: string;
  deliverySlot?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Received' | 'Baking' | 'Quality Check' | 'Out for Delivery' | 'Delivered';
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    landmark?: string;
    city: string;
    pincode: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  deliveryDate: string;
  deliverySlot: string;
  orderNotes?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  courseTitle: string;
  thumbnail: string;
  instructorName: string;
  enrolledDate: string;
  progressPercent: number;
  completedLessonIds: string[];
  lastLessonId: string;
  lastLessonTitle: string;
  totalLessons: number;
  certificateEarned: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
}

export interface DeliverySlot {
  id: string;
  time: string;
  label: string;
  price: number;
  available: boolean;
}
