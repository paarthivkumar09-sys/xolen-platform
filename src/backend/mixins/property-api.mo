import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import PropertyTypes "../types/property";
import BookingTypes "../types/booking";
import PropertyLib "../lib/propertyLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  properties : Map.Map<Nat, PropertyTypes.Property>,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  nextPropertyId : { var val : Nat },
) {
  public query ({ caller : Principal }) func getProperties(filter : ?PropertyTypes.PropertyFilter) : async [PropertyTypes.Property] {
    PropertyLib.listProperties(properties, filter);
  };

  public query ({ caller : Principal }) func getProperty(propertyId : Nat) : async ?PropertyTypes.Property {
    PropertyLib.getProperty(properties, propertyId);
  };

  public shared ({ caller }) func createProperty(input : PropertyTypes.PropertyInput) : async PropertyTypes.Property {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let prop = PropertyLib.createProperty(properties, nextPropertyId.val, caller, input);
    nextPropertyId.val := nextPropertyId.val + 1;
    prop;
  };

  public shared ({ caller }) func updateProperty(propertyId : Nat, input : PropertyTypes.PropertyInput) : async ?PropertyTypes.Property {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    PropertyLib.updateProperty(properties, propertyId, caller, input);
  };

  public query ({ caller : Principal }) func getPropertyAvailability(propertyId : Nat, checkIn : Int, totalDays : Nat) : async PropertyTypes.AvailabilityResult {
    let bookingRefs = bookings.map<Nat, BookingTypes.Booking, PropertyLib.BookingRef>(func(_id : Nat, b : BookingTypes.Booking) : PropertyLib.BookingRef {
      { propertyId = b.propertyId; checkIn = b.checkIn; checkOut = b.checkOut; decisionStatus = b.decisionStatus };
    });
    PropertyLib.checkAvailability(properties, bookingRefs, propertyId, checkIn, totalDays);
  };

  public shared ({ caller }) func assignExecutive(propertyId : Nat, executiveId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    PropertyLib.assignExecutive(properties, propertyId, executiveId);
  };

  public shared ({ caller }) func approveProperty(propertyId : Nat, notes : ?Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    PropertyLib.approveProperty(properties, propertyId, notes);
  };

  public shared ({ caller }) func rejectProperty(propertyId : Nat, notes : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    PropertyLib.rejectProperty(properties, propertyId, notes);
  };

  public query ({ caller }) func getAdminProperties() : async [PropertyTypes.Property] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    properties.values().toArray();
  };
};
