import { useState, useEffect, useCallback } from "react";
import { Hotel } from "../types/Hotel"; 
import api from "../utils/api";

interface UseFetchHotelsResult {
  data: Hotel[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;  // Agregar refresh a la interfaz
}

const useFetchHotels = (): UseFetchHotelsResult => {
  const [data, setData] = useState<Hotel[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHotels = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<Hotel[]>('/hoteles');
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = () => {
    fetchHotels();
  };

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return { data, loading, error, refresh };
};

export default useFetchHotels;
