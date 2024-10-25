import { useAuthContext } from "./useAuthContext";

export const useSignOut = () => {
    const { dispatch } = useAuthContext();

    const signout = () => {
        localStorage.removeItem("userData");

        dispatch({ type: "SIGN_OUT" });

        return true;
    };

    return { signout };
};
