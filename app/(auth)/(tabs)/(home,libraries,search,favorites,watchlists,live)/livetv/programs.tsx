import type { BaseItemDto } from "@jellyfin/sdk/lib/generated-client";
import { getLiveTvApi } from "@jellyfin/sdk/lib/utils/api";
import { useAtom } from "jotai";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollingCollectionList } from "@/components/home/ScrollingCollectionList";
import {
  type LiveTVCategory,
  LiveTVCategoryTabs,
} from "@/components/livetv/LiveTVCategoryTabs";
import { TVLiveTVPage } from "@/components/livetv/TVLiveTVPage";
import { apiAtom, userAtom } from "@/providers/JellyfinProvider";

export default function page() {
  if (Platform.isTV) {
    return <TVLiveTVPage />;
  }

  return <MobileLiveTVPrograms />;
}

/** Server-side filters Jellyfin applies for each category tab. */
const CATEGORY_FILTERS: Record<
  LiveTVCategory,
  { isSports?: boolean; isNews?: boolean; isMovie?: boolean }
> = {
  all: {},
  sports: { isSports: true },
  news: { isNews: true },
  movies: { isMovie: true },
};

/**
 * Jellyfin orders "On Now" by start date, then by a recommendation score that
 * knows nothing about sport. Float live sport to the front the way Hulu does,
 * leaving the server's relative order intact otherwise.
 */
function sportsFirst(items: BaseItemDto[]): BaseItemDto[] {
  return [
    ...items.filter((item) => item.IsSports),
    ...items.filter((item) => !item.IsSports),
  ];
}

function MobileLiveTVPrograms() {
  const [api] = useAtom(apiAtom);
  const [user] = useAtom(userAtom);
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState<LiveTVCategory>("all");

  const { t } = useTranslation();
  const filter = CATEGORY_FILTERS[category];

  return (
    <ScrollView
      nestedScrollEnabled
      contentInsetAdjustmentBehavior='automatic'
      key={"home"}
      contentContainerStyle={{
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: 16,
        paddingTop: 8,
      }}
    >
      <View className='mb-2'>
        <LiveTVCategoryTabs value={category} onChange={setCategory} />
      </View>
      <View className='flex flex-col space-y-2'>
        <ScrollingCollectionList
          queryKey={["livetv", "recommended", category]}
          title={t("live_tv.on_now")}
          queryFn={async () => {
            if (!api) return [] as BaseItemDto[];
            const res = await getLiveTvApi(api).getRecommendedPrograms({
              userId: user?.Id,
              isAiring: true,
              limit: 24,
              imageTypeLimit: 1,
              enableImageTypes: ["Primary", "Thumb", "Backdrop"],
              enableTotalRecordCount: false,
              fields: ["ChannelInfo", "PrimaryImageAspectRatio"],
              ...filter,
            });
            const items = res.data.Items || [];
            return category === "all" ? sportsFirst(items) : items;
          }}
          orientation='horizontal'
        />
        {category === "all" ? (
          <>
            <ScrollingCollectionList
              queryKey={["livetv", "shows"]}
              title={t("live_tv.shows")}
              hideIfEmpty
              queryFn={async () => {
                if (!api) return [] as BaseItemDto[];
                const res = await getLiveTvApi(api).getLiveTvPrograms({
                  userId: user?.Id,
                  hasAired: false,
                  limit: 9,
                  isMovie: false,
                  isSeries: true,
                  isSports: false,
                  isNews: false,
                  isKids: false,
                  enableTotalRecordCount: false,
                  fields: ["ChannelInfo", "PrimaryImageAspectRatio"],
                  enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                });
                return res.data.Items || [];
              }}
              orientation='horizontal'
            />
            <ScrollingCollectionList
              queryKey={["livetv", "movies"]}
              title={t("live_tv.movies")}
              hideIfEmpty
              queryFn={async () => {
                if (!api) return [] as BaseItemDto[];
                const res = await getLiveTvApi(api).getLiveTvPrograms({
                  userId: user?.Id,
                  hasAired: false,
                  limit: 9,
                  isMovie: true,
                  enableTotalRecordCount: false,
                  fields: ["ChannelInfo"],
                  enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                });
                return res.data.Items || [];
              }}
              orientation='horizontal'
            />
            <ScrollingCollectionList
              queryKey={["livetv", "sports"]}
              title={t("live_tv.sports")}
              hideIfEmpty
              queryFn={async () => {
                if (!api) return [] as BaseItemDto[];
                const res = await getLiveTvApi(api).getLiveTvPrograms({
                  userId: user?.Id,
                  hasAired: false,
                  limit: 9,
                  isSports: true,
                  enableTotalRecordCount: false,
                  fields: ["ChannelInfo"],
                  enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                });
                return res.data.Items || [];
              }}
              orientation='horizontal'
            />
            <ScrollingCollectionList
              queryKey={["livetv", "kids"]}
              title={t("live_tv.for_kids")}
              hideIfEmpty
              queryFn={async () => {
                if (!api) return [] as BaseItemDto[];
                const res = await getLiveTvApi(api).getLiveTvPrograms({
                  userId: user?.Id,
                  hasAired: false,
                  limit: 9,
                  isKids: true,
                  enableTotalRecordCount: false,
                  fields: ["ChannelInfo"],
                  enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                });
                return res.data.Items || [];
              }}
              orientation='horizontal'
            />
            <ScrollingCollectionList
              queryKey={["livetv", "news"]}
              title={t("live_tv.news")}
              hideIfEmpty
              queryFn={async () => {
                if (!api) return [] as BaseItemDto[];
                const res = await getLiveTvApi(api).getLiveTvPrograms({
                  userId: user?.Id,
                  hasAired: false,
                  limit: 9,
                  isNews: true,
                  enableTotalRecordCount: false,
                  fields: ["ChannelInfo"],
                  enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                });
                return res.data.Items || [];
              }}
              orientation='horizontal'
            />
          </>
        ) : (
          <ScrollingCollectionList
            queryKey={["livetv", "upcoming", category]}
            title={t("live_tv.coming_soon")}
            hideIfEmpty
            queryFn={async () => {
              if (!api) return [] as BaseItemDto[];
              const res = await getLiveTvApi(api).getLiveTvPrograms({
                userId: user?.Id,
                hasAired: false,
                limit: 9,
                enableTotalRecordCount: false,
                fields: ["ChannelInfo"],
                enableImageTypes: ["Primary", "Thumb", "Backdrop"],
                ...filter,
              });
              return res.data.Items || [];
            }}
            orientation='horizontal'
          />
        )}
      </View>
    </ScrollView>
  );
}
