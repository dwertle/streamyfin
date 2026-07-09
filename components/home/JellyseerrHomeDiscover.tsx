import { useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";
import Discover from "@/components/jellyseerr/discover/Discover";
import { TVDiscover } from "@/components/jellyseerr/discover/TVDiscover";
import { useJellyseerr } from "@/hooks/useJellyseerr";

export const JellyseerrHomeDiscover = () => {
  const { jellyseerrApi } = useJellyseerr();

  const { data: sliders } = useQuery({
    queryKey: ["home", "jellyseerr", "discoverSettings"],
    queryFn: async () => jellyseerrApi?.discoverSettings(),
    enabled: !!jellyseerrApi,
  });

  if (!jellyseerrApi || !sliders) return null;

  return Platform.isTV ? (
    <TVDiscover sliders={sliders} preferFirstItemFocus={false} />
  ) : (
    <Discover sliders={sliders} />
  );
};
