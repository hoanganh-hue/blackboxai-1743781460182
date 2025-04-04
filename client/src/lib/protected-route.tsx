import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { USER_ROLES } from "@shared/schema";

type ProtectedRouteProps = {
  path: string;
  component: () => React.JSX.Element;
  allowedRoles?: string[];
};

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}

export function AdminRoute({ path, component }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute 
      path={path} 
      component={component} 
      allowedRoles={[USER_ROLES.ADMIN]} 
    />
  );
}

export function SellerRoute({ path, component }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute 
      path={path} 
      component={component} 
      allowedRoles={[USER_ROLES.SELLER, USER_ROLES.ADMIN]} 
    />
  );
}
