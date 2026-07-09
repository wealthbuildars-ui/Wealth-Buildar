import { useState, useEffect } from 'react';
import { 
  UserProfile, Article, QuizQuestion, SupportTicket, 
  AdCampaign, AffiliateProduct, ProductReferralSale, 
  Order, WithdrawalRequest, AdminSettings, Announcement, 
  NotificationItem, ActivityLog, TicketMessage, Coupon, LeaderboardEntry
} from '../types';
import { ARTICLES, QUIZ_QUESTIONS, DEFAULT_PRODUCTS, DEFAULT_ADMIN_SETTINGS } from '../data';

// Seeds
const SEED_USERS: UserProfile[] = [
  {
    uid: "admin-uid",
    email: "wealthbuilder@gmail.com",
    displayName: "Platform Administrator",
    monthlyGoal: 10000,
    currentSavedBalance: 150000,
    dateCreated: Date.now() - 60 * 24 * 60 * 60 * 1000,
    badges: ["Pioneer", "Creator", "Fiduciary"],
    selectedPath: "All",
    accountStatus: "Approved",
    paymentSubmittedTime: 0,
    paymentProofUrl: "",
    paymentProofName: "",
    rejectionReason: "",
    isAdmin: true,
    referralCode: "ADMN777",
    referredByCode: "",
    referralLinkClicks: 230,
    referredUsersCount: 15,
    referralRewardsEarned: 22500,
    referralBalance: 12000,
    isSeller: true,
    sellerBusinessName: "Wealth Builder Official",
    sellerStatus: "Approved",
    sellerBalance: 34000,
    sellerPendingBalance: 5000,
    sellerTotalSales: 89000,
    sellerNationalId: "NID-9912",
    sellerBusinessRegistration: "RC-88123A",
    sellerPhoneNumber: "+2349011223344",
    sellerEmailVerified: true,
    sellerVerificationStatus: "Verified",
    isVerifiedSeller: true
  },
  {
    uid: "user-doe",
    email: "user@gmail.com",
    displayName: "John Doe",
    monthlyGoal: 5000,
    currentSavedBalance: 3240,
    dateCreated: Date.now() - 30 * 24 * 60 * 60 * 1000,
    badges: ["Pioneer", "Scholar"],
    selectedPath: "Affiliate",
    accountStatus: "Approved",
    paymentSubmittedTime: Date.now() - 30 * 24 * 60 * 60 * 1000,
    paymentProofUrl: "receipt.png",
    paymentProofName: "OPay Transfer Receipt",
    rejectionReason: "",
    isAdmin: false,
    referralCode: "JOHNDOE12",
    referredByCode: "ADMN777",
    referralLinkClicks: 42,
    referredUsersCount: 3,
    referralRewardsEarned: 4500,
    referralBalance: 3000,
    isSeller: false,
    sellerBusinessName: "",
    sellerStatus: "Unverified",
    sellerBalance: 0,
    sellerPendingBalance: 0,
    sellerTotalSales: 0,
    sellerNationalId: "",
    sellerBusinessRegistration: "",
    sellerPhoneNumber: "",
    sellerEmailVerified: false,
    sellerVerificationStatus: "Unverified",
    isVerifiedSeller: false
  }
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_01",
    title: "Welcome to Wealth Builder Web! 🎉",
    content: "We are thrilled to launch our brand new web platform. You can now build, test, and master digital income engines from any device! Explore your custom trackers and the newly unlocked Multi-Vendor Marketplace.",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    isPinned: true,
    author: "System Admin"
  },
  {
    id: "ann_02",
    title: "Marketplace Commission Rate Updated to 40%",
    content: "Attention all sellers and affiliates! We have set the base commission reward for high-demand digital items to a flat 40%. Start sharing custom referral links to instantly boost your passive earnings.",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    isPinned: false,
    author: "Financial Tutor"
  }
];

// Load helper
function getStorage<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) return defaultValue;
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, val: T): void {
  localStorage.setItem(key, JSON.stringify(val));
}

export function useAppStore() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getStorage('wb_current_user', null));
  const [users, setUsers] = useState<UserProfile[]>(() => getStorage('wb_users', SEED_USERS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStorage('wb_announcements', SEED_ANNOUNCEMENTS));
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>(() => getStorage('wb_saved_articles', []));
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getStorage('wb_tickets', []));
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => getStorage('wb_campaigns', []));
  const [products, setProducts] = useState<AffiliateProduct[]>(() => getStorage('wb_products', DEFAULT_PRODUCTS));
  const [sales, setSales] = useState<ProductReferralSale[]>(() => getStorage('wb_sales', []));
  const [orders, setOrders] = useState<Order[]>(() => getStorage('wb_orders', []));
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => getStorage('wb_withdrawals', []));
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => getStorage('wb_settings', DEFAULT_ADMIN_SETTINGS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getStorage('wb_notifications', []));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => getStorage('wb_activity_logs', []));

  // Sync to localStorage
  useEffect(() => { setStorage('wb_current_user', currentUser); }, [currentUser]);
  useEffect(() => { setStorage('wb_users', users); }, [users]);
  useEffect(() => { setStorage('wb_announcements', announcements); }, [announcements]);
  useEffect(() => { setStorage('wb_saved_articles', savedArticleIds); }, [savedArticleIds]);
  useEffect(() => { setStorage('wb_tickets', tickets); }, [tickets]);
  useEffect(() => { setStorage('wb_campaigns', campaigns); }, [campaigns]);
  useEffect(() => { setStorage('wb_products', products); }, [products]);
  useEffect(() => { setStorage('wb_sales', sales); }, [sales]);
  useEffect(() => { setStorage('wb_orders', orders); }, [orders]);
  useEffect(() => { setStorage('wb_withdrawals', withdrawals); }, [withdrawals]);
  useEffect(() => { setStorage('wb_settings', adminSettings); }, [adminSettings]);
  useEffect(() => { setStorage('wb_notifications', notifications); }, [notifications]);
  useEffect(() => { setStorage('wb_activity_logs', activityLogs); }, [activityLogs]);

  // Activity logger
  const logActivity = (userId: string, email: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: "log_" + Math.random().toString(36).substring(2),
      userId,
      userEmail: email,
      action,
      details,
      timestamp: Date.now()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Notification generator
  const sendNotification = (userId: string, title: string, message: string, type: 'approval' | 'rejection' | 'payment' | 'announcement' | 'info') => {
    const newNotif: NotificationItem = {
      id: "notif_" + Math.random().toString(36).substring(2),
      userId,
      title,
      message,
      timestamp: Date.now(),
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth Operations
  const login = (email: string): { success: boolean; message: string } => {
    const clean = email.toLowerCase().trim();
    const found = users.find(u => u.email.toLowerCase() === clean);
    if (found) {
      setCurrentUser(found);
      logActivity(found.uid, found.email, "Login", "Successfully signed into dashboard.");
      return { success: true, message: `Welcome back, ${found.displayName}!` };
    }
    return { success: false, message: "Account not found. Please sign up first." };
  };

  const signup = (email: string, name: string, referredBy: string = ""): { success: boolean; message: string } => {
    const cleanEmail = email.toLowerCase().trim();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, message: "Email is already registered. Please login." };
    }

    const referralCode = name.toUpperCase().replace(/\s+/g, '').substring(0, 8) + Math.floor(10 + Math.random() * 90);
    const isAdm = cleanEmail === "wealthbuilder@gmail.com" || cleanEmail === "chizaramamajorchizaram@gmail.com";

    const newUser: UserProfile = {
      uid: "usr_" + Math.random().toString(36).substring(2),
      email: cleanEmail,
      displayName: name,
      monthlyGoal: 5000,
      currentSavedBalance: 0,
      dateCreated: Date.now(),
      badges: ["Pioneer"],
      selectedPath: "All",
      accountStatus: isAdm ? "Approved" : "Unverified",
      paymentSubmittedTime: 0,
      paymentProofUrl: "",
      paymentProofName: "",
      rejectionReason: "",
      isAdmin: isAdm,
      referralCode: isAdm ? "ADMN" + Math.floor(100 + Math.random() * 900) : referralCode,
      referredByCode: referredBy.trim(),
      referralLinkClicks: 0,
      referredUsersCount: 0,
      referralRewardsEarned: 0,
      referralBalance: 0,
      isSeller: false,
      sellerBusinessName: "",
      sellerStatus: "Unverified",
      sellerBalance: 0,
      sellerPendingBalance: 0,
      sellerTotalSales: 0,
      sellerNationalId: "",
      sellerBusinessRegistration: "",
      sellerPhoneNumber: "",
      sellerEmailVerified: false,
      sellerVerificationStatus: "Unverified",
      isVerifiedSeller: false
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logActivity(newUser.uid, newUser.email, "Registration", "Registered a new account.");
    sendNotification(newUser.uid, "Welcome Pioneer! 🌟", "Verify your account payment to unlock active earning pathways.", "info");

    // Track referral clicks/count for the referrer immediately if supplied
    if (referredBy.trim()) {
      setUsers(currentUsers => currentUsers.map(u => {
        if (u.referralCode.toUpperCase() === referredBy.trim().toUpperCase()) {
          const clicks = u.referralLinkClicks + 1;
          const refCount = u.referredUsersCount + 1;
          
          // Generate notification for referrer
          sendNotification(u.uid, "New Referral Invited!", `${name} registered using your referral code. Commission will grant upon account verification!`, "info");
          
          return {
            ...u,
            referralLinkClicks: clicks,
            referredUsersCount: refCount
          };
        }
        return u;
      }));
    }

    return { success: true, message: "Account created successfully!" };
  };

  const logout = () => {
    if (currentUser) {
      logActivity(currentUser.uid, currentUser.email, "Logout", "Logged out of session.");
    }
    setCurrentUser(null);
  };

  const updateProfile = (name: string, goal: number, path: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, displayName: name, monthlyGoal: goal, selectedPath: path };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    logActivity(currentUser.uid, currentUser.email, "Profile Update", `Changed goal to $${goal} and path to ${path}.`);
  };

  const addBadge = (badge: string) => {
    if (!currentUser) return;
    if (currentUser.badges.includes(badge)) return;
    const updated = { ...currentUser, badges: [...currentUser.badges, badge] };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    sendNotification(currentUser.uid, "New Badge Unlocked! 🏆", `You earned the '${badge}' badge for your accomplishments.`, "info");
    logActivity(currentUser.uid, currentUser.email, "Badge Award", `Unlocked the '${badge}' badge.`);
  };

  // Submit payment
  const submitVerificationPayment = (proofName: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      accountStatus: "Pending Verification",
      paymentSubmittedTime: Date.now(),
      paymentProofName: proofName,
      paymentProofUrl: "simulated_receipt.png"
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    logActivity(currentUser.uid, currentUser.email, "Payment Upload", `Submitted verification receipt: ${proofName}`);
    sendNotification(currentUser.uid, "Verification Pending ⏳", "Our finance team is auditing your receipt. Verification completes shortly.", "payment");
  };

  // Admin approvals
  const approveUser = (uid: string) => {
    const userToApprove = users.find(u => u.uid === uid);
    if (!userToApprove) return;

    const refCode = userToApprove.referralCode || (userToApprove.displayName.toUpperCase().replace(/\s+/g, '') + Math.floor(10 + Math.random() * 90));
    const updated: UserProfile = {
      ...userToApprove,
      accountStatus: "Approved",
      rejectionReason: "",
      referralCode: refCode
    };

    setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
    sendNotification(uid, "Account Activated! 🎉", "Your verification payment was approved. Welcome to full active earning privileges!", "approval");
    logActivity("admin", "Admin", "User Approval", `Approved verification for ${userToApprove.email}`);

    // Grant commission reward to referrer if applicable
    if (userToApprove.referredByCode) {
      setUsers(currentUsers => currentUsers.map(u => {
        if (u.referralCode.toUpperCase() === userToApprove.referredByCode.toUpperCase()) {
          const rewardAmount = adminSettings.referralRewardAmount;
          const updatedBal = u.referralBalance + rewardAmount;
          const updatedTotalEarned = u.referralRewardsEarned + rewardAmount;
          
          sendNotification(u.uid, "Referral Bonus Received! 💰", `Earned $${rewardAmount} commission because ${userToApprove.displayName} activated their account!`, "payment");
          
          return {
            ...u,
            referralBalance: updatedBal,
            referralRewardsEarned: updatedTotalEarned
          };
        }
        return u;
      }));
    }

    if (currentUser?.uid === uid) {
      setCurrentUser(updated);
    }
  };

  const rejectUser = (uid: string, reason: string) => {
    const target = users.find(u => u.uid === uid);
    if (!target) return;

    const updated: UserProfile = {
      ...target,
      accountStatus: "Rejected",
      rejectionReason: reason
    };

    setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
    sendNotification(uid, "Verification Rejected ❌", `Your receipt was rejected: ${reason}. Please upload valid transaction proof.`, "rejection");
    logActivity("admin", "Admin", "User Rejection", `Rejected verification for ${target.email}. Reason: ${reason}`);

    if (currentUser?.uid === uid) {
      setCurrentUser(updated);
    }
  };

  // Article Save
  const toggleSaveArticle = (articleId: string) => {
    setSavedArticleIds(prev => {
      const isSaved = prev.includes(articleId);
      const next = isSaved ? prev.filter(id => id !== articleId) : [...prev, articleId];
      return next;
    });
  };

  // Support Tickets
  const createSupportTicket = (subject: string, desc: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: "tkt_" + Math.random().toString(36).substring(2),
      userId: currentUser.uid,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      subject,
      description: desc,
      status: "Open",
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
      messages: [{
        id: "msg_init",
        senderUid: currentUser.uid,
        senderName: currentUser.displayName,
        message: desc,
        timestamp: Date.now()
      }]
    };
    setTickets(prev => [newTicket, ...prev]);
    logActivity(currentUser.uid, currentUser.email, "Support Ticket", `Created support ticket: "${subject}"`);
    sendNotification(currentUser.uid, "Ticket Opened 📩", "An expert financial advisor will review and respond shortly.", "info");
  };

  const replyToTicket = (ticketId: string, text: string, senderUid: string, senderName: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newMsg: TicketMessage = {
          id: "msg_" + Math.random().toString(36).substring(2),
          senderUid,
          senderName,
          message: text,
          timestamp: Date.now()
        };
        const updatedMsgs = [...t.messages, newMsg];
        const isAdm = senderUid === "admin-uid" || users.find(u => u.uid === senderUid)?.isAdmin;
        return {
          ...t,
          messages: updatedMsgs,
          status: isAdm ? "Replied" as const : "Open" as const,
          lastUpdated: Date.now()
        };
      }
      return t;
    }));
  };

  // Withdrawal operations
  const requestWithdrawal = (amount: number, method: string, details: string, walletType: 'Affiliate' | 'Seller'): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Unauthorized" };
    
    const balance = walletType === 'Affiliate' ? currentUser.referralBalance : currentUser.sellerBalance;
    if (amount > balance) {
      return { success: false, message: `Insufficient funds in your ${walletType} wallet!` };
    }

    const newRequest: WithdrawalRequest = {
      id: "wdr_" + Math.random().toString(36).substring(2),
      userUid: currentUser.uid,
      userEmail: currentUser.email,
      amount,
      payoutMethod: method,
      payoutDetails: details,
      dateSubmitted: Date.now(),
      status: "Pending Approval",
      completionDate: 0,
      transactionHash: "",
      walletType,
      adminNotes: ""
    };

    // Deduct from local user state
    const updatedUser = {
      ...currentUser,
      referralBalance: walletType === 'Affiliate' ? currentUser.referralBalance - amount : currentUser.referralBalance,
      sellerBalance: walletType === 'Seller' ? currentUser.sellerBalance - amount : currentUser.sellerBalance
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updatedUser : u));
    setWithdrawals(prev => [newRequest, ...prev]);

    logActivity(currentUser.uid, currentUser.email, "Withdrawal Request", `Requested withdrawal of $${amount} via ${method}`);
    sendNotification(currentUser.uid, "Withdrawal Submitted 💸", `Payout request for $${amount} is processing.`, "payment");

    return { success: true, message: `Withdrawal request for $${amount} submitted!` };
  };

  const processWithdrawal = (id: string, approve: boolean, notes: string = "") => {
    const request = withdrawals.find(w => w.id === id);
    if (!request) return;

    const hash = approve ? "0x" + Math.random().toString(16).substring(2, 10) + "txhash" : "";
    const updatedWithdrawals = withdrawals.map(w => {
      if (w.id === id) {
        return {
          ...w,
          status: approve ? ("Paid" as const) : ("Rejected" as const),
          completionDate: approve ? Date.now() : 0,
          transactionHash: hash,
          adminNotes: notes
        };
      }
      return w;
    });

    setWithdrawals(updatedWithdrawals);

    // If rejected, refund the user
    if (!approve) {
      const userToRefund = users.find(u => u.uid === request.userUid);
      if (userToRefund) {
        const refunded: UserProfile = {
          ...userToRefund,
          referralBalance: request.walletType === 'Affiliate' ? userToRefund.referralBalance + request.amount : userToRefund.referralBalance,
          sellerBalance: request.walletType === 'Seller' ? userToRefund.sellerBalance + request.amount : userToRefund.sellerBalance
        };
        setUsers(prev => prev.map(u => u.uid === request.userUid ? refunded : u));
        sendNotification(request.userUid, "Withdrawal Rejected ❌", `Withdrawal of $${request.amount} was rejected: ${notes}. Funds refunded.`, "payment");
        
        if (currentUser?.uid === request.userUid) {
          setCurrentUser(refunded);
        }
      }
    } else {
      sendNotification(request.userUid, "Withdrawal Paid! 💸", `Your payout of $${request.amount} was processed. Tx Hash: ${hash}`, "payment");
    }

    logActivity("admin", "Admin", "Withdrawal processing", `${approve ? "Approved" : "Rejected"} payout request ${id}`);
  };

  // Become a Seller
  const registerSeller = (businessName: string, phone: string, nationalId: string, bizReg: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      isSeller: true,
      sellerBusinessName: businessName,
      sellerPhoneNumber: phone,
      sellerNationalId: nationalId,
      sellerBusinessRegistration: bizReg,
      sellerVerificationStatus: "Verified", // auto approved for instant demo experience
      isVerifiedSeller: true,
      sellerStatus: "Approved"
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    logActivity(currentUser.uid, currentUser.email, "Seller Registration", `Registered store: "${businessName}"`);
    sendNotification(currentUser.uid, "Merchant Store Activated 🏬", "Your seller panel is live. You can now post and manage items in the Multi-Vendor Marketplace.", "info");
    addBadge("SuperSeller");
  };

  // Add Product to Marketplace
  const addProduct = (
    name: string, desc: string, cat: string, price: number, qty: number, 
    specs: Record<string, string>, deliveryFee: number, img: string = ""
  ) => {
    if (!currentUser) return;
    const newProduct: AffiliateProduct = {
      id: "prod_" + Math.random().toString(36).substring(2),
      name,
      description: desc,
      category: cat,
      subcategory: "Digital Assets",
      brand: currentUser.sellerBusinessName || currentUser.displayName,
      images: [img || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"],
      price,
      discountPrice: null,
      currency: "USD",
      affiliateLink: "", // sold directly inside the app!
      merchantName: currentUser.sellerBusinessName || currentUser.displayName,
      stockStatus: "In Stock",
      rating: 5.0,
      reviewCount: 0,
      specifications: specs,
      dateAdded: Date.now(),
      lastUpdated: Date.now(),
      isFeatured: false,
      isTrending: false,
      isRecommended: false,
      isArchived: false,
      partnerId: "",
      tags: [cat, "Direct Sell"],
      commissionPercent: adminSettings.affiliateRevenuePercent,
      status: "Approved", // auto approved
      sellerId: currentUser.uid,
      sellerName: currentUser.sellerBusinessName || currentUser.displayName,
      rejectionReason: "",
      availableQuantity: qty,
      deliveryFee,
      deliveryRegions: "All Regions",
      estimatedDeliveryTime: "Immediate Delivery"
    };

    setProducts(prev => [newProduct, ...prev]);
    logActivity(currentUser.uid, currentUser.email, "Product Upload", `Uploaded digital product: "${name}"`);
    sendNotification(currentUser.uid, "Product Live! 🛍️", `"${name}" is active for sale in the Marketplace.`, "info");
  };

  // Purchase Product / Place Order
  const purchaseProduct = (
    productId: string, qty: number, couponCode: string, 
    shippingAddress: string, paymentMethod: 'Saved Balance' | 'Referral Balance'
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Unauthorized" };

    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: "Product not found" };

    if (product.availableQuantity < qty) {
      return { success: false, message: "Insufficient product quantity available" };
    }

    const origPrice = product.price * qty;
    let discount = 0;

    // Apply coupon
    if (couponCode.toUpperCase() === "WEALTH5" && adminSettings.isCustomerDiscountEnabled) {
      discount = origPrice * (adminSettings.customerDiscountPercent / 100);
    }

    const finalCost = origPrice - discount + (product.deliveryFee * qty);
    const balance = paymentMethod === 'Saved Balance' ? currentUser.currentSavedBalance : currentUser.referralBalance;

    if (balance < finalCost) {
      return { success: false, message: `Insufficient ${paymentMethod} to complete purchase ($${finalCost.toFixed(2)} needed).` };
    }

    // Deduct user balance
    const updatedUser = {
      ...currentUser,
      currentSavedBalance: paymentMethod === 'Saved Balance' ? currentUser.currentSavedBalance - finalCost : currentUser.currentSavedBalance,
      referralBalance: paymentMethod === 'Referral Balance' ? currentUser.referralBalance - finalCost : currentUser.referralBalance
    };

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updatedUser : u));

    // Create Order
    const newOrder: Order = {
      id: "ord_" + Math.random().toString(36).substring(2),
      buyerId: currentUser.uid,
      buyerName: currentUser.displayName,
      buyerEmail: currentUser.email,
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      quantity: qty,
      originalPrice: origPrice,
      discountAmount: discount,
      finalPayableAmount: finalCost,
      affiliateId: currentUser.referredByCode, // affiliate gets credit if referred
      sellerId: product.sellerId,
      status: "Processing",
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
      shippingAddress,
      paymentMethod,
      couponCode,
      deliveryFee: product.deliveryFee * qty,
      paymentProofUrl: "",
      paymentReference: "Paid via Local Balance",
      adminNotes: ""
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update Product Stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextQty = p.availableQuantity - qty;
        return {
          ...p,
          availableQuantity: nextQty,
          stockStatus: nextQty === 0 ? "Out of Stock" : nextQty < 5 ? "Low Stock" : "In Stock"
        };
      }
      return p;
    }));

    // Distribute Revenue Share to Seller if applicable
    if (product.sellerId) {
      const sellerPay = finalCost * (adminSettings.sellerRevenuePercent / 100);
      setUsers(currentUsers => currentUsers.map(u => {
        if (u.uid === product.sellerId) {
          return {
            ...u,
            sellerBalance: u.sellerBalance + sellerPay,
            sellerTotalSales: u.sellerTotalSales + finalCost
          };
        }
        return u;
      }));
      sendNotification(product.sellerId, "Product Sold! 📈", `Congratulations! "${product.name}" was purchased. $${sellerPay.toFixed(2)} credited to your seller wallet.`, "payment");
    }

    logActivity(currentUser.uid, currentUser.email, "Product Purchase", `Purchased ${qty}x "${product.name}"`);
    sendNotification(currentUser.uid, "Purchase Completed! 🛒", `You bought "${product.name}". Access instructions are on your dashboard.`, "info");
    addBadge("Consumer");

    return { success: true, message: "Purchase completed successfully!" };
  };

  // Submit Affiliate Product referral claim (Manual Submission in Member Screen)
  const submitProductReferralSale = (
    productId: string, productName: string, productPrice: number, 
    buyerName: string, buyerEmail: string, ref: string
  ) => {
    if (!currentUser) return;
    const commEarned = productPrice * (adminSettings.affiliateRevenuePercent / 100);
    const newSale: ProductReferralSale = {
      id: "sale_" + Math.random().toString(36).substring(2),
      referrerUid: currentUser.uid,
      referrerEmail: currentUser.email,
      productId,
      productName,
      productPrice,
      buyerName,
      buyerEmail,
      salePrice: productPrice,
      commissionEarned: commEarned,
      dateSubmitted: Date.now(),
      status: "Pending Approval",
      paymentReference: ref,
      rejectionReason: ""
    };

    setSales(prev => [newSale, ...prev]);
    logActivity(currentUser.uid, currentUser.email, "Affiliate Claim", `Submitted referral sale claim for "${productName}"`);
    sendNotification(currentUser.uid, "Referral Claim Submitted ⏳", `Commission claim for $${commEarned.toFixed(2)} is awaiting review.`, "payment");
  };

  const processReferralSale = (id: string, approve: boolean, rejectionReason: string = "") => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    setSales(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: approve ? ("Completed" as const) : ("Rejected" as const),
          rejectionReason
        };
      }
      return s;
    }));

    if (approve) {
      // Credit Referrer
      setUsers(currentUsers => currentUsers.map(u => {
        if (u.uid === sale.referrerUid) {
          return {
            ...u,
            referralBalance: u.referralBalance + sale.commissionEarned,
            referralRewardsEarned: u.referralRewardsEarned + sale.commissionEarned
          };
        }
        return u;
      }));
      sendNotification(sale.referrerUid, "Affiliate Claim Approved! 💸", `Your commission claim for $${sale.commissionEarned.toFixed(2)} was approved and credited!`, "payment");
    } else {
      sendNotification(sale.referrerUid, "Affiliate Claim Rejected ❌", `Rejection reason: ${rejectionReason}`, "payment");
    }

    logActivity("admin", "Admin", "Affiliate Claim Processing", `Processed claim ${id}: ${approve ? "Approved" : "Rejected"}`);
  };

  // Launch Ad Campaign
  const createAdCampaign = (
    title: string, desc: string, destUrl: string, 
    adType: string, budget: number, ref: string
  ) => {
    if (!currentUser) return;
    const newCampaign: AdCampaign = {
      id: "ad_" + Math.random().toString(36).substring(2),
      userId: currentUser.uid,
      userEmail: currentUser.email,
      title,
      description: desc,
      bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
      videoUrl: "",
      destinationUrl: destUrl,
      category: "Elearning Promo",
      adType,
      startDate: Date.now() + 2 * 24 * 60 * 60 * 1000, // starts in 2 days
      endDate: Date.now() + 32 * 24 * 60 * 60 * 1000,
      status: "Pending Approval",
      budget,
      pricePaid: budget,
      planName: budget >= 100 ? "Premium" : budget >= 50 ? "Standard" : "Basic",
      dateCreated: Date.now(),
      isFeatured: budget >= 100,
      adminNotes: "",
      viewsCount: 0,
      clicksCount: 0,
      paymentProofUrl: "simulated_ad_payment.png",
      paymentReference: ref
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    logActivity(currentUser.uid, currentUser.email, "Campaign Launch", `Launched ad campaign: "${title}"`);
    sendNotification(currentUser.uid, "Ad Campaign Processing 📈", `Your ad "${title}" is pending receipt auditing.`, "payment");
  };

  const processAdCampaign = (id: string, approve: boolean, notes: string = "") => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: approve ? ("Active" as const) : ("Rejected" as const),
          adminNotes: notes,
          // seed simulated analytics immediately
          viewsCount: approve ? Math.floor(500 + Math.random() * 2000) : 0,
          clicksCount: approve ? Math.floor(40 + Math.random() * 150) : 0
        };
      }
      return c;
    }));

    if (approve) {
      sendNotification(campaign.userId, "Ad Campaign Active! 🚀", `Your advertisement campaign "${campaign.title}" has been verified and is now serving impressions!`, "info");
    } else {
      sendNotification(campaign.userId, "Ad Campaign Rejected ❌", `Rejection reason: ${notes}`, "rejection");
    }

    logActivity("admin", "Admin", "Campaign Processing", `Processed ad campaign ${id}: ${approve ? "Approved" : "Rejected"}`);
  };

  // Save Settings
  const updateSettings = (settings: AdminSettings) => {
    setAdminSettings(settings);
    logActivity("admin", "Admin", "Settings Override", "Updated global platform administrative configurations.");
  };

  // Add Announcements
  const createAnnouncement = (title: string, content: string) => {
    const newAnn: Announcement = {
      id: "ann_" + Math.random().toString(36).substring(2),
      title,
      content,
      timestamp: Date.now(),
      isPinned: false,
      author: "Administrative Director"
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    logActivity("admin", "Admin", "Announcement", `Created platform announcement: "${title}"`);
    users.forEach(u => {
      sendNotification(u.uid, `Announcement: ${title}`, content.substring(0, 80) + "...", "announcement");
    });
  };

  // Leaderboard data calculation
  const getLeaderboardData = (): LeaderboardEntry[] => {
    const sorted = [...users]
      .filter(u => !u.isAdmin)
      .sort((a, b) => b.referralRewardsEarned - a.referralRewardsEarned);
    return sorted.map((u, i) => ({
      displayName: u.displayName,
      referralsCount: u.referredUsersCount,
      totalRewards: u.referralRewardsEarned,
      rank: i + 1
    }));
  };

  return {
    currentUser,
    users,
    announcements,
    savedArticleIds,
    tickets,
    campaigns,
    products,
    sales,
    orders,
    withdrawals,
    adminSettings,
    notifications,
    activityLogs,
    login,
    signup,
    logout,
    updateProfile,
    addBadge,
    submitVerificationPayment,
    approveUser,
    rejectUser,
    toggleSaveArticle,
    createSupportTicket,
    replyToTicket,
    requestWithdrawal,
    processWithdrawal,
    registerSeller,
    addProduct,
    purchaseProduct,
    submitProductReferralSale,
    processReferralSale,
    createAdCampaign,
    processAdCampaign,
    updateSettings,
    createAnnouncement,
    getLeaderboardData,
    logActivity,
    sendNotification
  };
}
