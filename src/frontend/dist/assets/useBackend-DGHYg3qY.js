import { d as useActor, f as createActor } from "./index-Dtbu2WTs.js";
function useBackend() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, isLoading: isFetching, ready: !!actor && !isFetching };
}
export {
  useBackend as u
};
