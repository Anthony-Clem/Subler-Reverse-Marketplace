import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface AdminRequest {
  id: string;
  eventType: string;
  spaceType: string;
  startDate: string;
  endDate: string;
  budget: string;
  headcount: number;
  amenities: string;
  locationPreference: string;
  notes: string | null;
  status: "open" | "closed" | "fulfilled";
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    email: string;
  };
  proposals: {
    id: string;
    status: string;
    createdAt: string;
  }[];
}

export interface PendingHostUser {
  id: string;
  email: string;
  role: string;
  hostStatus: "pending" | "approved" | "rejected" | null;
  createdAt: string;
}

export function useAdminRequests() {
  return useQuery<AdminRequest[]>({
    queryKey: ["admin", "requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/requests");
      if (!res.ok) {
        throw new Error("Failed to fetch admin requests");
      }
      return res.json();
    },
  });
}

export function useUpdateReqStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: "open" | "closed" | "fulfilled";
    }) => {
      const res = await fetch("/api/admin/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update request status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useAdminUpgrades() {
  return useQuery<PendingHostUser[]>({
    queryKey: ["admin", "upgrades"],
    queryFn: async () => {
      const res = await fetch("/api/admin/upgrades");
      if (!res.ok) {
        throw new Error("Failed to fetch pending upgrades");
      }
      return res.json();
    },
  });
}

export function useProcessUpgrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUserId,
      action,
    }: {
      targetUserId: string;
      action: "approve" | "reject";
    }) => {
      const res = await fetch("/api/admin/upgrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, action }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process upgrade");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "upgrades"] });
    },
  });
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  hostStatus: string | null;
  createdAt: string;
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        throw new Error("Failed to fetch admin users");
      }
      return res.json();
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      targetUserId,
      role,
    }: {
      targetUserId: string;
      role: "renter" | "admin";
    }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId, role }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update user role");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}
