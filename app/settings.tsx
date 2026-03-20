import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ condition?: string }>();
  const condition = Array.isArray(params.condition)
    ? params.condition[0]
    : params.condition;
  const selectedCondition: "text" | "visual" =
    condition === "visual" ? "visual" : "text";

  const setCondition = (next: "text" | "visual") => {
    router.setParams({ condition: next });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.conditionCard}>
        <Text style={styles.conditionLabel}>Choose condition</Text>
        <View style={styles.conditionRow}>
          <Pressable
            style={[
              styles.conditionButton,
              selectedCondition === "text" && styles.conditionButtonSelected,
            ]}
            onPress={() => setCondition("text")}
          >
            <Text
              style={[
                styles.conditionText,
                selectedCondition === "text" && styles.conditionTextSelected,
              ]}
            >
              Text
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.conditionButton,
              selectedCondition === "visual" && styles.conditionButtonSelected,
            ]}
            onPress={() => setCondition("visual")}
          >
            <Text
              style={[
                styles.conditionText,
                selectedCondition === "visual" && styles.conditionTextSelected,
              ]}
            >
              Visual
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.listCard}>
        <View style={styles.listRow}>
          <Ionicons name="notifications-outline" size={22} color="#173530" />
          <Text style={styles.listRowText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#49645f" />
        </View>
        <View style={styles.listRow}>
          <Ionicons name="language-outline" size={22} color="#173530" />
          <Text style={styles.listRowText}>Language</Text>
          <Ionicons name="chevron-forward" size={20} color="#49645f" />
        </View>
        <View style={[styles.listRow, styles.listRowLast]}>
          <Ionicons name="help-circle-outline" size={22} color="#173530" />
          <Text style={styles.listRowText}>FAQ</Text>
          <Ionicons name="chevron-forward" size={20} color="#49645f" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 30,
    backgroundColor: "#f2f8f7",
  },
  title: {
    fontSize: 44,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#173530",
    marginBottom: 14,
  },
  conditionCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d7ebe7",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 12,
  },
  conditionLabel: {
    fontSize: 16,
    color: "#5f7672",
    marginBottom: 10,
  },
  conditionRow: {
    flexDirection: "row",
    gap: 10,
  },
  conditionButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d6e8e4",
    backgroundColor: "#f7fcfb",
    paddingVertical: 10,
    alignItems: "center",
  },
  conditionButtonSelected: {
    borderColor: "#11897e",
    backgroundColor: "#e8f6f3",
  },
  conditionText: {
    fontSize: 16,
    color: "#5f7672",
    fontWeight: "600",
  },
  conditionTextSelected: {
    color: "#0f6a61",
    fontWeight: "700",
  },
  listCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d7ebe7",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e8f1ef",
  },
  listRowLast: {
    borderBottomWidth: 0,
  },
  listRowText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 18,
    color: "#173530",
  },
});
