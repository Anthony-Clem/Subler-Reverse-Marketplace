import { useQuery, useMutation } from "@tanstack/react-query";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  hostStatus: "pending" | "approved" | "rejected" | null;
  createdAt: string;
}

export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return res.json();
    },
  });
}

export function useRequestHostUpgrade() {
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/host/upgrade", {
        method: "POST",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit host upgrade request");
      }
      return res.json();
    },
  });
}
