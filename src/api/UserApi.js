import sha1 from "sha1";
import { ServerApi } from "./ServerApi";
import { CookieApi } from "./CookieApi";

export const UserApi = {
    regUser: async (login, password) => {
        let passwordHash = sha1(login + "--" + password);
        try {
            const response = await ServerApi.post("/user/create", {
                login: login,
                password: passwordHash,
            });
            if (response.data.error == 0) {
                CookieApi.write("user_session", JSON.stringify({
                    id: response.data.sessionId,
                    data: JSON.parse(response.data.userData),
                }));
                return { error: false, data: { id: response.data.sessionId, data: response.data.userData } };
            } else {
                return { error: true, message: "Пользователь с таким именем уже существует!" };
            }
        } catch (err) {
            alert(err);
            return { error: true, message: "Server error!" };
        }
    },
    loginUser: async (login, password) => {
        let passwordHash = sha1(login + "--" + password);
        try {
            const response = await ServerApi.post("/user/login", {
                login: login,
                password: passwordHash,
            });
            if (response.data.error == 0) {
                CookieApi.write("user_session", JSON.stringify({
                    id: response.data.sessionId,
                    data: JSON.parse(response.data.userData),
                }));
                return { error: false, data: { id: response.data.sessionId, data: response.data.userData } };
            } else {
                return { error: true, message: "Пользователь с таким именем не найден!" };
            }
        } catch (err) {
            alert(err);
            return { error: true, message: "Server error!" };
        }
    },
    fetchUserData: async () => {
        const sessionId = JSON.parse(CookieApi.read("user_session")).id;
        try {
            const response = await ServerApi.get("/user/data", {
                sessionId: sessionId,   
            });
            if (response.data.error == 0) {
                return { error: false, data: response.data.data };
            } else {
                alert("Возникли проблемы!");
                return { error: true, message: "Пользователь с таким именем не найден!" };
            }
        } catch (err) {
            alert(err);
            return { error: true, message: "Server error!" };
        }
    },
    updateUserData: async ({ name }) => {
        const sessionId = JSON.parse(CookieApi.read("user_session")).id;
        try {
            const response = await ServerApi.post("/user/update", {
                sessionId: sessionId,
                data: { name },   
            });
            if (response.data.error == 0) {
                CookieApi.write("user_session", response.data.forCookie);
                return { error: false };
            } else {
                alert("Возникли проблемы!");
                return { error: true, message: "Пользователь с таким именем не найден!" };
            }
        } catch (err) {
            alert(err);
            return { error: true, message: "Server error!" };
        }
    },
    logoutUser: async () => {
        const sessionId = JSON.parse(CookieApi.read("user_session")).id;
        try {
            const response = await ServerApi.post("/user/logout", {
                sessionId: sessionId,   
            });
            if (response.data.error == 0) {
                CookieApi.remove("user_session");
                return { error: false };
            } else {
                alert("Возникли проблемы!");
                return { error: true, message: "Пользователь с таким именем не найден!" };
            }
        } catch (err) {
            alert(err);
            return { error: true, message: "Server error!" };
        }
    }
};