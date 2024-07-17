import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  FilterStoreType,
  KeywordStoreType,
  StudyListRequestType,
  StudyListStoreType,
  StudyStoreType,
} from "../types/study-channel-type";

const useStudyStore = create<StudyStoreType>((set) => ({
  title: "",
  description: "",
  category: "",
  startDate: "",
  endDate: "",
  maxParticipants: 3,
  meetingType: "OFFLINE",
  location: "",
  link: "",
  fee: 0,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  resetForm: () =>
    set({
      title: "",
      description: "",
      category: "",
      startDate: "",
      endDate: "",
      maxParticipants: 3,
      meetingType: "OFFLINE",
      location: "",
      link: "",
      fee: 0,
    }),
}));

const useStudyListStore = create<StudyListStoreType>((set) => ({
  studyList: [],
  setStudyList: (studyList) => set({ studyList: [...studyList] }),
}));

const initialFilter: StudyListRequestType = {
  type: null,
  category: null,
  status: null,
  order: "RECENT",
  page: 1,
};

const useFilterStore = create(
  persist<FilterStoreType>(
    (set) => ({
      filter: initialFilter,
      setFilter: (filter) => set(() => ({ filter: filter })),
    }),
    {
      name: "filterStorage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

const useKeywordStore = create<KeywordStoreType>((set) => ({
  keywordValue: null,
  setKeywordValue: (keyword) => set({ keywordValue: keyword }),
}));

export { useStudyStore, useStudyListStore, initialFilter, useFilterStore, useKeywordStore };
