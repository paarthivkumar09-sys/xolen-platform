import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import DocumentTypes "../types/document";
import DocumentLib "../lib/documentLib";
import UserTypes "../types/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  documents : Map.Map<Nat, DocumentTypes.Document>,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public shared ({ caller }) func createDocument(input : DocumentTypes.DocumentInput) : async DocumentTypes.Document {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to upload documents");
    };
    // Only customers and executives may upload
    let profile = switch (userProfiles.get(caller)) {
      case (?p) p;
      case null Runtime.trap("User profile not found");
    };
    switch (profile.role) {
      case (#customer) {};
      case (#executive) {};
      case _ Runtime.trap("Unauthorized: Only customers and executives can upload documents");
    };
    let nextId = documents.size() + 1;
    DocumentLib.createDocument(documents, nextId, caller, input);
  };

  public query ({ caller }) func getBookingDocuments(bookingId : Nat) : async [DocumentTypes.Document] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    DocumentLib.getBookingDocuments(documents, bookingId);
  };
};
