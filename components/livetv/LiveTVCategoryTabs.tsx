import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";

export type LiveTVCategory = "all" | "sports" | "news" | "movies";

export const LIVE_TV_CATEGORIES: LiveTVCategory[] = [
  "all",
  "sports",
  "news",
  "movies",
];

const LABEL_KEYS: Record<LiveTVCategory, string> = {
  all: "live_tv.all",
  sports: "live_tv.sports",
  news: "live_tv.news",
  movies: "live_tv.movies",
};

interface Props {
  value: LiveTVCategory;
  onChange: (category: LiveTVCategory) => void;
}

export const LiveTVCategoryTabs: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {LIVE_TV_CATEGORIES.map((category) => {
        const selected = category === value;
        return (
          <TouchableOpacity
            key={category}
            onPress={() => onChange(category)}
            accessibilityRole='tab'
            accessibilityState={{ selected }}
          >
            <View
              className='px-4 py-2 rounded-full'
              style={{
                backgroundColor: selected ? "#9334E9" : "rgba(255,255,255,0.1)",
              }}
            >
              <Text
                className='text-sm'
                style={{
                  color: selected ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                  fontWeight: selected ? "600" : "400",
                }}
              >
                {t(LABEL_KEYS[category])}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
