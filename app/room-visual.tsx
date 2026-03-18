import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { avatarSources, mockRooms } from "../data/mockData";
import FocusTimerStarter from "./components/session";
import { useSessionStore } from "./state/session-store";

type ChartEntity = {
  id: string;
  name: string;
  avatar: string;
  focusMinutes: number;
  sessionsDone: number;
  streakDays: number;
  distractions: number;
};

type MetricConfig = {
  key: "sessionsDone" | "streakDays" | "distractions";
  title: string;
  color: string;
  avgColor: string;
  lowerIsBetter?: boolean;
};

const metricConfigs: MetricConfig[] = [
  {
    key: "sessionsDone",
    title: "Sessions",
    color: "#3d95c6",
    avgColor: "#256b8c",
  },
  {
    key: "streakDays",
    title: "Streak Days",
    color: "#2ea89f",
    avgColor: "#1f7d77",
  },
  {
    key: "distractions",
    title: "Distractions",
    color: "#5db6cf",
    avgColor: "#3b8ea6",
    lowerIsBetter: true,
  },
];

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function RoomVisualScreen() {
  const router = useRouter();
  const { viewerStats, getMembersForRoom, setCurrentRoomId } =
    useSessionStore();
  const params = useLocalSearchParams<{
    name?: string;
    avatar?: string;
    condition?: string;
    room?: string;
    roomId?: string;
  }>();

  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const avatar = Array.isArray(params.avatar)
    ? params.avatar[0]
    : params.avatar;
  const condition = Array.isArray(params.condition)
    ? params.condition[0]
    : params.condition;
  const roomNameParam = Array.isArray(params.room)
    ? params.room[0]
    : params.room;
  const roomIdParam = Array.isArray(params.roomId)
    ? params.roomId[0]
    : params.roomId;

  const fallbackRoom = mockRooms[0];
  const selectedRoom =
    mockRooms.find((room) => room.id === roomIdParam) ?? fallbackRoom;
  const roomName = roomNameParam?.trim() ? roomNameParam : selectedRoom.name;
  const runtimeMembers = getMembersForRoom(selectedRoom.id);

  React.useEffect(() => {
    setCurrentRoomId(selectedRoom.id);
  }, [selectedRoom.id, setCurrentRoomId]);

  const members: ChartEntity[] = runtimeMembers.map((member) => ({
    id: member.id,
    name: member.name,
    avatar: member.avatar,
    focusMinutes: member.focusMinutes,
    sessionsDone: member.sessionsDone,
    streakDays: member.streakDays,
    distractions: member.distractions,
  }));

  const viewerAvatarId = avatar && avatarSources[avatar] ? avatar : "1";
  const viewerEntity: ChartEntity = {
    id: "viewer-you",
    name: "You",
    avatar: viewerAvatarId,
    focusMinutes: viewerStats.focusMinutes,
    sessionsDone: viewerStats.sessionsDone,
    streakDays: viewerStats.streakDays,
    distractions: viewerStats.distractions,
  };

  const chartEntities = [viewerEntity, ...members];

  const focusValues = chartEntities.map((member) => member.focusMinutes);
  const maxFocus = Math.max(...focusValues, 1);
  const avgFocus = average(members.map((member) => member.focusMinutes));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FocusTimerStarter />
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View style={styles.heroTitleWrap}>
            <Text style={styles.roomTitle}>{roomName}</Text>
            <Text style={styles.roomDescription}>
              {selectedRoom.description}
            </Text>
          </View>

          <Pressable
            style={styles.leaveButton}
            onPress={() =>
              router.push({
                pathname: "./menu",
                params: {
                  ...(name ? { name } : {}),
                  ...(avatar ? { avatar } : {}),
                  ...(condition ? { condition } : {}),
                },
              } as never)
            }
          >
            <Text style={styles.leaveButtonText}>Leave</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.focusCard}>
        <View style={styles.focusHeader}>
          <Text style={styles.focusTitle}>Focus Minutes</Text>
          <Text style={styles.focusAvgText}>Avg: {avgFocus.toFixed(1)}</Text>
        </View>

        <View style={styles.raceChart}>
          <View
            style={[
              styles.avgVerticalLine,
              { left: `${(avgFocus / maxFocus) * 100}%` },
            ]}
          />

          {chartEntities.map((member) => {
            const progress = (member.focusMinutes / maxFocus) * 100;
            const isViewer = member.id === viewerEntity.id;

            return (
              <View key={member.id} style={styles.raceRow}>
                <Text style={styles.raceName}>{member.name}</Text>

                <View style={styles.raceTrack}>
                  <View
                    style={[styles.raceProgress, { width: `${progress}%` }]}
                  />

                  <View
                    style={[
                      styles.racer,
                      { left: `${progress}%` },
                      isViewer && styles.viewerRacer,
                    ]}
                  >
                    <Image
                      source={avatarSources[member.avatar]}
                      contentFit="cover"
                      style={styles.racerAvatar}
                    />
                  </View>
                </View>

                <Text style={styles.raceValue}>{member.focusMinutes}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {metricConfigs.map((metric) => {
        const values = chartEntities.map((member) => member[metric.key]);
        const maxValue = Math.max(...values, 1);
        const avgValue = average(members.map((member) => member[metric.key]));

        return (
          <View key={metric.key} style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>{metric.title}</Text>
              <Text style={styles.avgText}>Avg: {avgValue.toFixed(1)}</Text>
            </View>

            <View style={styles.chartArea}>
              <View
                style={[
                  styles.avgLine,
                  {
                    bottom: `${(avgValue / maxValue) * 100}%`,
                    borderColor: metric.avgColor,
                  },
                ]}
              />

              {chartEntities.map((member) => {
                const value = member[metric.key];
                const barHeight = Math.max(8, (value / maxValue) * 100);
                const isViewer = member.id === viewerEntity.id;

                return (
                  <View key={member.id + metric.key} style={styles.columnWrap}>
                    <Text style={styles.columnValue}>{value}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            height: `${barHeight}%`,
                            backgroundColor: metric.color,
                            borderWidth: isViewer ? 2 : 0,
                            borderColor: isViewer ? "#173530" : "transparent",
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.memberTagWrap}>
                      <View style={styles.memberAvatarWrap}>
                        <Image
                          source={avatarSources[member.avatar]}
                          contentFit="cover"
                          style={styles.memberAvatarImage}
                        />
                      </View>
                      <Text style={styles.memberName}>{member.name}</Text>
                    </View>
                  </View>
                );
              })}
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
    marginBottom: 12,
  },

  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
    marginBottom: 4,
  },

  roomDescription: {
    color: "#dbfffa",
    fontSize: 14,
    lineHeight: 20,
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

  focusCard: {
    borderRadius: 20,
    backgroundColor: "#0f6a61",
    padding: 12,
    borderWidth: 1,
    borderColor: "#0a574f",
    marginBottom: 12,
  },

  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  focusTitle: {
    color: "#ecfffc",
    fontSize: 18,
    fontWeight: "800",
  },

  focusAvgText: {
    color: "#d5fff9",
    fontSize: 12,
    fontWeight: "700",
  },

  raceChart: {
    position: "relative",
    gap: 14,
  },

  avgVerticalLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    borderLeftWidth: 1,
    borderStyle: "dashed",
    borderColor: "#b3fff4",
    opacity: 0.9,
  },

  raceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  raceName: {
    width: 46,
    color: "#dcfffa",
    fontSize: 11,
    fontWeight: "600",
  },

  raceTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "visible",
    justifyContent: "center",
  },

  raceProgress: {
    position: "absolute",
    left: 0,
    height: 8,
    backgroundColor: "#8ff1e3",
    borderRadius: 999,
  },

  racer: {
    position: "absolute",
    marginLeft: -10,
    top: -8,
  },

  viewerRacer: {
    transform: [{ scale: 1.15 }],
  },

  racerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },

  raceValue: {
    width: 32,
    textAlign: "right",
    color: "#dcfffa",
    fontSize: 11,
    fontWeight: "700",
  },

  chartCard: {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d7ebe7",
    padding: 12,
    marginBottom: 12,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  chartTitle: {
    fontSize: 17,
    color: "#173530",
    fontWeight: "700",
  },

  avgText: {
    fontSize: 12,
    color: "#5f7974",
    fontWeight: "600",
  },

  chartArea: {
    height: 190,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    position: "relative",
    paddingTop: 8,
  },

  avgLine: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: "dashed",
    opacity: 0.75,
  },

  columnWrap: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },

  columnValue: {
    fontSize: 11,
    color: "#35514d",
    fontWeight: "700",
  },

  barTrack: {
    width: "76%",
    height: 112,
    borderRadius: 10,
    backgroundColor: "#edf5f3",
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  barFill: {
    width: "100%",
    borderRadius: 10,
  },

  memberTagWrap: {
    alignItems: "center",
  },

  memberAvatarWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 2,
  },

  memberAvatarImage: {
    width: "100%",
    height: "100%",
  },

  memberName: {
    fontSize: 10,
    color: "#4e6a66",
    fontWeight: "600",
  },
});
