import { createActor } from "@/backend";
import type { UserProfile, UserProfileInput } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserProfile() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async (input: UserProfileInput) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: UserProfileInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    saveProfile: saveMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isUpdating: updateMutation.isPending,
    refetch: query.refetch,
  };
}
