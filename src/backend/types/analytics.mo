module {
  public type AdminAnalytics = {
    totalRevenue : Nat;
    totalBookings : Nat;
    activeStays : Nat;
    pendingVerifications : Nat;
    totalProperties : Nat;
    totalUsers : Nat;
    refundsProcessed : Nat;
  };

  public type OwnerEarnings = {
    totalEarned : Nat;
    pendingPayout : Nat;
    totalBookings : Nat;
    activeBookings : Nat;
  };
};
