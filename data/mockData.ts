export const avatarSources: Record<string, number> = {
  "1": require("../assets/avatars/1.png"),
  "2": require("../assets/avatars/2.png"),
  "3": require("../assets/avatars/3.png"),
  "4": require("../assets/avatars/4.png"),
  "5": require("../assets/avatars/5.png"),
  "6": require("../assets/avatars/6.png"),
  "7": require("../assets/avatars/7.png"),
  "8": require("../assets/avatars/8.png"),
  "9": require("../assets/avatars/9.png"),
  "10": require("../assets/avatars/10.png"),
};

export const avatarIds = Object.keys(avatarSources);

export type RoomSummaryStats = {
  activeMembers: number;
  focusMinutesToday: number;
  sessionsCompleted: number;
  distractions: number;
};

export const mockRooms = [
  {
    id: "ubc-cs",
    name: "UBC CS",
    description:
      "An active room for UBC computer science students to run focused study blocks and keep each other accountable during term.",
    created: "51d ago",
    capacity: "4/8",
    mode: "Public",
    streak: "12 day streak",
    tags: ["University", "Focus", "Exams"],
    summary: {
      activeMembers: 4,
      focusMinutesToday: 36,
      sessionsCompleted: 2,
      distractions: 1,
    },
    members: [
      {
        id: "ubc-u1",
        name: "Sarah",
        avatar: "1",
        status: "focusing",
        focusMinutes: 12,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "17:24",
      },
      {
        id: "ubc-u2",
        name: "Alex",
        avatar: "4",
        status: "break",
        focusMinutes: 8,
        sessionsDone: 0,
        distractions: 1,
        streakDays: 1,
        currentTimer: "Break 02:10",
      },
      {
        id: "ubc-u3",
        name: "Mina",
        avatar: "7",
        status: "distracted",
        focusMinutes: 5,
        sessionsDone: 0,
        distractions: 0,
        streakDays: 1,
        currentTimer: "Idle",
      },
      {
        id: "ubc-u4",
        name: "Jay",
        avatar: "10",
        status: "focusing",
        focusMinutes: 11,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "09:42",
      },
    ],
  },
  {
    id: "locked-in-2026",
    name: "locked in 2026",
    description: "we are Locked in bro",
    created: "7d ago",
    capacity: "6/10",
    mode: "Invite Only",
    streak: "7 day streak",
    tags: ["Competitive", "Study", "Accountability"],
    summary: {
      activeMembers: 6,
      focusMinutesToday: 56,
      sessionsCompleted: 4,
      distractions: 1,
    },
    members: [
      {
        id: "lock-u1",
        name: "Claire",
        avatar: "2",
        status: "focusing",
        focusMinutes: 14,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "12:08",
      },
      {
        id: "lock-u2",
        name: "Nina",
        avatar: "5",
        status: "focusing",
        focusMinutes: 9,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "06:45",
      },
      {
        id: "lock-u3",
        name: "Omar",
        avatar: "8",
        status: "distracted",
        focusMinutes: 3,
        sessionsDone: 0,
        distractions: 1,
        streakDays: 0,
        currentTimer: "Idle",
      },
      {
        id: "lock-u4",
        name: "Eli",
        avatar: "3",
        status: "break",
        focusMinutes: 7,
        sessionsDone: 0,
        distractions: 0,
        streakDays: 1,
        currentTimer: "Break 00:50",
      },
      {
        id: "lock-u5",
        name: "Maya",
        avatar: "6",
        status: "focusing",
        focusMinutes: 10,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "11:20",
      },
      {
        id: "lock-u6",
        name: "Adam",
        avatar: "9",
        status: "focusing",
        focusMinutes: 13,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "10:15",
      },
    ],
  },
  {
    id: "night-owls",
    name: "Night Owls",
    description:
      "quiet focus room primarily running in the late evening and nighttime hours.",
    created: "42m ago",
    capacity: "3/6",
    mode: "Public",
    streak: "1 day streak",
    tags: ["Night", "Silent"],
    summary: {
      activeMembers: 3,
      focusMinutesToday: 27,
      sessionsCompleted: 1,
      distractions: 1,
    },
    members: [
      {
        id: "night-u1",
        name: "Ari",
        avatar: "3",
        status: "focusing",
        focusMinutes: 15,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "20:33",
      },
      {
        id: "night-u2",
        name: "Luca",
        avatar: "6",
        status: "break",
        focusMinutes: 8,
        sessionsDone: 0,
        distractions: 0,
        streakDays: 0,
        currentTimer: "Break 01:05",
      },
      {
        id: "night-u3",
        name: "Lena",
        avatar: "9",
        status: "distracted",
        focusMinutes: 4,
        sessionsDone: 0,
        distractions: 1,
        streakDays: 0,
        currentTimer: "Idle",
      },
    ],
  },
  {
    id: "biology-study",
    name: "Biology Study Group",
    description:
      "For biology students prepping labs, quizzes, and exams together. Anyone is welcome!",
    created: "42m ago",
    capacity: "3/6",
    mode: "Public",
    streak: "1 day streak",
    tags: ["University", "Study", "Biology"],
    summary: {
      activeMembers: 3,
      focusMinutesToday: 26,
      sessionsCompleted: 2,
      distractions: 1,
    },
    members: [
      {
        id: "bio-u1",
        name: "Tessa",
        avatar: "1",
        status: "focusing",
        focusMinutes: 11,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "15:11",
      },
      {
        id: "bio-u2",
        name: "Marco",
        avatar: "4",
        status: "break",
        focusMinutes: 6,
        sessionsDone: 0,
        distractions: 1,
        streakDays: 0,
        currentTimer: "Break 03:20",
      },
      {
        id: "bio-u3",
        name: "Zoe",
        avatar: "7",
        status: "focusing",
        focusMinutes: 9,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "08:29",
      },
    ],
  },
  {
    id: "writers-room",
    name: "Writers Room :)",
    description:
      "A supportive writing space for aspiring writers: share essays, stories, and notes, run focused writing sprints, and keep each other accountable in a chill and encouraging environment.",
    created: "12d ago",
    capacity: "2/5",
    mode: "Invite Only",
    streak: "4 day streak",
    tags: ["Writing", "Focus", "Creative"],
    summary: {
      activeMembers: 2,
      focusMinutesToday: 18,
      sessionsCompleted: 1,
      distractions: 0,
    },
    members: [
      {
        id: "write-u1",
        name: "Noah",
        avatar: "10",
        status: "focusing",
        focusMinutes: 13,
        sessionsDone: 1,
        distractions: 0,
        streakDays: 1,
        currentTimer: "10:02",
      },
      {
        id: "write-u2",
        name: "Ivy",
        avatar: "5",
        status: "break",
        focusMinutes: 5,
        sessionsDone: 0,
        distractions: 0,
        streakDays: 0,
        currentTimer: "Break 01:44",
      },
    ],
  },
] as const;

export type RoomId = (typeof mockRooms)[number]["id"];

export type MoodType = "happy" | "ok" | "sad";

export const weeklyStats: Array<{
  day: string;
  height: number;
  mood: MoodType;
  color: string;
}> = [
  { day: "Sun", height: 126, mood: "happy", color: "#c8f5ee" },
  { day: "Mon", height: 86, mood: "ok", color: "#e0f8f4" },
  { day: "Tue", height: 108, mood: "ok", color: "#d4f3ec" },
  { day: "Wed", height: 78, mood: "sad", color: "#ebfcf9" },
  { day: "Thu", height: 132, mood: "happy", color: "#c8f5ee" },
  { day: "Fri", height: 110, mood: "ok", color: "#d4f3ec" },
  { day: "Sat", height: 150, mood: "happy", color: "#c2f2ea" },
];

export const profileTodayStats = {
  status: "Focusing",
  focusMinutes: 124,
  sessionsDone: 4,
  distractions: 3,
  streakDays: 9,
  goalMinutes: 180,
  activeSessionTimer: "14:36",
};

export const profileBioText =
  "4th year UBC student studying Computer Science. Open to join any rooms, feel free to invite me!";

export type UserStatus = "focusing" | "distracted" | "break";

export const defaultTimerMinutes = 25;
export const timerMinStep = 5;
export const timerMinValue = 5;
export const timerMaxValue = 120;
