import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    defaultTimerMinutes,
    mockRooms,
    profileTodayStats,
    timerMaxValue,
    timerMinStep,
    timerMinValue,
} from "../../data/mockData";

type TimerState = "idle" | "running" | "paused";
type UserStatusText = "Focusing" | "Paused" | "Idle";
type MemberStatus = "focusing" | "distracted" | "break";

type RuntimeMember = {
  id: string;
  name: string;
  avatar: string;
  status: MemberStatus;
  focusMinutes: number;
  sessionsDone: number;
  distractions: number;
  streakDays: number;
  currentTimer: string;
};

type ViewerStats = {
  status: UserStatusText;
  focusMinutes: number;
  sessionsDone: number;
  distractions: number;
  streakDays: number;
  goalMinutes: number;
  activeSessionTimer: string;
};

type RoomRuntimeSummary = {
  activeMembers: number;
  focusMinutesToday: number;
  sessionsCompleted: number;
  distractions: number;
};

type BannerEvent = {
  id: number;
  message: string;
  roomId?: string;
};

type MemberBehaviorProfile = {
  focusRange: [number, number];
  breakRange: [number, number];
  distractionPerMinute: number;
  startDelayRange: [number, number];
};

type SessionStoreValue = {
  viewerStats: ViewerStats;
  timerState: TimerState;
  durationMinutes: number;
  remainingSeconds: number;
  currentRoomId: string;
  setCurrentRoomId: (roomId?: string) => void;
  getMembersForRoom: (roomId?: string) => RuntimeMember[];
  getRoomSummary: (roomId?: string) => RoomRuntimeSummary;
  bannerEvent: BannerEvent | null;
  clearBannerEvent: () => void;
  decrementDuration: () => void;
  incrementDuration: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
};

const SessionStoreContext = createContext<SessionStoreValue | null>(null);

function formatTimer(totalSeconds: number) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseTimerSeconds(value: string) {
  const breakMatch = /^Break\s+(\d{1,2}):(\d{2})$/.exec(value);
  if (breakMatch) {
    const mins = Number(breakMatch[1]);
    const secs = Number(breakMatch[2]);
    return { kind: "break" as const, seconds: mins * 60 + secs };
  }

  const focusMatch = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (focusMatch) {
    const mins = Number(focusMatch[1]);
    const secs = Number(focusMatch[2]);
    return { kind: "focus" as const, seconds: mins * 60 + secs };
  }

  return null;
}

function createBehaviorProfile(): MemberBehaviorProfile {
  const profiles: MemberBehaviorProfile[] = [
    {
      focusRange: [8 * 60, 18 * 60],
      breakRange: [45, 3 * 60],
      distractionPerMinute: 0.03,
      startDelayRange: [5, 45],
    },
    {
      focusRange: [6 * 60, 13 * 60],
      breakRange: [50, 4 * 60],
      distractionPerMinute: 0.06,
      startDelayRange: [10, 65],
    },
    {
      focusRange: [4 * 60, 10 * 60],
      breakRange: [40, 2 * 60],
      distractionPerMinute: 0.11,
      startDelayRange: [20, 90],
    },
  ];

  return profiles[randomInt(0, profiles.length - 1)];
}

function createInitialViewerStats(): ViewerStats {
  return {
    ...profileTodayStats,
    status: "Idle",
    focusMinutes: 0,
    sessionsDone: 0,
    distractions: 0,
    streakDays: 0,
    activeSessionTimer: formatTimer(defaultTimerMinutes * 60),
  };
}

type SessionProviderProps = {
  children: React.ReactNode;
};

export function SessionProvider({ children }: SessionProviderProps) {
  const [viewerStats, setViewerStats] = useState<ViewerStats>(() =>
    createInitialViewerStats(),
  );
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [durationMinutes, setDurationMinutes] = useState(defaultTimerMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(
    defaultTimerMinutes * 60,
  );
  const [currentRoomId, setCurrentRoomIdState] = useState<string>(
    mockRooms[0].id,
  );
  const [bannerEvent, setBannerEvent] = useState<BannerEvent | null>(null);

  const focusTickAccumulatorRef = useRef(0);
  const memberProfilesRef = useRef<
    Record<string, Record<string, MemberBehaviorProfile>>
  >({});
  const memberStartDelayRef = useRef<Record<string, Record<string, number>>>(
    {},
  );
  const memberFocusTickAccumulatorRef = useRef<
    Record<string, Record<string, number>>
  >({});
  const bannerEventIdRef = useRef(0);
  const bannerCooldownUntilRef = useRef(0);
  const viewerOneMinuteWarnedRef = useRef(false);
  const viewerMinuteWarningsRef = useRef({
    fifteen: false,
    ten: false,
    five: false,
  });
  const viewerMinuteWarningEligibilityRef = useRef({
    fifteen: false,
    ten: false,
    five: false,
  });
  const currentRoomIdRef = useRef(mockRooms[0].id);
  const [runtimeMembersByRoom, setRuntimeMembersByRoom] = useState<
    Record<string, RuntimeMember[]>
  >(() => {
    const initialMap: Record<string, RuntimeMember[]> = {};
    mockRooms.forEach((room) => {
      memberProfilesRef.current[room.id] = {};
      memberStartDelayRef.current[room.id] = {};
      memberFocusTickAccumulatorRef.current[room.id] = {};

      initialMap[room.id] = room.members.map((member) => {
        const profile = createBehaviorProfile();
        memberProfilesRef.current[room.id][member.id] = profile;
        memberFocusTickAccumulatorRef.current[room.id][member.id] = 0;

        const startDelay = randomInt(
          profile.startDelayRange[0],
          profile.startDelayRange[1],
        );
        memberStartDelayRef.current[room.id][member.id] = startDelay;

        const startRoll = Math.random();
        if (startRoll < 0.58) {
          return {
            ...member,
            status: "distracted",
            currentTimer: "Idle",
          };
        }

        if (startRoll < 0.8) {
          return {
            ...member,
            status: "break",
            currentTimer: `Break ${formatTimer(randomInt(35, 4 * 60))}`,
          };
        }

        return {
          ...member,
          status: "focusing",
          currentTimer: formatTimer(
            randomInt(profile.focusRange[0], profile.focusRange[1]),
          ),
        };
      });
    });
    return initialMap;
  });

  const emitBannerEvent = (message: string, roomId?: string) => {
    if (roomId && roomId !== currentRoomIdRef.current) return;

    const now = Date.now();
    if (now < bannerCooldownUntilRef.current) return;
    bannerCooldownUntilRef.current = now + 5000;

    bannerEventIdRef.current += 1;
    setBannerEvent({ id: bannerEventIdRef.current, message, roomId });
  };

  const setCurrentRoomId = (roomId?: string) => {
    if (!roomId) return;
    const roomExists = mockRooms.some((room) => room.id === roomId);
    if (!roomExists) return;
    setCurrentRoomIdState(roomId);
  };

  useEffect(() => {
    currentRoomIdRef.current = currentRoomId;
  }, [currentRoomId]);

  const getMembersForRoom = (roomId?: string) => {
    const resolvedRoomId =
      roomId && runtimeMembersByRoom[roomId] ? roomId : currentRoomId;
    return runtimeMembersByRoom[resolvedRoomId] ?? [];
  };

  const getRoomSummary = (roomId?: string): RoomRuntimeSummary => {
    const resolvedRoomId =
      roomId && runtimeMembersByRoom[roomId] ? roomId : currentRoomId;
    const members = runtimeMembersByRoom[resolvedRoomId] ?? [];
    const includeViewer = resolvedRoomId === currentRoomId;

    const totals = members.reduce(
      (acc, member) => {
        acc.focusMinutesToday += member.focusMinutes;
        acc.sessionsCompleted += member.sessionsDone;
        acc.distractions += member.distractions;
        return acc;
      },
      {
        activeMembers: members.length,
        focusMinutesToday: 0,
        sessionsCompleted: 0,
        distractions: 0,
      },
    );

    if (includeViewer) {
      totals.activeMembers += 1;
      totals.focusMinutesToday += viewerStats.focusMinutes;
      totals.sessionsCompleted += viewerStats.sessionsDone;
      totals.distractions += viewerStats.distractions;
    }

    return totals;
  };

  const clearBannerEvent = () => {
    setBannerEvent(null);
    bannerCooldownUntilRef.current = Date.now() + 1000;
  };

  const decrementDuration = () => {
    if (timerState !== "idle") return;
    setDurationMinutes((prev) => {
      const next = Math.max(timerMinValue, prev - timerMinStep);
      setRemainingSeconds(next * 60);
      setViewerStats((current) => ({
        ...current,
        activeSessionTimer: formatTimer(next * 60),
      }));
      return next;
    });
  };

  const incrementDuration = () => {
    if (timerState !== "idle") return;
    setDurationMinutes((prev) => {
      const next = Math.min(timerMaxValue, prev + timerMinStep);
      setRemainingSeconds(next * 60);
      setViewerStats((current) => ({
        ...current,
        activeSessionTimer: formatTimer(next * 60),
      }));
      return next;
    });
  };

  const startTimer = () => {
    const totalSeconds = durationMinutes * 60;
    focusTickAccumulatorRef.current = 0;
    viewerOneMinuteWarnedRef.current = false;
    viewerMinuteWarningsRef.current = {
      fifteen: false,
      ten: false,
      five: false,
    };
    viewerMinuteWarningEligibilityRef.current = {
      fifteen: totalSeconds > 15 * 60,
      ten: totalSeconds > 10 * 60,
      five: totalSeconds > 5 * 60,
    };
    setRemainingSeconds(totalSeconds);
    setTimerState("running");
    setViewerStats((current) => ({
      ...current,
      status: "Focusing",
      activeSessionTimer: formatTimer(totalSeconds),
    }));
  };

  const pauseTimer = () => {
    if (timerState !== "running") return;
    setTimerState("paused");
    setViewerStats((current) => ({ ...current, status: "Paused" }));
  };

  const resumeTimer = () => {
    if (timerState !== "paused") return;
    setTimerState("running");
    setViewerStats((current) => ({ ...current, status: "Focusing" }));
  };

  const resetTimer = () => {
    setTimerState("idle");
    focusTickAccumulatorRef.current = 0;
    viewerOneMinuteWarnedRef.current = false;
    viewerMinuteWarningsRef.current = {
      fifteen: false,
      ten: false,
      five: false,
    };
    viewerMinuteWarningEligibilityRef.current = {
      fifteen: false,
      ten: false,
      five: false,
    };
    const totalSeconds = durationMinutes * 60;
    setRemainingSeconds(totalSeconds);
    setViewerStats((current) => ({
      ...current,
      status: "Idle",
      activeSessionTimer: formatTimer(totalSeconds),
    }));
  };

  useEffect(() => {
    if (timerState !== "running") return;

    const tick = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = Math.max(0, prev - 1);

        setViewerStats((current) => ({
          ...current,
          activeSessionTimer: formatTimer(next),
        }));

        focusTickAccumulatorRef.current += 1;
        if (focusTickAccumulatorRef.current >= 60) {
          const minuteGain = Math.floor(focusTickAccumulatorRef.current / 60);
          focusTickAccumulatorRef.current =
            focusTickAccumulatorRef.current % 60;
          setViewerStats((current) => ({
            ...current,
            focusMinutes: current.focusMinutes + minuteGain,
          }));
        }

        if (next === 60 && !viewerOneMinuteWarnedRef.current) {
          viewerOneMinuteWarnedRef.current = true;
          emitBannerEvent(
            "1 minute left in your focus session",
            currentRoomIdRef.current,
          );
        }

        if (
          next === 15 * 60 &&
          viewerMinuteWarningEligibilityRef.current.fifteen &&
          !viewerMinuteWarningsRef.current.fifteen
        ) {
          viewerMinuteWarningsRef.current.fifteen = true;
          emitBannerEvent(
            "15 minutes left in your focus session",
            currentRoomIdRef.current,
          );
        }

        if (
          next === 10 * 60 &&
          viewerMinuteWarningEligibilityRef.current.ten &&
          !viewerMinuteWarningsRef.current.ten
        ) {
          viewerMinuteWarningsRef.current.ten = true;
          emitBannerEvent(
            "10 minutes left in your focus session",
            currentRoomIdRef.current,
          );
        }

        if (
          next === 5 * 60 &&
          viewerMinuteWarningEligibilityRef.current.five &&
          !viewerMinuteWarningsRef.current.five
        ) {
          viewerMinuteWarningsRef.current.five = true;
          emitBannerEvent(
            "5 minutes left in your focus session",
            currentRoomIdRef.current,
          );
        }

        if (next <= 0) {
          setTimerState("idle");
          focusTickAccumulatorRef.current = 0;
          viewerMinuteWarningsRef.current = {
            fifteen: false,
            ten: false,
            five: false,
          };
          viewerMinuteWarningEligibilityRef.current = {
            fifteen: false,
            ten: false,
            five: false,
          };
          setViewerStats((current) => ({
            ...current,
            status: "Idle",
            sessionsDone: current.sessionsDone + 1,
            activeSessionTimer: formatTimer(durationMinutes * 60),
          }));
          emitBannerEvent(
            "Nice work. Session complete.",
            currentRoomIdRef.current,
          );
          return durationMinutes * 60;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [durationMinutes, timerState]);

  useEffect(() => {
    const tick = setInterval(() => {
      setRuntimeMembersByRoom((current) => {
        let hasAnyChange = false;
        const nextState: Record<string, RuntimeMember[]> = {};

        Object.entries(current).forEach(([roomId, members]) => {
          let roomChanged = false;
          const roomProfiles = memberProfilesRef.current[roomId] ?? {};
          const roomDelays = memberStartDelayRef.current[roomId] ?? {};
          const roomFocusTicks =
            memberFocusTickAccumulatorRef.current[roomId] ?? {};

          const updatedMembers = members.map((member): RuntimeMember => {
            const profile = roomProfiles[member.id] ?? createBehaviorProfile();
            roomProfiles[member.id] = profile;

            if (member.currentTimer === "Idle") {
              const waitSeconds = roomDelays[member.id] ?? 0;
              if (waitSeconds > 0) {
                roomDelays[member.id] = waitSeconds - 1;
                return member;
              }

              const restartRoll = Math.random();
              if (restartRoll < 0.42) {
                hasAnyChange = true;
                roomChanged = true;
                roomFocusTicks[member.id] = 0;
                emitBannerEvent(`${member.name} is back to focusing`, roomId);
                return {
                  ...member,
                  status: "focusing",
                  currentTimer: formatTimer(
                    randomInt(profile.focusRange[0], profile.focusRange[1]),
                  ),
                };
              }

              if (restartRoll < 0.7) {
                hasAnyChange = true;
                roomChanged = true;
                emitBannerEvent(
                  `${member.name} is taking a short break`,
                  roomId,
                );
                return {
                  ...member,
                  status: "break",
                  currentTimer: `Break ${formatTimer(
                    randomInt(profile.breakRange[0], profile.breakRange[1]),
                  )}`,
                };
              }

              roomDelays[member.id] = randomInt(20, 100);
              return member;
            }

            const parsedTimer = parseTimerSeconds(member.currentTimer);
            if (!parsedTimer || parsedTimer.seconds <= 0) {
              return member;
            }

            const nextSeconds = parsedTimer.seconds - 1;
            hasAnyChange = true;
            roomChanged = true;

            if (parsedTimer.kind === "focus") {
              if (
                nextSeconds > 8 &&
                Math.random() < profile.distractionPerMinute / 60
              ) {
                hasAnyChange = true;
                roomChanged = true;
                roomDelays[member.id] = randomInt(15, 50);
                roomFocusTicks[member.id] = 0;
                emitBannerEvent(`${member.name} got distracted`, roomId);
                return {
                  ...member,
                  status: "distracted",
                  distractions: member.distractions + 1,
                  currentTimer: "Idle",
                };
              }

              roomFocusTicks[member.id] = (roomFocusTicks[member.id] ?? 0) + 1;
              let focusGain = 0;
              if (roomFocusTicks[member.id] >= 60) {
                focusGain = Math.floor(roomFocusTicks[member.id] / 60);
                roomFocusTicks[member.id] = roomFocusTicks[member.id] % 60;
              }

              if (nextSeconds <= 0) {
                emitBannerEvent(`${member.name} started a break`, roomId);
                return {
                  ...member,
                  status: "break",
                  sessionsDone: member.sessionsDone + 1,
                  focusMinutes: member.focusMinutes + focusGain,
                  currentTimer: `Break ${formatTimer(
                    randomInt(profile.breakRange[0], profile.breakRange[1]),
                  )}`,
                };
              }

              return {
                ...member,
                status:
                  member.status === "distracted" ? "focusing" : member.status,
                focusMinutes: member.focusMinutes + focusGain,
                currentTimer: formatTimer(nextSeconds),
              };
            }

            if (nextSeconds <= 0) {
              roomFocusTicks[member.id] = 0;
              emitBannerEvent(`${member.name} is back to focusing`, roomId);
              return {
                ...member,
                status: "focusing",
                currentTimer: formatTimer(
                  randomInt(profile.focusRange[0], profile.focusRange[1]),
                ),
              };
            }

            return {
              ...member,
              currentTimer: `Break ${formatTimer(nextSeconds)}`,
            };
          });

          nextState[roomId] = roomChanged ? updatedMembers : members;
        });

        return hasAnyChange ? nextState : current;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, []);

  const value: SessionStoreValue = {
    viewerStats,
    timerState,
    durationMinutes,
    remainingSeconds,
    currentRoomId,
    setCurrentRoomId,
    getMembersForRoom,
    getRoomSummary,
    bannerEvent,
    clearBannerEvent,
    decrementDuration,
    incrementDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  };

  return (
    <SessionStoreContext.Provider value={value}>
      {children}
    </SessionStoreContext.Provider>
  );
}

export function useSessionStore() {
  const context = useContext(SessionStoreContext);
  if (!context) {
    throw new Error("useSessionStore must be used within SessionProvider");
  }
  return context;
}
