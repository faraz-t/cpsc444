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

type SessionStoreValue = {
  viewerStats: ViewerStats;
  timerState: TimerState;
  durationMinutes: number;
  remainingSeconds: number;
  currentRoomId: string;
  setCurrentRoomId: (roomId?: string) => void;
  getMembersForRoom: (roomId?: string) => RuntimeMember[];
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

function cloneRoomMembers(roomId: string): RuntimeMember[] {
  const room = mockRooms.find((entry) => entry.id === roomId) ?? mockRooms[0];
  return room.members.map((member) => ({ ...member }));
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
  const [runtimeMembersByRoom, setRuntimeMembersByRoom] = useState<
    Record<string, RuntimeMember[]>
  >(() => {
    const initialMap: Record<string, RuntimeMember[]> = {};
    mockRooms.forEach((room) => {
      initialMap[room.id] = cloneRoomMembers(room.id);
    });
    return initialMap;
  });

  const focusTickAccumulatorRef = useRef(0);

  const setCurrentRoomId = (roomId?: string) => {
    if (!roomId) return;
    const roomExists = mockRooms.some((room) => room.id === roomId);
    if (!roomExists) return;
    setCurrentRoomIdState(roomId);
  };

  const getMembersForRoom = (roomId?: string) => {
    const resolvedRoomId =
      roomId && runtimeMembersByRoom[roomId] ? roomId : currentRoomId;
    return runtimeMembersByRoom[resolvedRoomId] ?? [];
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

        if (next <= 0) {
          setTimerState("idle");
          focusTickAccumulatorRef.current = 0;
          setViewerStats((current) => ({
            ...current,
            status: "Idle",
            sessionsDone: current.sessionsDone + 1,
            activeSessionTimer: formatTimer(durationMinutes * 60),
          }));
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

          const updatedMembers = members.map((member): RuntimeMember => {
            const parsedTimer = parseTimerSeconds(member.currentTimer);
            if (!parsedTimer || parsedTimer.seconds <= 0) {
              return member;
            }

            const nextSeconds = parsedTimer.seconds - 1;
            hasAnyChange = true;
            roomChanged = true;

            if (parsedTimer.kind === "focus") {
              if (nextSeconds <= 0) {
                return {
                  ...member,
                  status: "break",
                  sessionsDone: member.sessionsDone + 1,
                  currentTimer: `Break ${formatTimer(randomInt(45, 3 * 60))}`,
                };
              }

              return {
                ...member,
                status:
                  member.status === "distracted" ? "focusing" : member.status,
                currentTimer: formatTimer(nextSeconds),
              };
            }

            if (nextSeconds <= 0) {
              return {
                ...member,
                status: "focusing",
                currentTimer: formatTimer(randomInt(8 * 60, 22 * 60)),
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

  useEffect(() => {
    const intervals: ReturnType<typeof setInterval>[] = [];

    const scheduleMemberUpdate = (roomId: string) => {
      const delaySeconds = randomInt(30, 90);
      const interval = setInterval(() => {
        setRuntimeMembersByRoom((current) => {
          const roomMembers = current[roomId];
          if (!roomMembers || roomMembers.length === 0) return current;

          const memberIndex = randomInt(0, roomMembers.length - 1);
          const actionRoll = Math.random();

          const nextMembers = roomMembers.map(
            (member, index): RuntimeMember => {
              if (index !== memberIndex) {
                return member;
              }

              if (actionRoll < 0.62) {
                return {
                  ...member,
                  status: "focusing",
                  focusMinutes: member.focusMinutes + randomInt(1, 2),
                  currentTimer: formatTimer(randomInt(60, 20 * 60)),
                };
              }

              if (actionRoll < 0.84) {
                return {
                  ...member,
                  status: "break",
                  currentTimer: `Break ${formatTimer(randomInt(20, 5 * 60))}`,
                };
              }

              const newDistractions = member.distractions + 1;
              return {
                ...member,
                status: "distracted",
                distractions: newDistractions,
                currentTimer: "Idle",
              };
            },
          );

          return {
            ...current,
            [roomId]: nextMembers,
          };
        });
      }, delaySeconds * 1000);

      intervals.push(interval);
    };

    mockRooms.forEach((room) => scheduleMemberUpdate(room.id));

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const value: SessionStoreValue = {
    viewerStats,
    timerState,
    durationMinutes,
    remainingSeconds,
    currentRoomId,
    setCurrentRoomId,
    getMembersForRoom,
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
