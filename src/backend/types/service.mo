module {
  public type ServiceCategory = {
    #acCleaning;
    #homeCleaning;
    #setupKit;
    #other;
  };

  public type Service = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    category : ServiceCategory;
    active : Bool;
  };

  public type ServiceInput = {
    name : Text;
    description : Text;
    price : Nat;
    category : ServiceCategory;
  };
};
