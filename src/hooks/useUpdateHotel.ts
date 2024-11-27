import { useState } from "react";
import api from "../utils/api"; 
import { Hotel } from "../types/Hotel";
import toast from "react-hot-toast";
import useFetchHotels from "./useFetchHotels"; 

const useUpdateHotel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refresh } = useFetchHotels();  // Ahora podemos usar refresh

  const updateHotel = async (hotel: Hotel) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/hoteles/${hotel.id}`, hotel);

      if (response.status !== 200) {
        throw new Error("Error al actualizar el hotel");
      }

      toast.success('Hotel actualizado exitosamente');
      setLoading(false);
      refresh();  // Llamar a refresh para obtener los datos actualizados
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Error desconocido");
      toast.error('Error al actualizar el hotel');
      return null;
    }
  };

  return { updateHotel, loading, error };
};

export default useUpdateHotel;
