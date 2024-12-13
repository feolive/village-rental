import {User} from 'next-auth';

export type LocalUser = User & { 
    password: string;
};

export type Customer = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    note: string;
    avatar: string;
};

export type Equipment = {
    id: string;
    category_number: string;
    name: string;
    description: string;
    daily_cost: number;
    status: string;
    rental_id: number;
    rental_date: Date;
    return_date: Date;
    rental_cost: number;
    createdAt: Date;
    updatedAt: Date;
};


export type Category = {
    number: string;
    description: string;
};

export type RentalQuery = {
    id: string;
    customer_id: string;
    equipment_id: string;
    equipment_name: string;
    daily_cost: number;
    create_date: Date;
    rental_date: Date;
    return_date: Date;
    first_name: string;
    last_name: string;
    total: number;
};

export type Rental = {
    id: string;
    create_date: Date;
    customer_id: number;
    customer_last_name: string;
    total: number;
};
