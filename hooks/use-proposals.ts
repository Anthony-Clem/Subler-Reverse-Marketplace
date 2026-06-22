import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RentalRequest } from "./use-requests";

export interface HostProposal {
  id: string;
  requestId: string;
  hostId: string;
  sublerLink: string;
  pitch: string;
  status: string;
  createdAt: string;
  request?: RentalRequest & {
    user?: {
      id: string;
      email: string;
    };
  };
}

export interface CreateProposalInput {
  requestId: string;
  sublerLink: string;
  pitch: string;
}

export function useHostProposals() {
  return useQuery<HostProposal[]>({
    queryKey: ["proposals", "host"],
    queryFn: async () => {
      const res = await fetch("/api/host/proposals");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch host proposals");
      }
      return res.json();
    },
  });
}

export function useCreateProposal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProposalInput) => {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit proposal");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useUpdateProposalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "rejected";
    }) => {
      const res = await fetch(`/api/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update proposal status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}
