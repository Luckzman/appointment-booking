import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';


export const useFetchData = (url) => {
    const { token } = useContext(AuthContext)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const result = await res.json();
                if(!res.ok) throw new Error(result.message + '😡')

                setData(result.data);
                setLoading(false);
            } catch (error) {
                console.log(error, 'error')
                setLoading(false);
                setError(error.message)
            }
        }

        fetchData()
    }, [url])

    return { data, loading, error }
}
