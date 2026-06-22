import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  hostStatus: string | null;
}

export interface Proposal {
  id: string;
  requestId: string;
  hostId: string;
  sublerLink: string;
  pitch: string;
  status: string;
  createdAt: string;
  host?: UserProfile;
}

export interface RentalRequest {
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
  status: string;
  userId: string;
  createdAt: string;
  proposals?: Proposal[];
  user?: {
    id: string;
    email: string;
  };
}

export function useMyRequests() {
  return useQuery<RentalRequest[]>({
    queryKey: ["requests", "my"],
    queryFn: async () => {
      const res = await fetch("/api/requests/my");
      if (!res.ok) {
        throw new Error("Failed to fetch requests");
      }
      return res.json();
    },
  });
}

export function useOpenRequests() {
  return useQuery<RentalRequest[]>({
    queryKey: ["requests", "open"],
    queryFn: async () => {
      const res = await fetch("/api/requests");
      if (!res.ok) {
        throw new Error("Failed to fetch open requests");
      }
      return res.json();
    },
  });
}

export interface CreateRequestInput {
  eventType: string;
  spaceType: string;
  startDate: Date | string;
  endDate: Date | string;
  budget: number | string;
  headcount: number;
  amenities: string;
  locationPreference: string;
  notes?: string;
}

export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRequestInput) => {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create request");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateRequestInput & { status: string }>;
    }) => {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update request");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete request");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
