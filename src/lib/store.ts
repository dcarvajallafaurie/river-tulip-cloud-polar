import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Activity, Course, Semester, Settings } from "./types";
import { uid } from "./utils";
import { SEED_ACTIVITIES, SEED_COURSES, SEED_SEMESTER } from "./seed";
import { inferCorteIndex } from "./academic";

export interface AcademicState {
  hydrated: boolean;
  newCourseOpen: boolean;
  userCleared: boolean;
  settings: Settings;
  semesters: Semester[];
  courses: Course[];
  activities: Activity[];
  setHydrated: (v: boolean) => void;
  setNewCourseOpen: (v: boolean) => void;
  ensureSeed: () => void;
  resetToSeed: () => void;
  clearAll: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addSemester: (s: Omit<Semester, "id"> & { id?: string }) => string;
  updateSemester: (id: string, patch: Partial<Semester>) => void;
  deleteSemester: (id: string) => void;
  setActiveSemester: (id: string) => void;
  addCourse: (c: Omit<Course, "id"> & { id?: string }) => string;
  updateCourse: (id: string, patch: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addActivity: (a: Omit<Activity, "id" | "createdAt" | "done"> & { id?: string; done?: boolean }) => string;
  updateActivity: (id: string, patch: Partial<Activity>) => void;
  toggleActivity: (id: string) => void;
  deleteActivity: (id: string) => void;
}

const defaultSettings: Settings = {
  gradeMax: 5,
  passingGrade: 3,
  studentName: "",
  university: "",
};

const emptyState = {
  userCleared: false,
  settings: defaultSettings,
  semesters: [] as Semester[],
  courses: [] as Course[],
  activities: [] as Activity[],
};

function seedPayload() {
  return {
    userCleared: false,
    settings: defaultSettings,
    semesters: [structuredClone(SEED_SEMESTER)],
    courses: structuredClone(SEED_COURSES),
    activities: structuredClone(SEED_ACTIVITIES),
  };
}

export const useAcademicStore = create<AcademicState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      newCourseOpen: false,
      ...emptyState,
      setHydrated: (v) => set({ hydrated: v }),
      setNewCourseOpen: (v) => set({ newCourseOpen: v }),
      ensureSeed: () => {
        const s = get();
        if (s.userCleared) return;
        if (s.semesters.length === 0 && s.courses.length === 0) {
          set(seedPayload());
        }
      },
      resetToSeed: () => set(seedPayload()),
      clearAll: () => set({ ...emptyState, userCleared: true }),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      addSemester: (raw) => {
        const id = raw.id ?? uid();
        const semester: Semester = {
          ...raw,
          id,
          isActive: raw.isActive ?? get().semesters.length === 0,
        };
        set((s) => ({
          semesters: semester.isActive
            ? [...s.semesters.map((x) => ({ ...x, isActive: false })), semester]
            : [...s.semesters, semester],
        }));
        return id;
      },
      updateSemester: (id, patch) =>
        set((s) => ({
          semesters: s.semesters.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      deleteSemester: (id) =>
        set((s) => ({
          semesters: s.semesters.filter((x) => x.id !== id),
          courses: s.courses.filter((c) => c.semesterId !== id),
          activities: s.activities.filter((a) => {
            const course = s.courses.find((c) => c.id === a.courseId);
            return course?.semesterId !== id;
          }),
        })),
      setActiveSemester: (id) =>
        set((s) => ({
          semesters: s.semesters.map((x) => ({ ...x, isActive: x.id === id })),
        })),
      addCourse: (raw) => {
        const id = raw.id ?? uid();
        const course: Course = { ...raw, id };
        set((s) => ({ courses: [...s.courses, course] }));
        return id;
      },
      updateCourse: (id, patch) =>
        set((s) => ({
          courses: s.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCourse: (id) =>
        set((s) => ({
          courses: s.courses.filter((c) => c.id !== id),
          activities: s.activities.filter((a) => a.courseId !== id),
        })),
      addActivity: (raw) => {
        const id = raw.id ?? uid();
        const semester = get().semesters.find((x) => x.isActive);
        const corteIndex =
          raw.corteIndex ?? inferCorteIndex(raw.dueDate, semester);
        const activity: Activity = {
          done: false,
          ...raw,
          id,
          corteIndex,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ activities: [...s.activities, activity] }));
        return id;
      },
      updateActivity: (id, patch) =>
        set((s) => ({
          activities: s.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),
      toggleActivity: (id) =>
        set((s) => ({
          activities: s.activities.map((a) =>
            a.id === id ? { ...a, done: !a.done } : a,
          ),
        })),
      deleteActivity: (id) =>
        set((s) => ({ activities: s.activities.filter((a) => a.id !== id) })),
    }),
    {
      name: "aula-academic-v1",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (s) => ({
        userCleared: s.userCleared,
        settings: s.settings,
        semesters: s.semesters,
        courses: s.courses,
        activities: s.activities,
      }),
    },
  ),
);

export function useActiveSemester(): Semester | undefined {
  const semesters = useAcademicStore((s) => s.semesters);
  return useMemo(
    () => semesters.find((x) => x.isActive) ?? semesters[0],
    [semesters],
  );
}

export function useSemesterCourses(semesterId: string | undefined): Course[] {
  const courses = useAcademicStore((s) => s.courses);
  return useMemo(
    () => (semesterId ? courses.filter((c) => c.semesterId === semesterId) : courses),
    [courses, semesterId],
  );
}
