import axios from "axios";

export class ServerApi {
    static instance = () => axios   .create({
        baseURL: 'http://localhost:3030',
        timeout: 1000,
        headers: {}
    });
    static get = async (url, body) => {
        return await this.instance().get("/api" + url, {
            params: body,
        });
    };
    static post = async (url, body) => {
        return await this.instance().post("/api" + url, body);
    };
}