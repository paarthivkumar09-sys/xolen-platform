import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import DocumentTypes "../types/document";
import Time "mo:core/Time";

module {
  public func createDocument(
    documents : Map.Map<Nat, DocumentTypes.Document>,
    nextId : Nat,
    caller : Principal,
    input : DocumentTypes.DocumentInput,
  ) : DocumentTypes.Document {
    let doc : DocumentTypes.Document = {
      id = nextId;
      bookingId = input.bookingId;
      ownerId = caller;
      docType = input.docType;
      fileBlob = input.fileBlob;
      uploadedBy = input.uploadedBy;
      uploadedAt = Time.now();
      verificationStatus = #pending;
    };
    documents.add(nextId, doc);
    doc;
  };

  public func getBookingDocuments(
    documents : Map.Map<Nat, DocumentTypes.Document>,
    bookingId : Nat,
  ) : [DocumentTypes.Document] {
    documents.entries()
      .filter(func((_, d)) = d.bookingId == bookingId)
      .map<(Nat, DocumentTypes.Document), DocumentTypes.Document>(func((_, d)) = d)
      .toArray();
  };
};
