// 추후 useQuery들 재사용 가능하도록 훅으로 분리 예정
import { useQuery } from "@tanstack/react-query";
import {
  AttendanceResponseType,
  MemberListResponseType,
  RecruitmentInfoType,
  StudyInfoType,
} from "../types/study-channel-type";
import { getAttendance, getMemberList, getRecruitment, getStudyInfo } from "../services/channel-api";
import { getApplicationList, getProfile } from "@/services/profile-api";
import { UserInfoType } from "@/types/profile-type";

export const useUserInfo = () => {
  const { data, isLoading, error } = useQuery<UserInfoType, Error>({
    queryKey: ["UserInfo"],
    queryFn: () => getProfile(),
  });
  return { data, isLoading, error };
};

export const useGetStudyInfo = (channelId: number) => {
  const { data, error, isLoading } = useQuery<StudyInfoType, Error>({
    queryKey: ["studyInfo", channelId],
    queryFn: () => getStudyInfo(channelId),
  });
  return { data, error, isLoading };
};

export const useMemberList = (channelId: number) => {
  const { data, error, isLoading } = useQuery<MemberListResponseType, Error>({
    queryKey: ["memberList", channelId],
    queryFn: () => getMemberList(channelId),
  });
  return { data, error, isLoading };
};

export const useRecruitment = (channelId: number) => {
  const { data, error, isLoading } = useQuery<RecruitmentInfoType, Error>({
    queryKey: ["recruitmentList", channelId],
    queryFn: () => getRecruitment(Number(channelId)),
  });
  return { data, error, isLoading };
};

export const useApplicationList = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["participation"],
    queryFn: () => getApplicationList(),
  });
  return { data, error, isLoading };
};

export const useAttendanceList = (channelId: number) => {
  const { data, error, isLoading } = useQuery<AttendanceResponseType[], Error>({
    queryKey: ["attendance", channelId],
    queryFn: () => getAttendance(Number(channelId)),
  });
  return { data, error, isLoading };
};
