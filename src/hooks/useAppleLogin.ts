import { useState } from "react";

import { Platform } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";

import { useAuthStore } from "@/store/useAuthStore";

export const useAppleLogin = () => {
    const router = useRouter();
    const { appleLogin } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAppleLogin = async () => {
        if (Platform.OS !== "ios") {
            setError("Apple 로그인은 iOS에서만 지원됩니다.");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            const isAvailable = await AppleAuthentication.isAvailableAsync();
            if (!isAvailable) {
                setError("Apple 로그인을 사용할 수 없습니다.");
                return;
            }

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });

            if (credential.identityToken) {
                const fullName = credential.fullName
                    ? `${credential.fullName.familyName || ""}${credential.fullName.givenName || ""}`.trim()
                    : undefined;
                await appleLogin(credential.identityToken, fullName || undefined);
                router.back();
            }
        } catch (error: any) {
            if (error.code === "ERR_REQUEST_CANCELED") {
                return;
            }
            setError("Apple 로그인에 실패했습니다.");
            console.error("Apple login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        handleAppleLogin,
        isLoading,
        error,
    };
};