import { createActor } from "@/backend";
import { Toaster } from "@/components/ui/sonner";
import { AdminLayout } from "@/layouts/AdminLayout";
import { CustomerLayout } from "@/layouts/CustomerLayout";
import { ExecutiveLayout } from "@/layouts/ExecutiveLayout";
import { OwnerLayout } from "@/layouts/OwnerLayout";
import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

// ── Lazy page imports ───────────────────────────────────────────────────────
import { type ReactElement, Suspense, lazy } from "react";

const Login = lazy(() => import("@/pages/Login"));
const Setup = lazy(() => import("@/pages/Setup"));

// Customer pages
const CustomerHome = lazy(() => import("@/pages/customer/Home"));
const CustomerSearch = lazy(() => import("@/pages/customer/Search"));
const PropertyDetail = lazy(() => import("@/pages/customer/PropertyDetail"));
const BookingDetail = lazy(() => import("@/pages/customer/BookingDetail"));
const MyBookings = lazy(() => import("@/pages/customer/MyBookings"));
const Checkout = lazy(() => import("@/pages/customer/Checkout"));
const CustomerProfile = lazy(() => import("@/pages/customer/Profile"));
const Notifications = lazy(() => import("@/pages/customer/Notifications"));

// Owner pages
const OwnerDashboard = lazy(() => import("@/pages/owner/Dashboard"));
const OwnerProperties = lazy(() => import("@/pages/owner/Properties"));
const OwnerPropertyNew = lazy(() => import("@/pages/owner/PropertyNew"));
const OwnerPropertyEdit = lazy(() => import("@/pages/owner/PropertyEdit"));
const OwnerEarnings = lazy(() => import("@/pages/owner/Earnings"));
const OwnerSettings = lazy(() => import("@/pages/owner/Settings"));

// Admin pages
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const AdminBookings = lazy(() => import("@/pages/admin/Bookings"));
const AdminProperties = lazy(() => import("@/pages/admin/Properties"));
const AdminUsers = lazy(() => import("@/pages/admin/Users"));
const AdminPayments = lazy(() => import("@/pages/admin/Payments"));
const AdminAnalytics = lazy(() => import("@/pages/admin/Analytics"));

// Executive pages
const ExecutiveTasks = lazy(() => import("@/pages/executive/Tasks"));
const ExecutiveTaskDetail = lazy(() => import("@/pages/executive/TaskDetail"));
const ExecutiveTaskVerify = lazy(() => import("@/pages/executive/TaskVerify"));
const ExecutiveTaskCheckin = lazy(
  () => import("@/pages/executive/TaskCheckin"),
);

// ── Spinner fallback ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function wrap(Component: React.LazyExoticComponent<() => ReactElement>) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ── Route definitions ───────────────────────────────────────────────────────
const rootRoute = createRootRoute();

// Auth routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => wrap(Login),
});
const setupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/setup",
  component: () => wrap(Setup),
});

// Customer layout + routes
const customerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "customer",
  component: CustomerLayout,
});
const homeRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/",
  component: () => wrap(CustomerHome),
});
const searchRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/search",
  component: () => wrap(CustomerSearch),
});
const propertyRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/property/$id",
  component: () => wrap(PropertyDetail),
});
const bookingDetailRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/booking/$id",
  component: () => wrap(BookingDetail),
});
const myBookingsRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/my-bookings",
  component: () => wrap(MyBookings),
});
const checkoutRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/checkout",
  component: () => wrap(Checkout),
});
const profileRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/profile",
  component: () => wrap(CustomerProfile),
});
const notificationsRoute = createRoute({
  getParentRoute: () => customerLayoutRoute,
  path: "/notifications",
  component: () => wrap(Notifications),
});

// Owner layout + routes
const ownerLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/owner",
  component: OwnerLayout,
});
const ownerIndexRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/owner/dashboard" });
  },
});
const ownerDashboardRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/dashboard",
  component: () => wrap(OwnerDashboard),
});
const ownerPropertiesRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/properties",
  component: () => wrap(OwnerProperties),
});
const ownerPropertyNewRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/property/new",
  component: () => wrap(OwnerPropertyNew),
});
const ownerPropertyEditRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/property/$id/edit",
  component: () => wrap(OwnerPropertyEdit),
});
const ownerEarningsRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/earnings",
  component: () => wrap(OwnerEarnings),
});
const ownerSettingsRoute = createRoute({
  getParentRoute: () => ownerLayoutRoute,
  path: "/settings",
  component: () => wrap(OwnerSettings),
});

// Admin layout + routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});
const adminIndexRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/admin/dashboard" });
  },
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/dashboard",
  component: () => wrap(AdminDashboard),
});
const adminBookingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/bookings",
  component: () => wrap(AdminBookings),
});
const adminPropertiesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/properties",
  component: () => wrap(AdminProperties),
});
const adminUsersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/users",
  component: () => wrap(AdminUsers),
});
const adminPaymentsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/payments",
  component: () => wrap(AdminPayments),
});
const adminAnalyticsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/analytics",
  component: () => wrap(AdminAnalytics),
});

// Executive layout + routes
const execLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/executive",
  component: ExecutiveLayout,
});
const execIndexRoute = createRoute({
  getParentRoute: () => execLayoutRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/executive/tasks" });
  },
});
const execTasksRoute = createRoute({
  getParentRoute: () => execLayoutRoute,
  path: "/tasks",
  component: () => wrap(ExecutiveTasks),
});
const execTaskDetailRoute = createRoute({
  getParentRoute: () => execLayoutRoute,
  path: "/task/$id",
  component: () => wrap(ExecutiveTaskDetail),
});
const execTaskVerifyRoute = createRoute({
  getParentRoute: () => execLayoutRoute,
  path: "/task/$id/verify",
  component: () => wrap(ExecutiveTaskVerify),
});
const execTaskCheckinRoute = createRoute({
  getParentRoute: () => execLayoutRoute,
  path: "/task/$id/checkin",
  component: () => wrap(ExecutiveTaskCheckin),
});

// ── Route tree ──────────────────────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
  loginRoute,
  setupRoute,
  customerLayoutRoute.addChildren([
    homeRoute,
    searchRoute,
    propertyRoute,
    bookingDetailRoute,
    myBookingsRoute,
    checkoutRoute,
    profileRoute,
    notificationsRoute,
  ]),
  ownerLayoutRoute.addChildren([
    ownerIndexRoute,
    ownerDashboardRoute,
    ownerPropertiesRoute,
    ownerPropertyNewRoute,
    ownerPropertyEditRoute,
    ownerEarningsRoute,
    ownerSettingsRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminIndexRoute,
    adminDashboardRoute,
    adminBookingsRoute,
    adminPropertiesRoute,
    adminUsersRoute,
    adminPaymentsRoute,
    adminAnalyticsRoute,
  ]),
  execLayoutRoute.addChildren([
    execIndexRoute,
    execTasksRoute,
    execTaskDetailRoute,
    execTaskVerifyRoute,
    execTaskCheckinRoute,
  ]),
]);

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-2xl font-display font-bold">Page not found</p>
      <a href="/" className="text-primary underline">
        Go home
      </a>
    </div>
  ),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <RouterProvider router={router} />
        <Toaster position="top-center" richColors />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
