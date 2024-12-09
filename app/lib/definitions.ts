import {User} from 'next-auth';

export type LocalUser = User & { 
    password: string;
};

export type Customer = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    note: string;
};

export type Equipment = {
    id: number;
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
    number: number;
    description: string;
};


export type Rental = {
    id: number;
    create_date: Date;
    customer_id: number;
    customer_last_name: string;
    total: number;
};
