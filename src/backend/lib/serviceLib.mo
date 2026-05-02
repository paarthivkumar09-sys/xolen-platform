import Map "mo:core/Map";
import ServiceTypes "../types/service";

module {
  public func createService(
    services : Map.Map<Nat, ServiceTypes.Service>,
    nextId : Nat,
    input : ServiceTypes.ServiceInput,
  ) : ServiceTypes.Service {
    let svc : ServiceTypes.Service = {
      id = nextId;
      name = input.name;
      description = input.description;
      price = input.price;
      category = input.category;
      active = true;
    };
    services.add(nextId, svc);
    svc;
  };

  public func listServices(
    services : Map.Map<Nat, ServiceTypes.Service>,
  ) : [ServiceTypes.Service] {
    services.entries().map<(Nat, ServiceTypes.Service), ServiceTypes.Service>(func((_, svc)) = svc).toArray();
  };
};
