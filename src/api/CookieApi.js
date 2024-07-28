import Cookies from "js-cookie";

export const CookieApi = {
    write: (key, value) => {
        Cookies.set(key, value);
    },
    read: (key) => {
        return Cookies.get(key);
    },
    remove: (key) => {
        Cookies.remove(key);
    },
    contains: (key) => {
        return this.read(key) != undefined;
    }
}