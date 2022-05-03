import {useEffect, useState} from "react";

export async function fetchJSON(url) {
    const res = await fetch(url);
  
    if (!res.ok) {
        throw new Error(`Failed ${res.status}`);
    }
    return await res.json();
}

export function useLoader(loadingFn) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState();
    const [error, setError] = useState();

    async function load() {
        try {
            setLoading(true);
            setData(await loadingFn());
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => load(), []);
    return {loading, data, error};
}
