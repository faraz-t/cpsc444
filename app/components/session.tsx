import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  defaultTimerMinutes,
  timerMinStep,
  timerMinValue,
  timerMaxValue,
} from "../../data/mockData";

type TimerState = "idle" | "running" | "paused";

export default function FocusTimerStarter() {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [durationMinutes, setDurationMinutes] = useState(defaultTimerMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(
    defaultTimerMinutes * 60
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerState === "running") {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerState("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleDecrement = () => {
    setDurationMinutes((prev) => {
      const next = Math.max(timerMinValue, prev - timerMinStep);
      setRemainingSeconds(next * 60);
      return next;
    });
  };

  const handleIncrement = () => {
    setDurationMinutes((prev) => {
      const next = Math.min(timerMaxValue, prev + timerMinStep);
      setRemainingSeconds(next * 60);
      return next;
    });
  };

  const handleStart = () => {
    setRemainingSeconds(durationMinutes * 60);
    setTimerState("running");
  };

  const handlePause = () => {
    setTimerState("paused");
  };

  const handleResume = () => {
    setTimerState("running");
  };

  const handleReset = () => {
    setTimerState("idle");
    setRemainingSeconds(durationMinutes * 60);
  };

  const progress = 1 - remainingSeconds / (durationMinutes * 60);

  return (
    <View style={styles.card}>
      {timerState === "idle" ? (
        <View style={styles.idleRow}>
          <Ionicons name="flame-outline" size={16} color="#dcfffa" />
          <Pressable
            style={styles.stepBtn}
            onPress={handleDecrement}
            disabled={durationMinutes <= timerMinValue}
          >
            <Ionicons
              name="remove"
              size={16}
              color={durationMinutes <= timerMinValue ? "#5a8a83" : "#ecfffc"}
            />
          </Pressable>
          <Text style={styles.durationText}>
            {durationMinutes}
            <Text style={styles.durationUnit}> min</Text>
          </Text>
          <Pressable
            style={styles.stepBtn}
            onPress={handleIncrement}
            disabled={durationMinutes >= timerMaxValue}
          >
            <Ionicons
              name="add"
              size={16}
              color={durationMinutes >= timerMaxValue ? "#5a8a83" : "#ecfffc"}
            />
          </Pressable>
          <Pressable style={styles.startBtn} onPress={handleStart}>
            <Ionicons name="play" size={14} color="#0b6f65" />
            <Text style={styles.startBtnText}>Start Focus</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.runningTopRow}>
            <View style={styles.runningLeft}>
              <Ionicons name="flame-outline" size={16} color="#dcfffa" />
              <Text style={styles.timerText}>
                {formatTime(remainingSeconds)}
              </Text>
              <Text style={styles.sessionLabel}>
                {durationMinutes} min
              </Text>
            </View>
            <View style={styles.statusPill}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      timerState === "running" ? "#6fffdb" : "#ffd97a",
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {timerState === "running" ? "Focusing" : "Paused"}
              </Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
            />
          </View>
          <View style={styles.controlsRow}>
            {timerState === "running" ? (
              <Pressable style={styles.controlBtn} onPress={handlePause}>
                <Ionicons name="pause" size={14} color="#fff" />
                <Text style={styles.controlBtnText}>Pause</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.controlBtn} onPress={handleResume}>
                <Ionicons name="play" size={14} color="#fff" />
                <Text style={styles.controlBtnText}>Resume</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.controlBtn, styles.resetBtn]}
              onPress={handleReset}
            >
              <Ionicons name="refresh" size={14} color="#dcfffa" />
              <Text style={[styles.controlBtnText, styles.resetBtnText]}>
                Reset
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: "#0b6f65",
    padding: 12,
    marginBottom: 12,
  },

  /* ── idle state: single row ── */
  idleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  durationText: {
    color: "#ecfffc",
    fontSize: 22,
    fontWeight: "300",
    fontFamily: "serif",
    minWidth: 56,
    textAlign: "center",
  },
  durationUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b3ece5",
  },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dcfffa",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: "auto",
  },
  startBtnText: {
    color: "#0b6f65",
    fontSize: 13,
    fontWeight: "800",
  },

  /* ── running / paused state ── */
  runningTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  runningLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerText: {
    color: "#ecfffc",
    fontSize: 26,
    fontWeight: "200",
    fontFamily: "serif",
    letterSpacing: 1,
  },
  sessionLabel: {
    color: "#b3ece5",
    fontSize: 11,
    fontWeight: "600",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    color: "#dcfffa",
    fontSize: 10,
    fontWeight: "700",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6fffdb",
    borderRadius: 999,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 8,
  },
  controlBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingVertical: 7,
  },
  controlBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  resetBtn: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  resetBtnText: {
    color: "#dcfffa",
  },
});
