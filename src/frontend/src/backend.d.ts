import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Location {
    lat: number;
    lng: number;
    city: string;
    address: string;
}
export interface Rating {
    id: bigint;
    bookingId: bigint;
    createdAt: bigint;
    propertyId: bigint;
    reviewText: string;
    customerId: Principal;
    rating: bigint;
}
export interface Document {
    id: bigint;
    bookingId: bigint;
    ownerId: Principal;
    fileBlob: ExternalBlob;
    docType: DocType;
    verificationStatus: DocVerificationStatus;
    uploadedAt: bigint;
    uploadedBy: UploadedBy;
}
export interface OwnerEarnings {
    activeBookings: bigint;
    totalEarned: bigint;
    totalBookings: bigint;
    pendingPayout: bigint;
}
export interface TaskInput {
    bookingId?: bigint;
    propertyId: bigint;
    executiveId: Principal;
    taskType: TaskType;
}
export interface Property {
    id: bigint;
    status: PropertyStatus;
    propertyType: PropertyType;
    ownerId: Principal;
    createdAt: bigint;
    description: string;
    amenities: Array<string>;
    updatedAt: bigint;
    furnishingType: FurnishingType;
    tenantType: TenantType;
    monthlyRent: bigint;
    roomsAvailable: bigint;
    verificationNotes?: string;
    assignedExecutiveId?: Principal;
    perDayPrice: bigint;
    location: Location;
    photos: Array<ExternalBlob>;
    totalRooms: bigint;
    maxGuests: bigint;
}
export interface ServiceInput {
    name: string;
    description: string;
    category: ServiceCategory;
    price: bigint;
}
export interface DocumentInput {
    bookingId: bigint;
    fileBlob: ExternalBlob;
    docType: DocType;
    uploadedBy: UploadedBy;
}
export interface PaymentInput {
    paymentMethod: PaymentMethod;
    bookingId: bigint;
    amount: bigint;
}
export interface RatingInput {
    bookingId: bigint;
    propertyId: bigint;
    reviewText: string;
    rating: bigint;
}
export interface Booking {
    id: bigint;
    checkIn: bigint;
    paymentStatus: PaymentStatus;
    decisionDeadline: bigint;
    invoiceUrl?: string;
    serviceAddons: Array<ServiceAddon>;
    createdAt: bigint;
    totalDays: bigint;
    propertyId: bigint;
    decisionStatus: DecisionStatus;
    checkOut: bigint;
    customerId: Principal;
    totalPrice: bigint;
}
export interface AvailabilityResult {
    available: boolean;
    nextAvailableFrom?: bigint;
}
export interface PropertyFilter {
    propertyType?: PropertyType;
    city?: string;
    maxPrice?: bigint;
    tenantType?: TenantType;
    minPrice?: bigint;
}
export interface PendingPayout {
    bookingId: bigint;
    ownerId: Principal;
    releaseAt: bigint;
    processed: boolean;
    amount: bigint;
}
export interface BookingInput {
    checkIn: bigint;
    totalDays: bigint;
    propertyId: bigint;
    serviceAddonIds: Array<bigint>;
}
export interface AdminAnalytics {
    totalProperties: bigint;
    refundsProcessed: bigint;
    totalBookings: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
    activeStays: bigint;
    pendingVerifications: bigint;
}
export interface Service {
    id: bigint;
    active: boolean;
    name: string;
    description: string;
    category: ServiceCategory;
    price: bigint;
}
export interface Payment {
    id: bigint;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    bookingId: bigint;
    createdAt: bigint;
    holdReleaseAt: bigint;
    amount: bigint;
}
export interface PropertyInput {
    propertyType: PropertyType;
    description: string;
    amenities: Array<string>;
    furnishingType: FurnishingType;
    tenantType: TenantType;
    monthlyRent: bigint;
    roomsAvailable: bigint;
    location: Location;
    photos: Array<ExternalBlob>;
    totalRooms: bigint;
    maxGuests: bigint;
}
export interface Notification {
    id: bigint;
    userId: Principal;
    notificationType: NotificationType;
    createdAt: bigint;
    read: boolean;
    message: string;
}
export interface VerificationTask {
    id: bigint;
    status: TaskStatus;
    completedAt?: bigint;
    bookingId?: bigint;
    createdAt: bigint;
    propertyId: bigint;
    executiveId: Principal;
    taskType: TaskType;
    notes?: string;
    photos: Array<ExternalBlob>;
}
export interface UserProfileInput {
    name: string;
    role: UserRole;
    email: string;
    phone: string;
}
export interface ServiceAddon {
    serviceName: string;
    serviceId: bigint;
    price: bigint;
}
export interface UserProfile {
    id: Principal;
    name: string;
    createdAt: bigint;
    role: UserRole;
    email: string;
    phone: string;
    blacklisted: boolean;
    verificationStatus: VerificationStatus;
}
export enum DecisionStatus {
    expired = "expired",
    pending = "pending",
    refunded = "refunded",
    accepted = "accepted"
}
export enum DocType {
    other = "other",
    passport = "passport",
    aadhaar = "aadhaar",
    drivingLicense = "drivingLicense"
}
export enum DocVerificationStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum FurnishingType {
    semiFurnished = "semiFurnished",
    furnished = "furnished",
    unfurnished = "unfurnished"
}
export enum NotificationType {
    extendReminder = "extendReminder",
    paymentSuccess = "paymentSuccess",
    visitReminder = "visitReminder",
    bookingConfirmed = "bookingConfirmed",
    docUploaded = "docUploaded",
    refundProcessed = "refundProcessed"
}
export enum PaymentMethod {
    upi = "upi",
    card = "card",
    wallet = "wallet"
}
export enum PaymentStatus {
    pending = "pending",
    success = "success",
    failed = "failed"
}
export enum PropertyStatus {
    assigned = "assigned",
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum PropertyType {
    twoBHK = "twoBHK",
    oneRK = "oneRK",
    room = "room",
    threeBHK = "threeBHK",
    oneBHK = "oneBHK"
}
export enum ServiceCategory {
    setupKit = "setupKit",
    other = "other",
    acCleaning = "acCleaning",
    homeCleaning = "homeCleaning"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum TaskType {
    customerCheckin = "customerCheckin",
    propertyVerification = "propertyVerification"
}
export enum TenantType {
    all = "all",
    boys = "boys",
    girls = "girls",
    family = "family"
}
export enum UploadedBy {
    customer = "customer",
    executive = "executive"
}
export enum UserRole {
    admin = "admin",
    customer = "customer",
    owner = "owner",
    executive = "executive"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VerificationStatus {
    verified = "verified",
    pending = "pending",
    unverified = "unverified",
    rejected = "rejected"
}
export interface backendInterface {
    approveProperty(propertyId: bigint, notes: string | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignExecutive(propertyId: bigint, executiveId: Principal): Promise<void>;
    blacklistUser(userId: Principal): Promise<void>;
    createBooking(input: BookingInput): Promise<Booking>;
    createDocument(input: DocumentInput): Promise<Document>;
    createPayment(input: PaymentInput): Promise<Payment>;
    createProperty(input: PropertyInput): Promise<Property>;
    createService(input: ServiceInput): Promise<Service>;
    createVerificationTask(input: TaskInput): Promise<VerificationTask>;
    getAdminAnalytics(): Promise<AdminAnalytics>;
    getAdminBookings(): Promise<Array<Booking>>;
    getAdminPayments(): Promise<Array<Payment>>;
    getAdminProperties(): Promise<Array<Property>>;
    getAdminUsers(): Promise<Array<UserProfile>>;
    getBooking(bookingId: bigint): Promise<Booking | null>;
    getBookingDocuments(bookingId: bigint): Promise<Array<Document>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getMyBookings(): Promise<Array<Booking>>;
    getMyPayments(): Promise<Array<Payment>>;
    getMyTasks(): Promise<Array<VerificationTask>>;
    getNotifications(): Promise<Array<Notification>>;
    getOwnerEarnings(): Promise<OwnerEarnings>;
    getPendingPayouts(): Promise<Array<PendingPayout>>;
    getProperties(filter: PropertyFilter | null): Promise<Array<Property>>;
    getProperty(propertyId: bigint): Promise<Property | null>;
    getPropertyAvailability(propertyId: bigint, checkIn: bigint, totalDays: bigint): Promise<AvailabilityResult>;
    getPropertyRatings(propertyId: bigint): Promise<Array<Rating>>;
    getServices(): Promise<Array<Service>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationRead(notificationId: bigint): Promise<void>;
    markPayoutProcessed(bookingId: bigint): Promise<void>;
    processDecision(bookingId: bigint, decision: DecisionStatus): Promise<Booking>;
    rejectProperty(propertyId: bigint, notes: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfileInput): Promise<void>;
    seedSampleBookings(sampleCustomerId: Principal): Promise<void>;
    submitRating(input: RatingInput): Promise<Rating>;
    updateProperty(propertyId: bigint, input: PropertyInput): Promise<Property | null>;
    updateTaskStatus(taskId: bigint, status: TaskStatus, notes: string | null): Promise<VerificationTask>;
    updateUserProfile(input: UserProfileInput): Promise<UserProfile>;
    uploadVerificationPhoto(taskId: bigint, photo: ExternalBlob): Promise<VerificationTask>;
}
