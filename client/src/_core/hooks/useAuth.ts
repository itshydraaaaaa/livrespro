import { trpc } from "@/lib/trpc";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation } from "wouter";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/login" } = options ?? {};
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async (data) => {
      utils.auth.me.setData(undefined, data.user);
      await utils.auth.me.invalidate();
    },
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      return loginMutation.mutateAsync({ email, password });
    },
    [loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync();
    setLocation("/login");
  }, [logoutMutation, setLocation]);

  const user = meQuery.data ?? null;
  const loading = meQuery.isLoading || loginMutation.isPending || logoutMutation.isPending;

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || loginMutation.isPending) return;
    if (!user && window.location.pathname !== redirectPath) {
      setLocation(redirectPath);
    }
  }, [redirectOnUnauthenticated, redirectPath, meQuery.isLoading, loginMutation.isPending, user, setLocation]);

  return {
    user,
    loading,
    error: meQuery.error || loginMutation.error || logoutMutation.error || null,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    logout,
    refresh: () => meQuery.refetch(),
  };
}
