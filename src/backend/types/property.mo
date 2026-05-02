import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type PropertyType = {
    #oneRK;
    #oneBHK;
    #twoBHK;
    #threeBHK;
    #room;
  };

  public type TenantType = {
    #boys;
    #girls;
    #family;
    #all;
  };

  public type FurnishingType = {
    #furnished;
    #semiFurnished;
    #unfurnished;
  };

  public type PropertyStatus = {
    #pending;
    #assigned;
    #verified;
    #rejected;
  };

  public type Location = {
    city : Text;
    address : Text;
    lat : Float;
    lng : Float;
  };

  public type Property = {
    id : Nat;
    ownerId : Principal;
    propertyType : PropertyType;
    monthlyRent : Nat;
    perDayPrice : Nat;
    maxGuests : Nat;
    tenantType : TenantType;
    furnishingType : FurnishingType;
    description : Text;
    photos : [Storage.ExternalBlob];
    status : PropertyStatus;
    assignedExecutiveId : ?Principal;
    verificationNotes : ?Text;
    createdAt : Int;
    updatedAt : Int;
    location : Location;
    roomsAvailable : Nat;
    totalRooms : Nat;
    amenities : [Text];
  };

  public type PropertyInput = {
    propertyType : PropertyType;
    monthlyRent : Nat;
    maxGuests : Nat;
    tenantType : TenantType;
    furnishingType : FurnishingType;
    description : Text;
    photos : [Storage.ExternalBlob];
    location : Location;
    roomsAvailable : Nat;
    totalRooms : Nat;
    amenities : [Text];
  };

  public type PropertyFilter = {
    city : ?Text;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    propertyType : ?PropertyType;
    tenantType : ?TenantType;
  };

  public type AvailabilityResult = {
    available : Bool;
    nextAvailableFrom : ?Int;
  };
};
