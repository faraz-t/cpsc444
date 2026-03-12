import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  avatarSources,
  mockRooms,
  profileTodayStats,
  UserStatus,
} from "../data/mockData";
import FocusTimerStarter from "./components/session";

const statusStyles: Record<
  UserStatus,
  { label: string; dotColor: string; textColor: string; background: string }
> = {
  focusing: {
    label: "Focusing",
    dotColor: "#16a085",
    textColor: "#0f6a61",
    background: "#e6f7f4",
  },
  distracted: {
    label: "Distracted",
    dotColor: "#d57a2a",
    textColor: "#995112",
    background: "#fff0e4",
  },
  break: {
    label: "On Break",
    dotColor: "#6a87d8",
    textColor: "#3e58a1",
    background: "#eaf0ff",
  },
};

export default function RoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name?: string;
    avatar?: string;
    room?: string;
    roomId?: string;
  }>();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const avatar = Array.isArray(params.avatar)
    ? params.avatar[0]
    : params.avatar;
  const roomNameParam = Array.isArray(params.room)
    ? params.room[0]
    : params.room;
  const roomIdParam = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;
  const fallbackRoom = mockRooms[0];
  const selectedRoom =
    mockRooms.find((room) => room.id === roomIdParam) ?? fallbackRoom;
  const roomSummaryStats = selectedRoom.summary;
  const roomName = roomNameParam?.trim() ? roomNameParam : selectedRoom.name;
  const roomDescription = selectedRoom.description;
  const viewerAvatarId = avatar && avatarSources[avatar] ? avatar : "1";

  const membersWithViewer = [
    {
      id: "viewer-you",
      name: "You",
      avatar: viewerAvatarId,
      status: "focusing" as UserStatus,
      focusMinutes: profileTodayStats.focusMinutes,
      sessionsDone: profileTodayStats.sessionsDone,
      distractions: profileTodayStats.distractions,
      streakDays: profileTodayStats.streakDays,
      currentTimer: profileTodayStats.activeSessionTimer,
    },
    ...selectedRoom.members,
  ];

  const statCards = [
    {
      key: "active",
      label: "Active",
      value: roomSummaryStats.activeMembers,
      icon: "people-outline" as const,
      tint: "#e2f7f3",
      iconColor: "#0f6a61",
    },
    {
      key: "focus",
      label: "Focus Min",
      value: roomSummaryStats.focusMinutesToday,
      icon: "timer-outline" as const,
      tint: "#dff0ff",
      iconColor: "#3f6ea8",
    },
    {
      key: "sessions",
      label: "Sessions",
      value: roomSummaryStats.sessionsCompleted,
      icon: "checkmark-done-outline" as const,
      tint: "#e8f8ea",
      iconColor: "#2e7b46",
    },
    {
      key: "distractions",
      label: "Distractions",
      value: roomSummaryStats.distractions,
      icon: "notifications-off-outline" as const,
      tint: "#fff1e6",
      iconColor: "#b2651c",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FocusTimerStarter />
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.roomTitle}>{roomName}</Text>
            <Text style={styles.roomDescription}>{roomDescription}</Text>
          </View>

          <Pressable
            style={styles.leaveButton}
            onPress={() =>
              router.push({
                pathname: "./menu",
                params: {
                  ...(name ? { name } : {}),
                  ...(avatar ? { avatar } : {}),
                },
              } as never)
            }
          >
            <Text style={styles.leaveButtonText}>Leave</Text>
          </Pressable>
        </View>

        <View style={styles.heroMetaRow}>
          <View style={styles.heroMetaItem}>
            <Ionicons name="time-outline" size={13} color="#d8fff9" />
            <Text style={styles.heroMetaText}>
              Created {selectedRoom.created}
            </Text>
          </View>
          <View style={styles.heroMetaItem}>
            <Ionicons name="globe-outline" size={13} color="#d8fff9" />
            <Text style={styles.heroMetaText}>{selectedRoom.mode}</Text>
          </View>
          <View style={styles.heroMetaItem}>
            <Ionicons name="people-outline" size={13} color="#d8fff9" />
            <Text style={styles.heroMetaText}>{selectedRoom.capacity}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Today</Text>
      <View style={styles.roomStatsGrid}>
        {statCards.map((stat) => (
          <View key={stat.key} style={styles.roomStatCard}>
            <View
              style={[styles.roomStatIconWrap, { backgroundColor: stat.tint }]}
            >
              <Ionicons name={stat.icon} size={16} color={stat.iconColor} />
            </View>
            <Text style={styles.roomStatValue}>{stat.value}</Text>
            <Text style={styles.roomStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Active Now</Text>

      {membersWithViewer.map((member) => {
        const avatarSource = avatarSources[member.avatar];
        const status = statusStyles[member.status];

        return (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberTopRow}>
              <View style={styles.memberIdentityRow}>
                <View style={styles.memberAvatarWrap}>
                  <Image
                    source={avatarSource}
                    contentFit="cover"
                    style={styles.memberAvatarImage}
                  />
                </View>
                <View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberTimer}>{member.currentTimer}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: status.background },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: status.dotColor },
                  ]}
                />
                <Text style={[styles.statusText, { color: status.textColor }]}>
                  {status.label}
                </Text>
              </View>
            </View>

            <View style={styles.memberStatsRow}>
              <View style={styles.memberStatItem}>
                <Text style={styles.memberStatValue}>
                  {member.focusMinutes}
                </Text>
                <Text style={styles.memberStatLabel}>Focus Min</Text>
              </View>
              <View style={styles.memberStatItem}>
                <Text style={styles.memberStatValue}>
                  {member.sessionsDone}
                </Text>
                <Text style={styles.memberStatLabel}>Sessions</Text>
              </View>
              <View style={styles.memberStatItem}>
                <Text style={styles.memberStatValue}>
                  {member.distractions}
                </Text>
                <Text style={styles.memberStatLabel}>Distractions</Text>
              </View>
              <View style={styles.memberStatItem}>
                <Text style={styles.memberStatValue}>{member.streakDays}</Text>
                <Text style={styles.memberStatLabel}>Streak</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 40,
    backgroundColor: "#f2f8f7",
  },
  heroCard: {
    borderRadius: 22,
    backgroundColor: "#12a495",
    padding: 16,
    marginBottom: 20,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  heroTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },
  roomTitle: {
    fontSize: 34,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#ecfffc",
    marginBottom: 2,
  },
  roomDescription: {
    color: "#dbfffa",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  leaveButton: {
    borderRadius: 999,
    backgroundColor: "#dcfbf6",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  leaveButtonText: {
    color: "#0f6a61",
    fontWeight: "700",
    fontSize: 12,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  heroMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    color: "#d8fff9",
    fontSize: 12,
    fontWeight: "600",
  },
  roomStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 20,
  },
  roomStatCard: {
    width: "48.5%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7ebe7",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  roomStatIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  roomStatValue: {
    color: "#173530",
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "800",
  },
  roomStatLabel: {
    color: "#5f7974",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 32,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#173530",
    marginBottom: 12,
  },
  memberCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d7ebe7",
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 12,
  },
  memberTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  memberIdentityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatarWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: "#caefe8",
    marginRight: 10,
  },
  memberAvatarImage: {
    width: "100%",
    height: "100%",
  },
  memberName: {
    color: "#173530",
    fontSize: 18,
    fontWeight: "700",
  },
  memberTimer: {
    color: "#5f7974",
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  memberStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  memberStatItem: {
    width: "24%",
    borderRadius: 10,
    backgroundColor: "#f4faf9",
    paddingVertical: 8,
    alignItems: "center",
  },
  memberStatValue: {
    color: "#0f6a61",
    fontSize: 18,
    lineHeight: 20,
    fontWeight: "800",
  },
  memberStatLabel: {
    color: "#5f7974",
    fontSize: 10,
    fontWeight: "600",
  },
});
