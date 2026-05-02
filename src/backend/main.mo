import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import UserTypes "types/user";
import PropertyTypes "types/property";
import BookingTypes "types/booking";
import ServiceTypes "types/service";
import DocumentTypes "types/document";
import TaskTypes "types/task";
import NotificationTypes "types/notification";
import RatingTypes "types/rating";
import UserApi "mixins/user-api";
import PropertyApi "mixins/property-api";
import BookingApi "mixins/booking-api";
import ServiceApi "mixins/service-api";
import DocumentApi "mixins/document-api";
import TaskApi "mixins/task-api";
import NotificationApi "mixins/notification-api";
import RatingApi "mixins/rating-api";
import AnalyticsApi "mixins/analytics-api";
import List "mo:core/List";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Mutable id counter wrappers for mixin injection
  let nextPropertyId = { var val : Nat = 1 };
  let nextBookingIdRef = { var val : Nat = 1 };
  let nextPaymentIdRef = { var val : Nat = 1 };
  let pendingPayouts = List.empty<BookingTypes.PendingPayout>();

  // Domain state
  let userProfiles = Map.empty<Principal, UserTypes.UserProfile>();
  let properties = Map.empty<Nat, PropertyTypes.Property>();
  let bookings = Map.empty<Nat, BookingTypes.Booking>();
  let payments = Map.empty<Nat, BookingTypes.Payment>();
  let services = Map.empty<Nat, ServiceTypes.Service>();
  let documents = Map.empty<Nat, DocumentTypes.Document>();
  let tasks = Map.empty<Nat, TaskTypes.VerificationTask>();
  let notifications = Map.empty<Nat, NotificationTypes.Notification>();
  let ratings = Map.empty<Nat, RatingTypes.Rating>();

  // Domain API mixins
  include UserApi(accessControlState, userProfiles);
  include PropertyApi(accessControlState, properties, bookings, nextPropertyId);
  include BookingApi(accessControlState, bookings, payments, services, properties, notifications, nextBookingIdRef, nextPaymentIdRef, pendingPayouts);
  include ServiceApi(accessControlState, services);
  include DocumentApi(accessControlState, documents, userProfiles);
  include TaskApi(accessControlState, tasks);
  include NotificationApi(accessControlState, notifications);
  include RatingApi(accessControlState, ratings, userProfiles);
  include AnalyticsApi(accessControlState, bookings, payments, properties, userProfiles);

  // ── Sample data seeder (runs once on canister init) ──────────────────────
  func _seedProperties() : () {
    let now = Time.now();
    let anon = Principal.anonymous();

    let propSeeds : [(
      PropertyTypes.PropertyType,
      Nat,
      Nat,
      PropertyTypes.TenantType,
      PropertyTypes.FurnishingType,
      Text,
      Text,
      Nat,
      [Text],
      PropertyTypes.PropertyStatus,
    )] = [
      (#oneRK, 10000, 1, #boys, #furnished, "Cozy 1RK near Bhubaneswar Railway Station", "Unit-1, Bhubaneswar", 3, ["WiFi", "AC", "Geyser"], #verified),
      (#oneBHK, 13000, 2, #girls, #semiFurnished, "Spacious 1BHK in Patia, close to IT Park", "Patia, Bhubaneswar", 2, ["WiFi", "Fan", "Cupboard"], #verified),
      (#oneBHK, 15000, 2, #family, #furnished, "Well-maintained 1BHK in Nayapalli", "Nayapalli, Bhubaneswar", 1, ["WiFi", "AC", "Washing Machine"], #verified),
      (#twoBHK, 20000, 4, #all, #furnished, "Modern 2BHK in Saheed Nagar", "Saheed Nagar, Bhubaneswar", 2, ["WiFi", "AC", "TV", "Geyser"], #verified),
      (#twoBHK, 22000, 4, #family, #furnished, "Premium 2BHK near Kalinga Hospital", "Jagamara, Bhubaneswar", 1, ["WiFi", "AC", "TV", "Kitchen"], #verified),
      (#room, 8000, 1, #boys, #unfurnished, "Affordable room in Chandrasekharpur", "Chandrasekharpur, Bhubaneswar", 5, ["Fan", "Common Bathroom"], #verified),
      (#threeBHK, 30000, 6, #all, #furnished, "Luxurious 3BHK in Bhubaneswar Smart City Zone", "Infocity Area, Bhubaneswar", 1, ["WiFi", "AC", "TV", "Gym", "Parking"], #verified),
      (#oneRK, 9000, 1, #girls, #semiFurnished, "Newly built 1RK near Utkal University", "Vanivihar, Bhubaneswar", 2, ["WiFi", "Fan"], #pending),
      (#oneBHK, 14000, 2, #boys, #semiFurnished, "1BHK in IRC Village, great connectivity", "IRC Village, Bhubaneswar", 2, ["WiFi", "AC"], #pending),
      (#twoBHK, 18000, 3, #all, #unfurnished, "2BHK in Khandagiri, near metro", "Khandagiri, Bhubaneswar", 1, ["Parking", "Fan", "Lift"], #pending),
    ];

    var pid : Nat = 1;
    for (i in propSeeds.keys()) {
      let (ptype, rent, guests, tenant, furnish, desc, addr, rooms, amenities, status) = propSeeds[i];
      let prop : PropertyTypes.Property = {
        id = pid;
        ownerId = anon;
        propertyType = ptype;
        monthlyRent = rent;
        perDayPrice = rent / 30;
        maxGuests = guests;
        tenantType = tenant;
        furnishingType = furnish;
        description = desc;
        photos = [];
        status = status;
        assignedExecutiveId = null;
        verificationNotes = null;
        createdAt = now;
        updatedAt = now;
        location = { city = "Bhubaneswar"; address = addr; lat = 20.2961; lng = 85.8245 };
        roomsAvailable = rooms;
        totalRooms = rooms;
        amenities = amenities;
      };
      properties.add(pid, prop);
      pid := pid + 1;
    };
    nextPropertyId.val := pid;
  };

  _seedProperties();
};
