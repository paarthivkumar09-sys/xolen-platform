import { d as useActor, m as useQueryClient, e as useQuery, n as useMutation, f as createActor } from "./index-Dtbu2WTs.js";
function useUserProfile() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching
  });
  const saveMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateUserProfile(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    }
  });
  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    saveProfile: saveMutation.mutateAsync,
    updateProfile: updateMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isUpdating: updateMutation.isPending,
    refetch: query.refetch
  };
}
export {
  useUserProfile as u
};
