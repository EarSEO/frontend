import { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { Gender } from "@/types/auth";

import { useAuthStore } from "@/store/useAuthStore";

const parseBirthdate = (birthdate: number[] | string | null | undefined) => {
    if (!birthdate) {
        return { year: "2000", month: "01", day: "01", date: new Date(2000, 0, 1) };
    }

    if (Array.isArray(birthdate)) {
        const [year, month, day] = birthdate;
        return {
            year: year.toString(),
            month: month.toString().padStart(2, "0"),
            day: day.toString().padStart(2, "0"),
            date: new Date(year, month - 1, day),
        };
    }

    // 문자열인 경우
    const [year, month, day] = birthdate.split("-");
    return {
        year,
        month,
        day,
        date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    };
};

export const useEditProfile = () => {
    const router = useRouter();
    const { user, updateProfile, updateProfileImage, fetchProfile, isLoading } = useAuthStore();

    const [nickname, setNickname] = useState("");
    const [nationality, setNationality] = useState("대한민국");
    const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
    const [birthYear, setBirthYear] = useState("2000");
    const [birthMonth, setBirthMonth] = useState("01");
    const [birthDay, setBirthDay] = useState("01");
    const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));
    const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

    const [showNationalityPicker, setShowNationalityPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [nicknameError, setNicknameError] = useState("");
    const [profileImageError, setProfileImageError] = useState("");
    const [saveError, setSaveError] = useState("");

    // 페이지 진입 시 서버에서 프로필 조회
    useEffect(() => {
        const initProfile = async () => {
            try {
                await fetchProfile();
            } catch (error) {
                console.error("프로필 조회 실패:", error);
            } finally {
                setIsInitializing(false);
            }
        };
        initProfile();
    }, []);

    // user 업데이트 시 폼에 반영
    useEffect(() => {
        if (user && !isInitializing) {
            setNickname(user.nickname || "");
            setNationality(user.nationality || "대한민국");
            setGender(user.gender || "MALE");
            setProfileImageUri(user.profileImage || null);

            const birth = parseBirthdate(user.birthdate);
            setBirthYear(birth.year);
            setBirthMonth(birth.month);
            setBirthDay(birth.day);
            setSelectedDate(birth.date);
        }
    }, [user, isInitializing]);

    const handleDateChange = useCallback((event: any, date?: Date) => {
        if (date) {
            setSelectedDate(date);
            setBirthYear(date.getFullYear().toString());
            setBirthMonth((date.getMonth() + 1).toString().padStart(2, "0"));
            setBirthDay(date.getDate().toString().padStart(2, "0"));
        }
    }, []);

    const handlePickImage = useCallback(async () => {
        setProfileImageError("");
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            setProfileImageError("갤러리 접근 권한이 필요합니다.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            const previousImageUri = profileImageUri;
            setProfileImageUri(asset.uri);

            const formData = new FormData();
            formData.append("file", {
                uri: asset.uri,
                type: "image/jpeg",
                name: "profile.jpg",
            } as any);

            try {
                const newImageUrl = await updateProfileImage(formData);
                setProfileImageUri(newImageUrl);
            } catch (error) {
                setProfileImageUri(previousImageUri);
                setProfileImageError("프로필 사진 업로드에 실패했습니다.");
            }
        }
    }, [updateProfileImage, profileImageUri]);

    const handleSave = useCallback(async () => {
        setNicknameError("");
        setSaveError("");
        if (!nickname) {
            setNicknameError("닉네임을 입력해주세요.");
            return;
        }
        if (nickname.length < 2 || nickname.length > 50) {
            setNicknameError("닉네임은 2자 이상 50자 이하여야 합니다.");
            return;
        }

        const birthdate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

        try {
            await updateProfile({
                nickname,
                gender: gender === "MALE" ? Gender.MALE : Gender.FEMALE,
                birthdate,
                nationality,
            });
            router.back();
        } catch (error: any) {
            const message = error?.response?.data?.message || "프로필 수정에 실패했습니다.";
            setSaveError(message);
        }
    }, [nickname, gender, birthYear, birthMonth, birthDay, nationality, updateProfile, router]);

    const handleOpenPasswordChange = useCallback(() => {
        router.push("/myPage/changePassword");
    }, [router]);

    return {
        user,
        isLoading,
        isInitializing,
        nickname,
        setNickname,
        nationality,
        setNationality,
        gender,
        setGender,
        birthYear,
        birthMonth,
        birthDay,
        selectedDate,
        profileImageUri,
        showNationalityPicker,
        setShowNationalityPicker,
        showDatePicker,
        setShowDatePicker,
        handleDateChange,
        handlePickImage,
        handleSave,
        handleOpenPasswordChange,
        nicknameError,
        setNicknameError,
        profileImageError,
        saveError,
    };
};