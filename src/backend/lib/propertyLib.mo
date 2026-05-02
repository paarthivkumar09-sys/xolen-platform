import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import PropertyTypes "../types/property";

module {
  // A minimal booking reference used for availability checks
  public type BookingRef = {
    propertyId : Nat;
    checkIn : Int;
    checkOut : Int;
    decisionStatus : { #pending; #accepted; #refunded; #expired };
  };

  public func createProperty(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    nextId : Nat,
    ownerId : Principal,
    input : PropertyTypes.PropertyInput,
  ) : PropertyTypes.Property {
    let now = Time.now();
    let perDay = if (input.monthlyRent > 0) input.monthlyRent / 30 else 0;
    let prop : PropertyTypes.Property = {
      id = nextId;
      ownerId = ownerId;
      propertyType = input.propertyType;
      monthlyRent = input.monthlyRent;
      perDayPrice = perDay;
      maxGuests = input.maxGuests;
      tenantType = input.tenantType;
      furnishingType = input.furnishingType;
      description = input.description;
      photos = input.photos;
      status = #pending;
      assignedExecutiveId = null;
      verificationNotes = null;
      createdAt = now;
      updatedAt = now;
      location = input.location;
      roomsAvailable = input.roomsAvailable;
      totalRooms = input.totalRooms;
      amenities = input.amenities;
    };
    properties.add(nextId, prop);
    prop;
  };

  public func getProperty(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    propertyId : Nat,
  ) : ?PropertyTypes.Property {
    properties.get(propertyId);
  };

  public func updateProperty(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    propertyId : Nat,
    ownerId : Principal,
    input : PropertyTypes.PropertyInput,
  ) : ?PropertyTypes.Property {
    switch (properties.get(propertyId)) {
      case null null;
      case (?existing) {
        if (not Principal.equal(existing.ownerId, ownerId)) {
          Runtime.trap("Unauthorized: Not the property owner");
        };
        let perDay = if (input.monthlyRent > 0) input.monthlyRent / 30 else 0;
        let updated : PropertyTypes.Property = {
          existing with
          propertyType = input.propertyType;
          monthlyRent = input.monthlyRent;
          perDayPrice = perDay;
          maxGuests = input.maxGuests;
          tenantType = input.tenantType;
          furnishingType = input.furnishingType;
          description = input.description;
          photos = input.photos;
          location = input.location;
          roomsAvailable = input.roomsAvailable;
          totalRooms = input.totalRooms;
          amenities = input.amenities;
          updatedAt = Time.now();
        };
        properties.add(propertyId, updated);
        ?updated;
      };
    };
  };

  public func listProperties(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    filter : ?PropertyTypes.PropertyFilter,
  ) : [PropertyTypes.Property] {
    let all = properties.values();
    switch (filter) {
      case null {
        all.filter(func(p) { p.status == #verified }).toArray();
      };
      case (?f) {
        all.filter(func(p : PropertyTypes.Property) : Bool {
          let cityOk = switch (f.city) {
            case null true;
            case (?c) p.location.city == c;
          };
          let minOk = switch (f.minPrice) {
            case null true;
            case (?m) p.perDayPrice >= m;
          };
          let maxOk = switch (f.maxPrice) {
            case null true;
            case (?m) p.perDayPrice <= m;
          };
          let typeOk = switch (f.propertyType) {
            case null true;
            case (?t) p.propertyType == t;
          };
          let tenantOk = switch (f.tenantType) {
            case null true;
            case (?t) p.tenantType == t or p.tenantType == #all;
          };
          cityOk and minOk and maxOk and typeOk and tenantOk and p.status == #verified;
        }).toArray();
      };
    };
  };

  public func checkAvailability(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    bookings : Map.Map<Nat, BookingRef>,
    propertyId : Nat,
    checkIn : Int,
    _totalDays : Nat,
  ) : PropertyTypes.AvailabilityResult {
    switch (properties.get(propertyId)) {
      case null Runtime.trap("Property not found");
      case (?prop) {
        if (prop.roomsAvailable == 0) {
          // Find next checkout
          let checkOut : Int = checkIn + 15 * 86_400_000_000_000;
          let conflicting = bookings.values().filter(func(b : BookingRef) : Bool {
            b.propertyId == propertyId
            and b.decisionStatus == #accepted
            and b.checkOut > checkIn
            and b.checkIn < checkOut
          });
          let nextAvail = conflicting.foldLeft(
            null : ?Int,
            func(acc : ?Int, b : BookingRef) : ?Int {
              switch acc {
                case null ?b.checkOut;
                case (?a) if (b.checkOut > a) ?b.checkOut else ?a;
              };
            },
          );
          { available = false; nextAvailableFrom = nextAvail };
        } else {
          { available = true; nextAvailableFrom = null };
        };
      };
    };
  };

  public func assignExecutive(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    propertyId : Nat,
    executiveId : Principal,
  ) : () {
    switch (properties.get(propertyId)) {
      case null Runtime.trap("Property not found");
      case (?p) {
        properties.add(propertyId, { p with assignedExecutiveId = ?executiveId; status = #assigned; updatedAt = Time.now() });
      };
    };
  };

  public func approveProperty(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    propertyId : Nat,
    notes : ?Text,
  ) : () {
    switch (properties.get(propertyId)) {
      case null Runtime.trap("Property not found");
      case (?p) {
        properties.add(propertyId, { p with status = #verified; verificationNotes = notes; updatedAt = Time.now() });
      };
    };
  };

  public func rejectProperty(
    properties : Map.Map<Nat, PropertyTypes.Property>,
    propertyId : Nat,
    notes : Text,
  ) : () {
    switch (properties.get(propertyId)) {
      case null Runtime.trap("Property not found");
      case (?p) {
        properties.add(propertyId, { p with status = #rejected; verificationNotes = ?notes; updatedAt = Time.now() });
      };
    };
  };
};
