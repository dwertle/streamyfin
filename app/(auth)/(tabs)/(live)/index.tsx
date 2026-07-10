import { Redirect } from "expo-router";

// The Live tab exists so Live TV is one tap away instead of three
// (Library -> Live TV -> Guide). The screens themselves live in the shared
// route group, so land straight on them rather than duplicating the layout.
export default function LiveTabIndex() {
  return <Redirect href='/(auth)/(tabs)/(live)/livetv/programs' />;
}
