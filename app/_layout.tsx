import { Ionicons } from "@expo/vector-icons";
import {
  Slot,
  useGlobalSearchParams,
  usePathname,
  useRouter,
} from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const globalParams = useGlobalSearchParams<{
    name?: string;
    avatar?: string;
    condition?: string;
  }>();

  const name = Array.isArray(globalParams.name)
    ? globalParams.name[0]
    : globalParams.name;
  const avatar = Array.isArray(globalParams.avatar)
    ? globalParams.avatar[0]
    : globalParams.avatar;
  const condition = Array.isArray(globalParams.condition)
    ? globalParams.condition[0]
    : globalParams.condition;

  const sharedParams = {
    ...(name ? { name } : {}),
    ...(avatar ? { avatar } : {}),
    ...(condition ? { condition } : {}),
  };

  const isHome = pathname === "/menu";
  const isProfile = pathname === "/profile";
  const isSettings = pathname === "/settings";
  const showBackButton = pathname !== "/login" && pathname !== "/menu";

  return (
    <View style={styles.outerShell}>
      <View style={styles.deviceFrame}>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.header}>
            {showBackButton ? (
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#ebfffb" />
              </Pressable>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <Text style={styles.headerTitle}>Witness</Text>
            <View style={styles.backButtonPlaceholder} />
          </View>

          <View style={styles.mainSurface}>
            <Slot />
          </View>

          <View style={styles.footer}>
            <Pressable
              style={styles.footerItem}
              onPress={() =>
                router.push({
                  pathname: "./menu",
                  params: sharedParams,
                } as never)
              }
            >
              <Ionicons
                name={isHome ? "home" : "home-outline"}
                size={24}
                color={isHome ? "#ebfffb" : "#bfeee7"}
              />
              <Text
                style={[styles.footerLabel, isHome && styles.footerLabelActive]}
              >
                Home
              </Text>
            </Pressable>

            <Pressable
              style={styles.footerItem}
              onPress={() =>
                router.push({
                  pathname: "./profile",
                  params: sharedParams,
                } as never)
              }
            >
              <Ionicons
                name={isProfile ? "person" : "person-outline"}
                size={24}
                color={isProfile ? "#ebfffb" : "#bfeee7"}
              />
              <Text
                style={[
                  styles.footerLabel,
                  isProfile && styles.footerLabelActive,
                ]}
              >
                Profile
              </Text>
            </Pressable>

            <Pressable
              style={styles.footerItem}
              onPress={() =>
                router.push({
                  pathname: "./settings",
                  params: sharedParams,
                } as never)
              }
            >
              <Ionicons
                name={isSettings ? "settings" : "settings-outline"}
                size={24}
                color={isSettings ? "#ebfffb" : "#bfeee7"}
              />
              <Text
                style={[
                  styles.footerLabel,
                  isSettings && styles.footerLabelActive,
                ]}
              >
                Settings
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShell: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
  },
  deviceFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#f2f8f7",
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f8f7",
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#0b6f65",
    borderBottomWidth: 1,
    borderBottomColor: "#1f857a",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ebfffb",
    letterSpacing: 0.4,
  },
  mainSurface: {
    flex: 1,
    backgroundColor: "#f2f8f7",
  },
  footer: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 18,
    backgroundColor: "#0b6f65",
    borderTopWidth: 1,
    borderTopColor: "#1f857a",
  },
  footerItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  footerLabel: {
    color: "#bfeee7",
    fontSize: 12,
    fontWeight: "600",
  },
  footerLabelActive: {
    color: "#ebfffb",
  },
});
