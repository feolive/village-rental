"use server";

import { Pool } from "pg";
import { Customer,Category,RentalQuery } from "@/app/lib/definitions";
import { isNull } from "@/app/lib/utils";

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
    ${!isNull(id) ? `and id = '${id}'` : ""} \
    ${!isNull(name) ? `and last_name like '%${name}%'` : ""} \
    ${!isNull(status) ? `and status = '${status}'` : ""} \
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
    const sql = `SELECT * FROM equipment where 1=1 \
    ${!isNull(id) ? `and id = '${id}'` : ""} \
    ${!isNull(name) ? `and name like '${name}'` : ""} \
    ${!isNull(category) ? `and category_number = '${category}'` : ""} order by id;`;
    const { rows } = await pool.query(sql);

    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchCategories() {
  try {
    const { rows } = await pool.query("SELECT * FROM category;");
    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchSalesByDate() {
  try {
    const sql = "select to_char(create_date,'yyyy-mm-dd') as create_date, \
                	case  when total is null then 0 \
                	else total \
                	end as total \
                from rental order by create_date ";
    const { rows } = await pool.query(sql);
    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchSalesByCustomer() {
  try {
    const sql =
      "select c.first_name||' '||c.last_name as name, \
      case when r.total is null then 0 \
      else r.total \
      end as total \
      from customer c \
      left join rental r on c.id = r.customer_id \
      order by c.last_name, c.first_name ";
    const { rows } = await pool.query(sql);
    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchItemsByCategory() {
  try {
    const sql = "select e.id,c.description as ctg,e.name,e.description,e.daily_cost\
                from equipment e\
                right join category c on e.category_number = c.number order by 2,3";
    const { rows } = await pool.query(sql);
    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchRental(params: RentalQuery | null) {
  try {
    const rental_date = params?.rental_date;
    const return_date = params?.return_date;
    const equipment = params?.equipment_name;
    const customer_last_name = params?.last_name;

    const sql = `select r.id,r.customer_id,c.first_name , c.last_name, r.create_date,e.id,e.name as equipment_name,e.daily_cost, e.rental_date, e.return_date, r.total \
                from rental r \
                inner join equipment e on r.id = e.rental_id \
                inner join customer c on c.id = r.customer_id \
                where 1=1 ${!isNull(customer_last_name) ? `and lower(r.customer_last_name) like lower('%${customer_last_name}%')` : ''} \
                ${!isNull(equipment) ? `and lower(e.name) like lower('%${equipment}%')` : ''} \
                ${!isNull(rental_date) ? `and rental_date >= '${rental_date}'` : ''} \
                ${!isNull(return_date) ? `and  return_date <= '${return_date}'` : ''}`;
    const { rows } = await pool.query(sql);
    return rows;
  } catch (e) {
    console.log(e);
  }
}

export async function addRental(rental: RentalQuery) {
  let client;
  try {
    client = await pool.connect();
    let rentalSql = "INSERT INTO rental (id,customer_id, equipment_id, create_date, rental_date, return_date, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";

    const { rows } = await client.query(rentalSql,
      [
        rental.id,
        rental.customer_id,
        rental.equipment_id,
        rental.create_date,
        rental.rental_date,
        rental.return_date,
        rental.total,
      ]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  } finally {
    client?.release();
  }
}

export async function updateRental(rental: RentalQuery) {
  let client;
  try {
    if(isNull(rental)){
      throw new Error("Rental is null");
    }
    if(isNull(rental.id)){
      throw new Error("Rental id is null");
    }
    if(isNull(rental.customer_id) && isNull(rental.equipment_id) && isNull(rental.create_date) && isNull(rental.rental_date) && isNull(rental.return_date) && isNull(rental.total)){
      throw new Error("nothing to be updated");
    }

    client = await pool.connect();
    let rentalSql = "UPDATE rental SET ";
    let setValues = [];
    let whereClause = "id = $1";
    if (!isNull(rental.customer_id)) {
      setValues.push(rental.customer_id);
      rentalSql += "customer_id = $" + (setValues.length + 1) + ", ";
    }
    if (!isNull(rental.equipment_id)) {
      setValues.push(rental.equipment_id);
      rentalSql += "equipment_id = $" + (setValues.length + 1) + ", ";
    }
    if (!isNull(rental.create_date)) {
      setValues.push(rental.create_date);
      rentalSql += "create_date = $" + (setValues.length + 1) + ", ";
    }
    if (!isNull(rental.rental_date)) {
      setValues.push(rental.rental_date);
      rentalSql += "rental_date = $" + (setValues.length + 1) + ", ";
    }
    if (!isNull(rental.return_date)) {
      setValues.push(rental.return_date);
      rentalSql += "return_date = $" + (setValues.length + 1) + ", ";
    }
    if (!isNull(rental.total)) {
      setValues.push(rental.total);
      rentalSql += "total = $" + (setValues.length + 1) + ", ";
    }
    setValues.push(rental.id);
    rentalSql = rentalSql.slice(0, -2) + " WHERE " + whereClause;
    
    const { rows } = await client.query(rentalSql);
    return rows[0];
  } catch (e) {
    console.log(e);
  } finally {
    client?.release();
  }
}

export async function addCategory(category: Category) {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO category (number,description) VALUES ($1, $2) RETURNING *;",
      [category.number, category.description]
    );
    return rows[0];
  } catch (e) {
    console.log(e);
  } finally {
    client?.release();
  }
}

export async function addCustomer(customer: Customer) {
  let client;
  let sql;
  try {
    client = await pool.connect();
    sql = "INSERT INTO customer (id,first_name, last_name, email, phone, status, note) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
      
    const { rows } = await client.query(sql, [
      customer.id,
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.phone,
      customer.status,
      customer.note,
    ]);
    return rows[0];
  } catch (e) {
    console.log(e);
  } finally {
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
  } catch (e) {
    console.log(e);
  } finally {
    client?.release();
  }
}


