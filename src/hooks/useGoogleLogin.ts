import { useEffect, useState } from "react";

import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from "@env";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { useAuthStore } from "@/store/useAuthStore";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleLogin = () => {
    const router = useRouter();
    const { googleLogin } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        scopes: ["openid", "profile", "email"],
    });

    useEffect(() => {
        if (response?.type === "success") {
            const idToken = response.params.id_token;
            if (idToken) {
                handleLoginWithToken(idToken);
            }
        }
    }, [response]);

    const handleLoginWithToken = async (idToken: string) => {
        try {
            setIsLoading(true);
            setError("");

            const loginResponse = await googleLogin(idToken);

            if (loginResponse.isNewMember) {
                router.push({
                    pathname: "/myPage/socialSignup",
                    params: {
                        email: loginResponse.email,
                        provider: loginResponse.provider,
                        tempToken: loginResponse.tempToken,
                        nickname: loginResponse.nickname || "",
                    },
                });
            } else {
                router.back();
            }
        } catch (error: any) {
            setError("Google 로그인에 실패했습니다.");
            console.error("Google login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError("");
            await promptAsync();
        } catch (error: any) {
            setError("Google 로그인에 실패했습니다.");
            console.error("Google login error:", error);
        }
    };

    return { handleGoogleLogin, isLoading, error };
};