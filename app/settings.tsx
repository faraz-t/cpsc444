import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

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
