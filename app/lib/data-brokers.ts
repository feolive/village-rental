'use server';

import {Pool} from 'pg';
import { Customer } from "@/app/lib/definitions";

const pool = new Pool({
  user: "test",
  host: "localhost",
  database: "demo_db",
  password: "123456",
  port: 5432,
});

export async function fetchCustomers(
  params: { id: string; name: string; status: string } | null
) {
  try {
    const id = params?.id;
    const name = params?.name;
    const status = params?.status;

    const sql = `SELECT * FROM customer where 1=1 \
    ${!isNull(id) ? `and id = '${id}'` : ''} \
    ${!isNull(name) ?`and last_name like '%${name}%'`:''} \
    ${!isNull(status) ? `and status = '${status}'` : ''} \
    order by last_name, first_name;`;
    const { rows } = await pool.query(sql);

    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchEquipments(
  params: { id: string; name: string; category: string } | null
) {
  try {
    const id = params?.id;
    const name = params?.name;
    const category = params?.category;
    const sql = `SELECT * FROM equipment where 1=1 
    ${typeof id != 'undefined' && id!=null ? `and id = ${id}` : ''} ${typeof name != 'undefined' && name !=null ? `and name like ${name}` : ''} 
    ${typeof category != 'undefined' && category !=null ? `and category_number = ${category}` : ''} ;`;
    const { rows } = await pool.query(sql);

    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function addCustomer(customer: Customer) {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO customer (first_name, last_name, email, phone, status, note) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone,
        customer.status,
        customer.note,
      ]
    );
    return rows[0];
  }catch(e){
    console.log(e);
  }finally{
    client?.release();
  }
}

export async function updateCustomer(customer: Customer) {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "UPDATE customer SET first_name = $1, last_name = $2, email = $3, phone = $4, status = $5, note = $6 WHERE id = $7 RETURNING *;",
      [
        customer.first_name,
        customer.last_name,
        customer.email,
        customer.phone,
        customer.status,
        customer.note,
        customer.id,
      ]
    );
    return rows[0];
  }catch(e){
    console.log(e);
  }finally{
    client?.release();
  }
}

function isNull(obj: any) : boolean {
  if (typeof obj === 'undefined' || obj === null || obj === undefined || obj === '') {
    return true;
  }
  
  return false;
}