import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ServiceTypes "../types/service";
import ServiceLib "../lib/serviceLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  services : Map.Map<Nat, ServiceTypes.Service>,
) {
  public shared ({ caller }) func createService(input : ServiceTypes.ServiceInput) : async ServiceTypes.Service {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    let nextId = services.size() + 1;
    ServiceLib.createService(services, nextId, input);
  };

  public query func getServices() : async [ServiceTypes.Service] {
    ServiceLib.listServices(services);
  };
};
