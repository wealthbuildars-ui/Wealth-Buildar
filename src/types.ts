export type EarningCategory = 'AFFILIATE_MARKETING' | 'FREELANCING' | 'DIGITAL_PRODUCTS' | 'FINANCIAL_EDUCATION';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  monthlyGoal: number;
  currentSavedBalance: number;
  dateCreated: number;
  badges: string[];
  selectedPath: string; // 'All' | 'Affiliate' | 'Freelancing' | 'Digital Products' | 'Education'
  accountStatus: 'Unverified' | 'Pending Verification' | 'Approved' | 'Rejected' | 'Expired';
  paymentSubmittedTime: number;
  paymentProofUrl: string;
  paymentProofName: string;
  rejectionReason: string;
  isAdmin: boolean;
  referralCode: string;
  referredByCode: string;
  referralLinkClicks: number;
  referredUsersCount: number;
  referralRewardsEarned: number;
  referralBalance: number;
  
  // Multi-Vendor Marketplace Seller
  isSeller: boolean;
  sellerBusinessName: string;
  sellerStatus: 'Approved' | 'Pending' | 'Rejected' | 'Unverified';
  sellerBalance: number;
  sellerPendingBalance: number;
  sellerTotalSales: number;
  
  // Verification details
  sellerNationalId: string;
  sellerBusinessRegistration: string;
  sellerPhoneNumber: string;
  sellerEmailVerified: boolean;
  sellerVerificationStatus: 'Unverified' | 'Pending Verification' | 'Verified' | 'Rejected';
  isVerifiedSeller: boolean;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  category: EarningCategory;
  readTimeMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  earningPotential: string;
  iconName: string;
  isFeatured: boolean;
}

export interface QuizQuestion {
  id: string;
  category: EarningCategory;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface SavedItem {
  id: string;
  articleId: string;
  timestamp: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: number;
  isPinned: boolean;
  author: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // empty if sent to all
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'approval' | 'rejection' | 'payment' | 'announcement' | 'info';
}

export interface AdminSettings {
  registrationFee: number;
  isTimerEnabled: boolean;
  bankName: string;
  accountNumber: string;
  accountName: string;
  siteName: string;
  siteDescription: string;
  websiteLogoUrl: string;
  websiteBannerUrl: string;
  isReferralProgramEnabled: boolean;
  referralRewardAmount: number;
  grantRewardOnStatus: string; // 'Approved' | 'Pending' | 'Registration'
  homepageHeroTitle: string;
  homepageHeroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string;
  businessHours: string;
  googleMapsAddress: string;
  footerCopyright: string;
  websiteColorPrimary: string;
  websiteColorSecondary: string;
  websiteColorBackground: string;
  featuresList: string[]; // List of "title|description"
  faqsList: string[]; // List of "question|answer"
  testimonialsList: string[]; // List of "author|feedback"
  
  // Multi-vendor revenue sharing and discount
  sellerRevenuePercent: number;
  affiliateRevenuePercent: number;
  platformRevenuePercent: number;
  isCustomerDiscountEnabled: boolean;
  customerDiscountPercent: number;
}

export interface ReferralRecord {
  id: string;
  referrerUid: string;
  referredUid: string;
  referredEmail: string;
  referredDisplayName: string;
  referralCode: string;
  status: 'Pending' | 'Active' | 'Rejected' | 'Expired';
  dateCreated: number;
  rewardAmount: number;
  isRewardGranted: boolean;
  rewardGrantedTime: number;
}

export interface RecentActivity {
  id: string;
  userId: string;
  title: string;
  description: string;
  timestamp: number;
}

export interface LeaderboardEntry {
  displayName: string;
  referralsCount: number;
  totalRewards: number;
  rank: number;
}

export interface TicketMessage {
  id: string;
  senderUid: string;
  senderName: string;
  message: string;
  timestamp: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  status: 'Open' | 'Replied' | 'Closed';
  dateCreated: number;
  lastUpdated: number;
  messages: TicketMessage[];
}

export interface AffiliateProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  images: string[];
  price: number;
  discountPrice: number | null;
  currency: string;
  affiliateLink: string;
  merchantName: string;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  dateAdded: number;
  lastUpdated: number;
  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  isArchived: boolean;
  partnerId: string;
  tags: string[];
  commissionPercent: number;
  
  // Multi-Vendor Marketplace fields
  status: 'Pending Review' | 'Approved' | 'Rejected';
  sellerId: string; // empty if created by admin
  sellerName: string;
  rejectionReason: string;
  availableQuantity: number;
  
  // Delivery fields
  deliveryFee: number;
  deliveryRegions: string;
  estimatedDeliveryTime: string;
}

export interface ProductReferralSale {
  id: string;
  referrerUid: string;
  referrerEmail: string;
  productId: string;
  productName: string;
  productPrice: number;
  buyerName: string;
  buyerEmail: string;
  salePrice: number;
  commissionEarned: number;
  dateSubmitted: number;
  status: 'Pending Approval' | 'Completed' | 'Rejected';
  paymentReference: string;
  rejectionReason: string;
}

export interface WithdrawalRequest {
  id: string;
  userUid: string;
  userEmail: string;
  amount: number;
  payoutMethod: string;
  payoutDetails: string;
  dateSubmitted: number;
  status: 'Pending Approval' | 'Approved' | 'Paid' | 'Rejected';
  completionDate: number;
  transactionHash: string;
  walletType: 'Affiliate' | 'Seller';
  adminNotes: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  originalPrice: number;
  discountAmount: number;
  finalPayableAmount: number;
  affiliateId: string;
  sellerId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled' | 'Refunded';
  dateCreated: number;
  lastUpdated: number;
  shippingAddress: string;
  paymentMethod: string;
  couponCode: string;
  deliveryFee: number;
  paymentProofUrl: string;
  paymentReference: string;
  adminNotes: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  rating: number; // 1-5
  reviewText: string;
  imageUrl?: string | null;
  dateCreated: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string; // 'admin' or sellerUid
  message: string;
  timestamp: number;
}

export interface Coupon {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  discountValue: number;
  expiryDate: number;
  usageLimit: number;
  usageCount: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  timestamp: number;
}

export interface AdCampaign {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  description: string;
  bannerUrl: string;
  videoUrl: string;
  destinationUrl: string;
  category: string;
  adType: string; // e.g. "Homepage Banner", "Sidebar Banner"
  startDate: number;
  endDate: number;
  status: 'Awaiting Payment' | 'Pending Approval' | 'Active' | 'Paused' | 'Rejected' | 'Completed' | 'Expired';
  budget: number;
  pricePaid: number;
  planName: string; // Basic, Standard, Premium
  dateCreated: number;
  isFeatured: boolean;
  adminNotes: string;
  viewsCount: number;
  clicksCount: number;
  paymentProofUrl: string;
  paymentReference: string;
}

export interface AdPackage {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  adType: string;
}
