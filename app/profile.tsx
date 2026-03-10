import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
    avatarSources,
    MoodType,
    profileBioText,
    profileTodayStats,
    weeklyStats,
} from "../data/mockData";

const moodFace = {
  happy: "happy-outline",
  ok: "remove",
  sad: "sad-outline",
} as const;

const moodColor = {
  happy: "#3b9f74",
  ok: "#93713b",
  sad: "#7a4f9e",
} as const;

const typedWeeklyStats: Array<{
  day: string;
  height: number;
  mood: MoodType;
  color: string;
}> = weeklyStats as Array<{
  day: string;
  height: number;
  mood: MoodType;
  color: string;
}>;

const todayStats = profileTodayStats;

export default function ProfileScreen() {
  const params = useLocalSearchParams<{ name?: string; avatar?: string }>();
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const avatar = Array.isArray(params.avatar)
    ? params.avatar[0]
    : params.avatar;
  const avatarSource = avatar ? avatarSources[avatar] : undefined;
  const displayName = name?.trim() ? name : "User";

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.identityRow}>
        <View style={styles.avatarWrap}>
          {avatarSource ? (
            <Image
              source={avatarSource}
              contentFit="cover"
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarFallback}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <View style={styles.identityInfo}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.bioInlineText}>{profileBioText}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusTopRow}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{todayStats.status}</Text>
          </View>
        </View>

        <View style={styles.statusBottomRow}>
          <View>
            <Text style={styles.statusTimerLabel}>Current Session</Text>
            <Text style={styles.statusTimerValue}>
              {todayStats.activeSessionTimer}
            </Text>
          </View>
          <View>
            <Text style={styles.statusTimerLabel}>Today Goal</Text>
            <Text style={styles.statusTimerValue}>
              {todayStats.focusMinutes}/{todayStats.goalMinutes}m
            </Text>
          </View>
        </View>

        <View style={styles.goalTrack}>
          <View
            style={[
              styles.goalFill,
              {
                width: `${Math.min(
                  100,
                  Math.round(
                    (todayStats.focusMinutes / todayStats.goalMinutes) * 100,
                  ),
                )}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.quickStatsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.focusMinutes}</Text>
          <Text style={styles.statLabel}>Focus Min Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.sessionsDone}</Text>
          <Text style={styles.statLabel}>Sessions Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.distractions}</Text>
          <Text style={styles.statLabel}>Distractions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{todayStats.streakDays}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>This Week</Text>
        </View>

        <View style={styles.weekChartRow}>
          {typedWeeklyStats.map((entry) => (
            <View key={entry.day} style={styles.weekBarWrap}>
              <View
                style={[
                  styles.weekBar,
                  { height: entry.height, backgroundColor: entry.color },
                ]}
              >
                <View style={styles.moodBubble}>
                  <Ionicons
                    name={moodFace[entry.mood]}
                    size={13}
                    color={moodColor[entry.mood]}
                  />
                </View>
              </View>
              <Text style={styles.dayLabel}>{entry.day}</Text>
            </View>
          ))}
        </View>
      </View>
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
  identityRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  identityInfo: {
    flex: 1,
    marginLeft: 14,
  },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: "hidden",
    backgroundColor: "#caefe8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    fontSize: 42,
    color: "#0f6a61",
    fontWeight: "700",
  },
  name: {
    fontSize: 40,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#173530",
    marginBottom: 6,
  },
  bioInlineText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#5f7974",
    fontWeight: "500",
  },
  statusCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7ebe7",
    padding: 12,
    marginBottom: 12,
  },
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f7f4",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#12a495",
  },
  statusText: {
    color: "#0f6a61",
    fontSize: 12,
    fontWeight: "700",
  },
  statusBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusTimerLabel: {
    color: "#6a807c",
    fontSize: 12,
    marginBottom: 2,
  },
  statusTimerValue: {
    color: "#173530",
    fontSize: 18,
    fontWeight: "700",
  },
  goalTrack: {
    height: 8,
    backgroundColor: "#e8f1ef",
    borderRadius: 999,
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    backgroundColor: "#12a495",
    borderRadius: 999,
  },
  weekChartRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  weekBarWrap: {
    alignItems: "center",
  },
  weekBar: {
    width: 34,
    borderRadius: 17,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 6,
    marginBottom: 8,
  },
  moodBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 13,
    color: "#dcfffa",
  },
  quickStatsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 18,
  },
  statCard: {
    width: "48.5%",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7ebe7",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 28,
    lineHeight: 30,
    color: "#0f6a61",
    fontWeight: "800",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#5f7974",
    fontWeight: "600",
  },
  sectionHeaderRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 30,
    fontFamily: "serif",
    fontWeight: "100",
    color: "#ecfffc",
  },
  chartCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#12a495",
    padding: 16,
    marginBottom: 8,
  },
});
