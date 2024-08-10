import axios, { Method } from "axios"


interface FetchParams {
    url: string;
    method: Method;
    token?: string;
    data?: any;

}

export interface FetchApiResult {
    response: any | null;
    error: any | null;
}



export function useFetchApi() {

    async function fetchDataFromApi({ url, method, token, data }: FetchParams): Promise<FetchApiResult> {
        try {
            const headers: Record<string, string> = {};

            if (token) {
                headers.Authorization = token;
            }
            
            const response = await axios({
                url,
                method,
                headers,
                data,
              
            });
            return { response: response.data, error: null };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return { response: null, error: error.response.data };
            } else {
                return { response: null, error: "network connection error" };
            }
        }
    }
    return fetchDataFromApi;
}