import { useState, useEffect } from 'react';
import { 
  UserProfile, Article, QuizQuestion, SupportTicket, 
  AdCampaign, AffiliateProduct, ProductReferralSale, 
  Order, WithdrawalRequest, AdminSettings, Announcement, 
  NotificationItem, ActivityLog, TicketMessage, Coupon, LeaderboardEntry
} from '../types';
import { ARTICLES, QUIZ_QUESTIONS, DEFAULT_PRODUCTS, DEFAULT_ADMIN_SETTINGS } from '../data';
import { 
  db, auth, doc, setDoc, getDoc, updateDoc, collection, onSnapshot, addDoc, deleteDoc
} from '../firebase';

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
    isVerifiedSeller: true,
    lessonStreakCount: 5,
    totalCommissionEarned: 22500,
    referrals: []
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
    isVerifiedSeller: false,
    lessonStreakCount: 3,
    totalCommissionEarned: 4500,
    referrals: []
  }
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_01",
    title: "Welcome to Wealth Builder Web! 🎉",
    content: "We are thrilled to launch our brand new web platform connected live to Firebase! You can now build, test, and master digital income engines with real-time cloud data sync across devices.",
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

// Local storage fallback helpers
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

  // Firebase Realtime Subscriptions & Seed Initialization
  useEffect(() => {
    // 1. Users Subscription
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (snapshot.empty) {
        // Seed Firestore users
        SEED_USERS.forEach((u) => setDoc(doc(db, 'users', u.uid), u));
      } else {
        const loadedUsers: UserProfile[] = snapshot.docs.map(d => d.data() as UserProfile);
        setUsers(loadedUsers);
        // Keep current user in sync
        if (currentUser) {
          const updatedCurrent = loadedUsers.find(u => u.uid === currentUser.uid);
          if (updatedCurrent) setCurrentUser(updatedCurrent);
        }
      }
    }, (err) => console.error("Firestore users sync error:", err));

    // 2. Announcements Subscription
    const unsubAnnouncements = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      if (snapshot.empty) {
        SEED_ANNOUNCEMENTS.forEach((a) => setDoc(doc(db, 'announcements', a.id), a));
      } else {
        const loaded: Announcement[] = snapshot.docs.map(d => d.data() as Announcement);
        setAnnouncements(loaded.sort((a, b) => b.timestamp - a.timestamp));
      }
    }, (err) => console.error("Firestore announcements sync error:", err));

    // 3. Products Subscription
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (snapshot.empty) {
        DEFAULT_PRODUCTS.forEach((p) => setDoc(doc(db, 'products', p.id), p));
      } else {
        setProducts(snapshot.docs.map(d => d.data() as AffiliateProduct));
      }
    }, (err) => console.error("Firestore products sync error:", err));

    // 4. Tickets Subscription
    const unsubTickets = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      setTickets(snapshot.docs.map(d => d.data() as SupportTicket).sort((a, b) => b.lastUpdated - a.lastUpdated));
    }, (err) => console.error("Firestore tickets sync error:", err));

    // 5. Campaigns Subscription
    const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snapshot) => {
      setCampaigns(snapshot.docs.map(d => d.data() as AdCampaign).sort((a, b) => b.dateCreated - a.dateCreated));
    }, (err) => console.error("Firestore campaigns sync error:", err));

    // 6. Sales Subscription
    const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      setSales(snapshot.docs.map(d => d.data() as ProductReferralSale).sort((a, b) => b.dateSubmitted - a.dateSubmitted));
    }, (err) => console.error("Firestore sales sync error:", err));

    // 7. Orders Subscription
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(d => d.data() as Order).sort((a, b) => b.dateCreated - a.dateCreated));
    }, (err) => console.error("Firestore orders sync error:", err));

    // 8. Withdrawals Subscription
    const unsubWithdrawals = onSnapshot(collection(db, 'withdrawals'), (snapshot) => {
      setWithdrawals(snapshot.docs.map(d => d.data() as WithdrawalRequest).sort((a, b) => b.dateSubmitted - a.dateSubmitted));
    }, (err) => console.error("Firestore withdrawals sync error:", err));

    // 9. Admin Settings Subscription
    const unsubSettings = onSnapshot(doc(db, 'adminSettings', 'global'), (docSnap) => {
      if (!docSnap.exists()) {
        setDoc(doc(db, 'adminSettings', 'global'), DEFAULT_ADMIN_SETTINGS);
      } else {
        setAdminSettings(docSnap.data() as AdminSettings);
      }
    }, (err) => console.error("Firestore settings sync error:", err));

    // 10. Notifications Subscription
    const unsubNotifs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
      setNotifications(snapshot.docs.map(d => d.data() as NotificationItem).sort((a, b) => b.timestamp - a.timestamp));
    }, (err) => console.error("Firestore notifications sync error:", err));

    // 11. Activity Logs Subscription
    const unsubLogs = onSnapshot(collection(db, 'activityLogs'), (snapshot) => {
      setActivityLogs(snapshot.docs.map(d => d.data() as ActivityLog).sort((a, b) => b.timestamp - a.timestamp));
    }, (err) => console.error("Firestore logs sync error:", err));

    return () => {
      unsubUsers();
      unsubAnnouncements();
      unsubProducts();
      unsubTickets();
      unsubCampaigns();
      unsubSales();
      unsubOrders();
      unsubWithdrawals();
      unsubSettings();
      unsubNotifs();
      unsubLogs();
    };
  }, []);

  // Sync current user & local storage
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
    const id = "log_" + Math.random().toString(36).substring(2);
    const newLog: ActivityLog = {
      id,
      userId,
      userEmail: email,
      action,
      details,
      timestamp: Date.now()
    };
    setActivityLogs(prev => [newLog, ...prev]);
    setDoc(doc(db, 'activityLogs', id), newLog).catch(e => console.error("Firestore log error:", e));
  };

  // Notification generator
  const sendNotification = (userId: string, title: string, message: string, type: 'approval' | 'rejection' | 'payment' | 'announcement' | 'info') => {
    const id = "notif_" + Math.random().toString(36).substring(2);
    const newNotif: NotificationItem = {
      id,
      userId,
      title,
      message,
      timestamp: Date.now(),
      isRead: false,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
    setDoc(doc(db, 'notifications', id), newNotif).catch(e => console.error("Firestore notif error:", e));
  };

  // Auth Operations
  const login = (email: string, password?: string): { success: boolean; message: string } => {
    const clean = email.toLowerCase().trim();
    const found = users.find(u => u.email.toLowerCase() === clean);
    if (found) {
      if (found.isAdmin || clean === "wealthbuilder@gmail.com" || clean === "chizaramamajorchizaram@gmail.com") {
        if (!password || password.trim() !== "Chizzywealth1906") {
          return { success: false, message: "Incorrect admin password. Required password: Chizzywealth1906" };
        }
      }
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

    const uid = "usr_" + Math.random().toString(36).substring(2);
    const referralCode = name.toUpperCase().replace(/\s+/g, '').substring(0, 8) + Math.floor(10 + Math.random() * 90);
    const isAdm = cleanEmail === "wealthbuilder@gmail.com" || cleanEmail === "chizaramamajorchizaram@gmail.com";

    const newUser: UserProfile = {
      uid,
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
      isVerifiedSeller: false,
      lessonStreakCount: 0,
      totalCommissionEarned: 0,
      referrals: []
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setDoc(doc(db, 'users', uid), newUser).catch(e => console.error("Firestore user signup error:", e));

    logActivity(newUser.uid, newUser.email, "Registration", "Registered a new account.");
    sendNotification(newUser.uid, "Welcome Pioneer! 🌟", "Verify your account payment to unlock active earning pathways.", "info");

    // Track referral clicks/count for the referrer immediately if supplied
    if (referredBy.trim()) {
      users.forEach(u => {
        if (u.referralCode.toUpperCase() === referredBy.trim().toUpperCase()) {
          const clicks = u.referralLinkClicks + 1;
          const refCount = u.referredUsersCount + 1;
          
          sendNotification(u.uid, "New Referral Invited!", `${name} registered using your referral code. Commission will grant upon account verification!`, "info");
          
          const updatedReferrer = {
            ...u,
            referralLinkClicks: clicks,
            referredUsersCount: refCount
          };
          setDoc(doc(db, 'users', u.uid), updatedReferrer).catch(e => console.error("Firestore referrer update error:", e));
        }
      });
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
    setDoc(doc(db, 'users', currentUser.uid), updated).catch(e => console.error("Firestore profile update error:", e));
    logActivity(currentUser.uid, currentUser.email, "Profile Update", `Changed goal to $${goal} and path to ${path}.`);
  };

  const addFunds = (amount: number) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      currentSavedBalance: currentUser.currentSavedBalance + amount
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    setDoc(doc(db, 'users', currentUser.uid), updated).catch(e => console.error("Firestore add funds error:", e));
    logActivity(currentUser.uid, currentUser.email, "Add Funds", `Deposited $${amount.toLocaleString()} to saved balance.`);
    sendNotification(currentUser.uid, "Wallet Funded! 💳", `Successfully deposited $${amount.toLocaleString()} into your account saved balance.`, "payment");
  };

  const addBadge = (badge: string) => {
    if (!currentUser) return;
    if (currentUser.badges.includes(badge)) return;
    const updated = { ...currentUser, badges: [...currentUser.badges, badge] };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    setDoc(doc(db, 'users', currentUser.uid), updated).catch(e => console.error("Firestore badge error:", e));
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
    setDoc(doc(db, 'users', currentUser.uid), updated).catch(e => console.error("Firestore payment proof error:", e));
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
    setDoc(doc(db, 'users', uid), updated).catch(e => console.error("Firestore approve user error:", e));
    sendNotification(uid, "Account Activated! 🎉", "Your verification payment was approved. Welcome to full active earning privileges!", "approval");
    logActivity("admin", "Admin", "User Approval", `Approved verification for ${userToApprove.email}`);

    // Grant commission reward to referrer if applicable
    if (userToApprove.referredByCode) {
      users.forEach(u => {
        if (u.referralCode.toUpperCase() === userToApprove.referredByCode.toUpperCase()) {
          const rewardAmount = adminSettings.referralRewardAmount;
          const updatedBal = u.referralBalance + rewardAmount;
          const updatedTotalEarned = u.referralRewardsEarned + rewardAmount;
          
          sendNotification(u.uid, "Referral Bonus Received! 💰", `Earned $${rewardAmount} commission because ${userToApprove.displayName} activated their account!`, "payment");
          
          const updatedReferrer = {
            ...u,
            referralBalance: updatedBal,
            referralRewardsEarned: updatedTotalEarned
          };
          setDoc(doc(db, 'users', u.uid), updatedReferrer).catch(e => console.error("Firestore grant commission error:", e));
        }
      });
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
    setDoc(doc(db, 'users', uid), updated).catch(e => console.error("Firestore reject user error:", e));
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
      return isSaved ? prev.filter(id => id !== articleId) : [...prev, articleId];
    });
  };

  // Support Tickets
  const createSupportTicket = (subject: string, desc: string) => {
    if (!currentUser) return;
    const id = "tkt_" + Math.random().toString(36).substring(2);
    const newTicket: SupportTicket = {
      id,
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
    setDoc(doc(db, 'tickets', id), newTicket).catch(e => console.error("Firestore create ticket error:", e));
    logActivity(currentUser.uid, currentUser.email, "Support Ticket", `Created support ticket: "${subject}"`);
    sendNotification(currentUser.uid, "Ticket Opened 📩", "An expert financial advisor will review and respond shortly.", "info");
  };

  const replyToTicket = (ticketId: string, text: string, senderUid: string, senderName: string) => {
    const target = tickets.find(t => t.id === ticketId);
    if (!target) return;

    const newMsg: TicketMessage = {
      id: "msg_" + Math.random().toString(36).substring(2),
      senderUid,
      senderName,
      message: text,
      timestamp: Date.now()
    };
    const updatedMsgs = [...target.messages, newMsg];
    const isAdm = senderUid === "admin-uid" || users.find(u => u.uid === senderUid)?.isAdmin;
    const updatedTicket: SupportTicket = {
      ...target,
      messages: updatedMsgs,
      status: isAdm ? "Replied" : "Open",
      lastUpdated: Date.now()
    };

    setTickets(prev => prev.map(t => t.id === ticketId ? updatedTicket : t));
    setDoc(doc(db, 'tickets', ticketId), updatedTicket).catch(e => console.error("Firestore reply ticket error:", e));
  };

  // Withdrawal operations
  const requestWithdrawal = (amount: number, method: string, details: string, walletType: 'Affiliate' | 'Seller'): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: "Unauthorized" };
    if (amount <= 0) return { success: false, message: "Specify a valid payout amount." };
    if (!details.trim()) return { success: false, message: "Please provide your account details for withdrawal." };
    
    const balance = walletType === 'Affiliate' ? currentUser.referralBalance : currentUser.sellerBalance;
    
    // Calculate pending withdrawals already filed by this user for this wallet
    const pendingSum = withdrawals
      .filter(w => w.userUid === currentUser.uid && w.walletType === walletType && w.status === "Pending Approval")
      .reduce((sum, w) => sum + w.amount, 0);

    const availableBalance = balance - pendingSum;

    if (amount > availableBalance) {
      return { 
        success: false, 
        message: `Cannot request more than your available balance! Your current wallet balance is ₦${balance.toLocaleString()} (Pending requests: ₦${pendingSum.toLocaleString()}).` 
      };
    }

    const id = "wdr_" + Math.random().toString(36).substring(2);
    const newRequest: WithdrawalRequest = {
      id,
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

    // Note: Do NOT deduct balance here! Balance is deducted ONLY when Admin confirms/approves the withdrawal.
    setWithdrawals(prev => [newRequest, ...prev]);
    setDoc(doc(db, 'withdrawals', id), newRequest).catch(e => console.error("Firestore withdrawal request error:", e));

    logActivity(currentUser.uid, currentUser.email, "Withdrawal Request", `Requested withdrawal of ₦${amount.toLocaleString()} to ${details}`);
    sendNotification(currentUser.uid, "Withdrawal Submitted 💸", `Your withdrawal request of ₦${amount.toLocaleString()} was submitted. Awaiting Admin confirmation.`, "payment");

    return { success: true, message: `Withdrawal request for ₦${amount.toLocaleString()} submitted successfully! Admin will confirm and dispatch.` };
  };

  const processWithdrawal = (id: string, approve: boolean, notes: string = "") => {
    const request = withdrawals.find(w => w.id === id);
    if (!request) return;

    if (approve) {
      // Find the user to confirm balance and deduct funds upon Admin approval
      const userToDeduct = users.find(u => u.uid === request.userUid);
      if (!userToDeduct) {
        alert("User account not found!");
        return;
      }

      const currentBalance = request.walletType === 'Affiliate' ? userToDeduct.referralBalance : userToDeduct.sellerBalance;
      if (currentBalance < request.amount) {
        alert(`Cannot confirm withdrawal: User only has ₦${currentBalance.toLocaleString()} in ${request.walletType} balance, but requested ₦${request.amount.toLocaleString()}.`);
        return;
      }

      // Deduct balance now upon Admin confirmation
      const updatedUser: UserProfile = {
        ...userToDeduct,
        referralBalance: request.walletType === 'Affiliate' ? userToDeduct.referralBalance - request.amount : userToDeduct.referralBalance,
        sellerBalance: request.walletType === 'Seller' ? userToDeduct.sellerBalance - request.amount : userToDeduct.sellerBalance
      };

      setUsers(prev => prev.map(u => u.uid === request.userUid ? updatedUser : u));
      setDoc(doc(db, 'users', request.userUid), updatedUser).catch(e => console.error("Firestore balance deduction error:", e));

      if (currentUser?.uid === request.userUid) {
        setCurrentUser(updatedUser);
      }

      const txRef = "OPAY-" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const updatedReq: WithdrawalRequest = {
        ...request,
        status: "Paid",
        completionDate: Date.now(),
        transactionHash: txRef,
        adminNotes: notes || "Confirmed & Dispatched by Admin"
      };

      setWithdrawals(prev => prev.map(w => w.id === id ? updatedReq : w));
      setDoc(doc(db, 'withdrawals', id), updatedReq).catch(e => console.error("Firestore process withdrawal error:", e));

      sendNotification(request.userUid, "Withdrawal Confirmed & Paid! 💸", `Admin confirmed your withdrawal of ₦${request.amount.toLocaleString()} sent to ${request.payoutDetails}. Ref: ${txRef}`, "payment");
      logActivity("admin", "Admin", "Withdrawal Approved", `Confirmed and deducted ₦${request.amount.toLocaleString()} for user ${request.userEmail}`);
    } else {
      // Admin rejects - no balance deduction occurred
      const updatedReq: WithdrawalRequest = {
        ...request,
        status: "Rejected",
        adminNotes: notes || "Declined by Admin"
      };

      setWithdrawals(prev => prev.map(w => w.id === id ? updatedReq : w));
      setDoc(doc(db, 'withdrawals', id), updatedReq).catch(e => console.error("Firestore process withdrawal error:", e));

      sendNotification(request.userUid, "Withdrawal Declined ❌", `Your withdrawal request of ₦${request.amount.toLocaleString()} was declined: ${notes || "Check account details and re-submit."}`, "payment");
      logActivity("admin", "Admin", "Withdrawal Rejected", `Declined withdrawal claim ${id} for user ${request.userEmail}`);
    }
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
      sellerVerificationStatus: "Verified",
      isVerifiedSeller: true,
      sellerStatus: "Approved"
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.uid === currentUser.uid ? updated : u));
    setDoc(doc(db, 'users', currentUser.uid), updated).catch(e => console.error("Firestore register seller error:", e));
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
    const id = "prod_" + Math.random().toString(36).substring(2);
    const newProduct: AffiliateProduct = {
      id,
      name,
      description: desc,
      category: cat,
      subcategory: "Digital Assets",
      brand: currentUser.sellerBusinessName || currentUser.displayName,
      images: [img || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60"],
      price,
      discountPrice: null,
      currency: "USD",
      affiliateLink: "",
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
      status: "Approved",
      sellerId: currentUser.uid,
      sellerName: currentUser.sellerBusinessName || currentUser.displayName,
      rejectionReason: "",
      availableQuantity: qty,
      deliveryFee,
      deliveryRegions: "All Regions",
      estimatedDeliveryTime: "Immediate Delivery"
    };

    setProducts(prev => [newProduct, ...prev]);
    setDoc(doc(db, 'products', id), newProduct).catch(e => console.error("Firestore add product error:", e));
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
    setDoc(doc(db, 'users', currentUser.uid), updatedUser).catch(e => console.error("Firestore purchase user update error:", e));

    // Create Order
    const orderId = "ord_" + Math.random().toString(36).substring(2);
    const newOrder: Order = {
      id: orderId,
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
      affiliateId: currentUser.referredByCode,
      sellerId: product.sellerId,
      status: "Processing",
      dateCreated: Date.now(),
      lastUpdated: Date.now(),
      shippingAddress,
      paymentMethod,
      couponCode,
      deliveryFee: product.deliveryFee * qty,
      paymentProofUrl: "",
      paymentReference: "Paid via Account Balance",
      adminNotes: ""
    };

    setOrders(prev => [newOrder, ...prev]);
    setDoc(doc(db, 'orders', orderId), newOrder).catch(e => console.error("Firestore new order error:", e));

    // Update Product Stock
    const nextQty = product.availableQuantity - qty;
    const updatedProduct: AffiliateProduct = {
      ...product,
      availableQuantity: nextQty,
      stockStatus: nextQty === 0 ? "Out of Stock" : nextQty < 5 ? "Low Stock" : "In Stock"
    };
    setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
    setDoc(doc(db, 'products', productId), updatedProduct).catch(e => console.error("Firestore stock update error:", e));

    // Revenue Share to Seller
    if (product.sellerId) {
      const sellerPay = finalCost * (adminSettings.sellerRevenuePercent / 100);
      users.forEach(u => {
        if (u.uid === product.sellerId) {
          const updatedSeller = {
            ...u,
            sellerBalance: u.sellerBalance + sellerPay,
            sellerTotalSales: u.sellerTotalSales + finalCost
          };
          setDoc(doc(db, 'users', product.sellerId), updatedSeller).catch(e => console.error("Firestore seller credit error:", e));
        }
      });
      sendNotification(product.sellerId, "Product Sold! 📈", `Congratulations! "${product.name}" was purchased. $${sellerPay.toFixed(2)} credited to your seller wallet.`, "payment");
    }

    logActivity(currentUser.uid, currentUser.email, "Product Purchase", `Purchased ${qty}x "${product.name}"`);
    sendNotification(currentUser.uid, "Purchase Completed! 🛒", `You bought "${product.name}". Access instructions are on your dashboard.`, "info");
    addBadge("Consumer");

    return { success: true, message: "Purchase completed successfully!" };
  };

  // Submit Affiliate Product referral claim
  const submitProductReferralSale = (
    productId: string, productName: string, productPrice: number, 
    buyerName: string, buyerEmail: string, ref: string
  ) => {
    if (!currentUser) return;
    const id = "sale_" + Math.random().toString(36).substring(2);
    const commEarned = productPrice * (adminSettings.affiliateRevenuePercent / 100);
    const newSale: ProductReferralSale = {
      id,
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
    setDoc(doc(db, 'sales', id), newSale).catch(e => console.error("Firestore sale claim error:", e));
    logActivity(currentUser.uid, currentUser.email, "Affiliate Claim", `Submitted referral sale claim for "${productName}"`);
    sendNotification(currentUser.uid, "Referral Claim Submitted ⏳", `Commission claim for $${commEarned.toFixed(2)} is awaiting review.`, "payment");
  };

  const processReferralSale = (id: string, approve: boolean, rejectionReason: string = "") => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;

    const updatedSale: ProductReferralSale = {
      ...sale,
      status: approve ? "Completed" : "Rejected",
      rejectionReason
    };

    setSales(prev => prev.map(s => s.id === id ? updatedSale : s));
    setDoc(doc(db, 'sales', id), updatedSale).catch(e => console.error("Firestore process sale error:", e));

    if (approve) {
      users.forEach(u => {
        if (u.uid === sale.referrerUid) {
          const updated = {
            ...u,
            referralBalance: u.referralBalance + sale.commissionEarned,
            referralRewardsEarned: u.referralRewardsEarned + sale.commissionEarned
          };
          setDoc(doc(db, 'users', sale.referrerUid), updated).catch(e => console.error("Firestore credit affiliate error:", e));
        }
      });
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
    const id = "ad_" + Math.random().toString(36).substring(2);
    const newCampaign: AdCampaign = {
      id,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      title,
      description: desc,
      bannerUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
      videoUrl: "",
      destinationUrl: destUrl,
      category: "Elearning Promo",
      adType,
      startDate: Date.now() + 2 * 24 * 60 * 60 * 1000,
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
    setDoc(doc(db, 'campaigns', id), newCampaign).catch(e => console.error("Firestore campaign error:", e));
    logActivity(currentUser.uid, currentUser.email, "Campaign Launch", `Launched ad campaign: "${title}"`);
    sendNotification(currentUser.uid, "Ad Campaign Processing 📈", `Your ad "${title}" is pending receipt auditing.`, "payment");
  };

  const processAdCampaign = (id: string, approve: boolean, notes: string = "") => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;

    const updatedCampaign: AdCampaign = {
      ...campaign,
      status: approve ? "Active" : "Rejected",
      adminNotes: notes,
      viewsCount: approve ? Math.floor(500 + Math.random() * 2000) : 0,
      clicksCount: approve ? Math.floor(40 + Math.random() * 150) : 0
    };

    setCampaigns(prev => prev.map(c => c.id === id ? updatedCampaign : c));
    setDoc(doc(db, 'campaigns', id), updatedCampaign).catch(e => console.error("Firestore process campaign error:", e));

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
    setDoc(doc(db, 'adminSettings', 'global'), settings).catch(e => console.error("Firestore update settings error:", e));
    logActivity("admin", "Admin", "Settings Override", "Updated global platform administrative configurations.");
  };

  // Add Announcements
  const createAnnouncement = (title: string, content: string) => {
    const id = "ann_" + Math.random().toString(36).substring(2);
    const newAnn: Announcement = {
      id,
      title,
      content,
      timestamp: Date.now(),
      isPinned: false,
      author: "Administrative Director"
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setDoc(doc(db, 'announcements', id), newAnn).catch(e => console.error("Firestore announcement error:", e));
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
    addFunds,
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
