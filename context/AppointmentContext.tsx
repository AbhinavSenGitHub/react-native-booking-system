import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Appointment } from '@/data/mockData';

interface AppointmentContextType {
    appointments: Appointment[];
    addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
    cancelAppointment: (id: string) => void;
    getAppointments: () => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        };

        setAppointments((prev) => [...prev, newAppointment]);
    };

    const cancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((apt) =>
                apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
            )
        );
    };

    const getAppointments = () => {
        return appointments.filter((apt) => apt.status !== 'cancelled');
    };

    return (
        <AppointmentContext.Provider
            value={{
                appointments,
                addAppointment,
                cancelAppointment,
                getAppointments,
            }}
        >
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = (): AppointmentContextType => {
    const context = useContext(AppointmentContext);
    if (!context) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};
