import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { avatarSources, mockRooms } from "../data/mockData";

export default function MainMenuScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    avatar?: string;
    condition?: string;
  }>();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const avatar = Array.isArray(params.avatar)
    ? params.avatar[0]
    : params.avatar;
  const condition = Array.isArray(params.condition)
    ? params.condition[0]
    : params.condition;
  const selectedCondition = condition === "visual" ? "visual" : "text";
  const avatarSource = avatar ? avatarSources[avatar] : undefined;
  const displayName = name?.trim() ? name : "User";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Hi, {displayName}!</Text>
          <Pressable
            style={styles.avatarCircle}
            onPress={() =>
              router.push({
                pathname: "./profile",
                params: {
                  ...(name ? { name } : {}),
                  ...(avatar ? { avatar } : {}),
                  ...(condition ? { condition } : {}),
                },
              } as never)
            }
          >
            {avatarSource ? (
              <Image
                source={avatarSource}
                contentFit="cover"
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.createButton}>
          <View style={styles.createButtonTopRow}>
            <Text style={styles.createButtonText}>Create Room</Text>
            <View style={styles.createIconBadge}>
              <Ionicons name="add" size={18} color="#0e6e64" />
            </View>
          </View>
          <Text style={styles.createButtonSubtext}>
            Start a fresh accountability room and invite your friends.
          </Text>
          <View style={styles.createButtonInfoRow}>
            <View style={styles.createButtonInfoLeft}>
              <Ionicons name="time-outline" size={14} color="#dffef9" />
              <Text style={styles.createButtonInfoText}>2 mins</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleJoin]}>
          Join Rooms
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#8b8e96" />
          <Text style={styles.searchText}>Search rooms...</Text>
        </View>
        <View style={styles.filterRow}>
          <Text style={[styles.filterPill, styles.filterPillActive]}>
            Focus
          </Text>
          <Text style={styles.filterPill}>Study</Text>
          <Text style={styles.filterPill}>Workout</Text>
          <Text style={styles.filterPill}>Night</Text>
        </View>

        {mockRooms.map((room) => (
          <Pressable
            key={room.id}
            style={styles.listRoomCard}
            onPress={() =>
              router.push({
                pathname:
                  selectedCondition === "visual"
                    ? "./room-visual"
                    : "./room-text",
                params: {
                  room: room.name,
                  roomId: room.id,
                  ...(name ? { name } : {}),
                  ...(avatar ? { avatar } : {}),
                  ...(condition ? { condition } : {}),
                },
              } as never)
            }
          >
            <View style={styles.listHeaderRow}>
              <Text style={styles.listRoomTitle}>{room.name}</Text>
              <View style={styles.joinNowPill}>
                <Text style={styles.joinNowText}>Join</Text>
              </View>
            </View>

            <View style={styles.quickMetaRow}>
              <View style={styles.metricItem}>
                <Ionicons name="time-outline" size={13} color="#5f7974" />
                <Text style={styles.metricItemText}>
                  Created {room.created}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="people-outline" size={13} color="#5f7974" />
                <Text style={styles.metricItemText}>{room.capacity}</Text>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="flame-outline" size={13} color="#5f7974" />
                <Text style={styles.metricItemText}>{room.streak}</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              {room.tags.map((tag) => (
                <Text key={`${room.id}-${tag}`} style={styles.filterPill}>
                  {tag}
                </Text>
              ))}
              <View style={styles.modeMeta}>
                <Ionicons name="globe-outline" size={13} color="#5f7974" />
                <Text style={styles.modeMetaText}>{room.mode}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f8f7",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
  },
  headerRow: {
    marginTop: 16,
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 44,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#173530",
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#caefe8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f6a61",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  createButton: {
    width: "100%",
    backgroundColor: "#12a495",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 24,
  },
  createButtonTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
  },
  createButtonSubtext: {
    color: "#ddfffa",
    fontSize: 14,
    marginBottom: 12,
    maxWidth: "85%",
  },
  createButtonInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  createButtonInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  createIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#d8f7f2",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonInfoText: {
    color: "#dffef9",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitleJoin: {
    marginBottom: 14,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f1ef",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d6e8e4",
  },
  searchText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#6a807c",
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#173530",
    marginBottom: 12,
  },
  listRoomCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7ebe7",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  listRoomTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#173530",
  },
  quickMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricItemText: {
    color: "#5f7974",
    fontSize: 12,
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 30,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cfe5e1",
    backgroundColor: "#fff",
    color: "#45635f",
    fontSize: 12,
  },
  filterPillActive: {
    backgroundColor: "#caefe8",
    borderColor: "#9fded4",
    color: "#0f6a61",
    fontWeight: "600",
  },
  modeMeta: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  modeMetaText: {
    color: "#5f7974",
    fontSize: 12,
    fontWeight: "600",
  },
  joinNowPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#0f6a61",
  },
  joinNowText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
  },
});
