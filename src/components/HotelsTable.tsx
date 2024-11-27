// HotelsTable.tsx

import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Pagination,
    Button,
} from "@nextui-org/react";
import useFetchHotels from "../hooks/useFetchHotels";
import useDeleteHotel from "../hooks/useDeleteHotel";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import UpdateHotelModal from "./UpdateHotelModal";

const HotelsTable: React.FC = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data, loading, error } = useFetchHotels();
    const { deleteHotel } = useDeleteHotel();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Estado para el modal de actualización
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedHotelData, setSelectedHotelData] = useState<any | null>(null); // Estado para almacenar los datos del hotel seleccionado

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        setPage(1); // Restablecer a la primera página al realizar una búsqueda
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const openDeleteModal = (hotelId: string) => {
        setSelectedHotelId(parseInt(hotelId, 10)); // Convertimos el ID a número
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedHotelId(null);
    };

    const handleConfirmDeletion = async () => {
        if (selectedHotelId !== null) {
            const success = await deleteHotel(String(selectedHotelId));
            if (success) {
                closeDeleteModal();
            }
        }
    };

    const openUpdateModal = (hotelId: number) => {
        if (data !== null) {
            const selectedHotel = data.find((hotel) => hotel.id === hotelId); // Buscar los datos del hotel
            setSelectedHotelId(hotelId);
            setSelectedHotelData(selectedHotel); // Almacenar los datos del hotel seleccionado
            setIsUpdateModalOpen(true);
        } else {
            console.error("No se pudo encontrar el hotel: data es null");
        }
    };

    const closeUpdateModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedHotelId(null);
        setSelectedHotelData(null); // Limpiar los datos cuando se cierre el modal
    };

    return (
        <div className="hotels-table">
            <Input
                placeholder="Buscar por nombre, NIT o ciudad"
                value={search}
                onChange={handleSearch}
                className="mb-4"
                isClearable
            />
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <Table aria-label="Gestión de Hoteles">
                        <TableHeader>
                            <TableColumn>ID</TableColumn>
                            <TableColumn>Nombre</TableColumn>
                            <TableColumn>Dirección</TableColumn>
                            <TableColumn>Ciudad</TableColumn>
                            <TableColumn>NIT</TableColumn>
                            <TableColumn>Habitaciones</TableColumn>
                            <TableColumn>Acciones</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data && data.length > 0 ? (
                                data.map((hotel) => (
                                    <TableRow key={hotel.id}>
                                        <TableCell>{hotel.id}</TableCell>
                                        <TableCell>{hotel.nombre}</TableCell>
                                        <TableCell>{hotel.direccion}</TableCell>
                                        <TableCell>{hotel.ciudad}</TableCell>
                                        <TableCell>{hotel.nit}</TableCell>
                                        <TableCell>{hotel.numero_habitaciones}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="danger"
                                                size="sm"
                                                onPress={() => openDeleteModal(hotel.id.toString())}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button
                                                color="primary"
                                                size="sm"
                                                onPress={() => openUpdateModal(hotel.id)}
                                                className="ml-2"
                                            >
                                                Actualizar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>No se encontraron hoteles</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Pagination
                        total={10}
                        page={page}
                        onChange={handlePageChange}
                        className="mt-4"
                        showControls
                    />
                </>
            )}

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDeletion}
                itemId={selectedHotelId}
            />

            <UpdateHotelModal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                hotelId={selectedHotelId}
                hotelData={selectedHotelData}
            />
        </div>
    );
};

export default HotelsTable;
