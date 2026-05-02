import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import BookingTypes "../types/booking";
import PropertyTypes "../types/property";
import UserTypes "../types/user";
import AnalyticsTypes "../types/analytics";

module {
  public func getAdminAnalytics(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    properties : Map.Map<Nat, PropertyTypes.Property>,
    users : Map.Map<Principal, UserTypes.UserProfile>,
    payments : Map.Map<Nat, BookingTypes.Payment>,
  ) : AnalyticsTypes.AdminAnalytics {
    var totalRevenue : Nat = 0;
    for ((_, p) in payments.entries()) {
      if (p.status == #success) { totalRevenue += p.amount };
    };
    let totalBookings = bookings.size();
    var activeStays : Nat = 0;
    for ((_, b) in bookings.entries()) {
      if (b.decisionStatus == #accepted) { activeStays += 1 };
    };
    var pendingVerifications : Nat = 0;
    for ((_, p) in properties.entries()) {
      if (p.status == #pending or p.status == #assigned) { pendingVerifications += 1 };
    };
    let totalProperties = properties.size();
    let totalUsers = users.size();
    var refundsProcessed : Nat = 0;
    for ((_, b) in bookings.entries()) {
      if (b.decisionStatus == #refunded) { refundsProcessed += 1 };
    };
    {
      totalRevenue;
      totalBookings;
      activeStays;
      pendingVerifications;
      totalProperties;
      totalUsers;
      refundsProcessed;
    };
  };

  public func getOwnerEarnings(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    payments : Map.Map<Nat, BookingTypes.Payment>,
    _ownerId : Principal,
    propertyIds : [Nat],
  ) : AnalyticsTypes.OwnerEarnings {
    // Collect booking IDs belonging to this owner's properties
    let ownerBookingIds = List.empty<Nat>();
    for ((bid, b) in bookings.entries()) {
      let matches = propertyIds.find(func pid = pid == b.propertyId) != null;
      if (matches) { ownerBookingIds.add(bid) };
    };
    let ownerIdArr = ownerBookingIds.toArray();
    let ownerBookingCount = ownerIdArr.size();

    var activeBookings : Nat = 0;
    for ((bid, b) in bookings.entries()) {
      if (b.decisionStatus == #accepted and ownerIdArr.find(func id = id == bid) != null) {
        activeBookings += 1;
      };
    };

    var totalEarned : Nat = 0;
    for ((_, p) in payments.entries()) {
      if (p.status == #success and ownerIdArr.find(func id = id == p.bookingId) != null) {
        totalEarned += p.amount;
      };
    };

    var pendingPayout : Nat = 0;
    for ((_, p) in payments.entries()) {
      if (p.status == #pending and ownerIdArr.find(func id = id == p.bookingId) != null) {
        pendingPayout += p.amount;
      };
    };

    {
      totalEarned;
      pendingPayout;
      totalBookings = ownerBookingCount;
      activeBookings;
    };
  };
};
