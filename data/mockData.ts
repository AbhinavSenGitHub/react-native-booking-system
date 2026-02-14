// Mock data for services/tasks
export interface Service {
    id: string;
    name: string;
    description: string;
    duration: number; // in minutes
    price: number;
    category: string;
    imageUrl: string;
}

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

export interface Appointment {
    id: string;
    serviceId: string;
    serviceName: string;
    duration: number;
    price: number;
    date: string;
    timeSlot: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export const services: Service[] = [
    {
        id: '1',
        name: 'General Consultation',
        description: 'Comprehensive health checkup and consultation with experienced doctors',
        duration: 30,
        price: 50,
        category: 'Medical',
        imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    },
    {
        id: '2',
        name: 'Dental Checkup',
        description: 'Complete oral examination and dental health assessment',
        duration: 45,
        price: 75,
        category: 'Dental',
        imageUrl: 'https://whiteflintfamilydental.com/wp-content/uploads/dental-checkup-2203.jpg',
    },
    {
        id: '3',
        name: 'Physical Therapy',
        description: 'Personalized physical therapy session for recovery and rehabilitation',
        duration: 60,
        price: 100,
        category: 'Therapy',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
    },
    {
        id: '4',
        name: 'Eye Examination',
        description: 'Comprehensive eye health checkup and vision testing',
        duration: 30,
        price: 60,
        category: 'Ophthalmology',
        imageUrl: 'https://www.centreforsight.net/wp-content/uploads/2022/02/eye-checkup.webp',
    },
    {
        id: '5',
        name: 'Mental Health Counseling',
        description: 'Professional counseling session for mental wellness and support',
        duration: 60,
        price: 120,
        category: 'Mental Health',
        imageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
    },
    {
        id: '6',
        name: 'Nutrition Consultation',
        description: 'Personalized diet planning and nutritional guidance',
        duration: 45,
        price: 80,
        category: 'Nutrition',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
    },
];

// Generate time slots for a day (9 AM to 5 PM)
// Note: Initial availability is random, but booked appointments will override this
// in the service-details screen to prevent double-booking
export const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            slots.push({
                id: `slot-${hour}-${minute}`,
                time,
                available: Math.random() > 0.2, // 80% of slots are initially available
            });
        }
    }

    return slots;
};
