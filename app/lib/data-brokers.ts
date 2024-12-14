"use server";

import { Pool } from "pg";
import { Customer,Category,RentalQuery, Equipment } from "@/app/lib/definitions";
import { isNull } from "@/app/lib/utils";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
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
    const id = params?.id.trim();
    const name = params?.name.trim();
    const category = params?.category.trim();
    const sql = `SELECT e.id, e.name, c.description as ctg, e.description, e.daily_cost, e.rental_date, e.return_date, e.status \
    FROM equipment e \
    left join rental r on r.id = e.rental_id \
    left join category c on c.number = e.category_number \
    where 1=1 \
    ${!isNull(id) ? `and e.id = '${id}'` : ""} \
    ${!isNull(name) ? `and e.name like '${name}'` : ""} \
    ${!isNull(category) ? `and e.category_number = '${category}'` : ""} order by id;`;
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
      case when sum(r.total) is null then 0 \
      else sum(r.total) \
      end as total \
      from customer c \
      left join rental r on c.id = r.customer_id \
      group by c.id \
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

    const sql = `select r.id,r.customer_id,c.first_name , c.last_name, r.create_date,e.id as equipment_id,e.name as equipment_name,e.daily_cost, e.rental_date, e.return_date, r.total \
                from rental r \
                inner join equipment e on r.id = e.rental_id \
                inner join customer c on c.id = r.customer_id \
                where 1=1 ${!isNull(customer_last_name) ? `and lower(r.customer_last_name) like lower('%${customer_last_name}%')` : ''} \
                ${!isNull(equipment) ? `and lower(e.name) like lower('%${equipment}%')` : ''} \
                ${!isNull(rental_date) ? `and rental_date >= '${rental_date}'` : ''} \
                ${!isNull(return_date) ? `and  return_date <= '${return_date}'` : ''} order by r.create_date;`;
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
    let rentalSql = "INSERT INTO rental (id,customer_id, create_date, customer_last_name, total) VALUES ($1, $2, $3, $4, $5) RETURNING *;";

    const { rows } = await client.query(rentalSql,
      [
        rental.id,
        rental.customer_id.trim(),
        new Date().toISOString(),
        rental.last_name.trim(),
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
    const rows = await updateRentalTable(rental, client);
    const equipmentRows = await updateEquipmentTable(rental, client);

    return rows[0];
  } catch (e) {
    client.query("ROLLBACK");
    console.log(e);
  } finally {
    client?.release();
  }
}

async function updateRentalTable(rental: RentalQuery, client: any) {
  try {
    let setValues = [];
    let rentalSql = "UPDATE rental SET ";
    if (!isNull(rental.customer_id)) {
      rentalSql += "customer_id = $" + (setValues.length+1) + ", ";
      setValues.push(rental.customer_id.trim());
    }
    if (!isNull(rental.create_date)) {
      rentalSql += "create_date = $" + (setValues.length+1) + ", ";
      setValues.push(rental.create_date);
    }
    if (!isNull(rental.last_name)) {
      rentalSql += "customer_last_name = $" + (setValues.length+1) + ", ";
      setValues.push(rental.last_name.trim());
    }
    if (!isNull(rental.total)) {
      rentalSql += "total = $" + (setValues.length+1) + ", ";
      setValues.push(Number(rental.total).toFixed(2));
    }
    setValues.push(rental.id.trim());
    rentalSql = rentalSql.slice(0, -2) + " WHERE id = $" + (setValues.length);
    const { rows } = await client.query(rentalSql, setValues);

    return rows[0];
  } catch (e) {
    console.log(e);
  } 
}

async function updateEquipmentTable(rental: RentalQuery, client: any) {
  try {
    let setValues = [];
    let equipmentSql = "UPDATE equipment SET ";
    if (!isNull(rental.rental_date)) {
      equipmentSql += "rental_date = $" + (setValues.length+1) + ", ";
      setValues.push(rental.rental_date);
    }
    if (!isNull(rental.return_date)) {
      equipmentSql += "return_date = $" + (setValues.length+1) + ", ";
      setValues.push(rental.return_date);
    }
    if (!isNull(rental.id)) {
      equipmentSql += "rental_id = $" + (setValues.length+1) + ", ";
      setValues.push(rental.id.trim());
    }
    setValues.push(rental.equipment_id.trim());
    equipmentSql = equipmentSql.slice(0, -2) + " WHERE id = $" + (setValues.length);
    const { rows } = await client.query(equipmentSql, setValues);  
    return rows[0];
  } catch (e) {
    console.log(e);
  } 
} 

export async function updateEquipment(equipment: Equipment) {
  let client;
  try {
    client = await pool.connect();
    let setValues = [];
    let sql = "UPDATE equipment SET ";
    if(isNull(equipment.id)){
      throw new Error("Equipment id is null");
    }
    if(!isNull(equipment.category_number)){
      sql += "category_number = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.category_number.trim());
    }
    if(!isNull(equipment.name)){
      sql += "name = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.name.trim());
    }
    if(!isNull(equipment.description)){
      sql += "description = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.description.trim());
    }
    if(!isNull(equipment.daily_cost)){
      sql += "daily_cost = $" + (setValues.length+1) + ", ";
      setValues.push(Number(equipment.daily_cost).toFixed(2));
    }
    if(!isNull(equipment.status)){
      sql += "status = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.status.trim());
    }
    if(!isNull(equipment.rental_id)){
      sql += "rental_id = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.rental_id.trim());
    }
    if(!isNull(equipment.rental_date)){
      sql += "rental_date = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.rental_date);
    }
    if(!isNull(equipment.return_date)){
      sql += "return_date = $" + (setValues.length+1) + ", ";
      setValues.push(equipment.return_date);
    }
    if(!isNull(equipment.rental_cost)){
      sql += "rental_cost = $" + (setValues.length+1) + ", ";
      setValues.push(Number(equipment.rental_cost).toFixed(2));
    }
    setValues.push(equipment.id.trim());
    sql = sql.slice(0, -2) + " WHERE id = $" + (setValues.length);

    const { rows } = await client.query(
      sql,
      setValues
    );
    return rows[0];
  } catch (e) {
    client.query("ROLLBACK");
    console.log(e);
  } finally {
    client?.release();
  }
}

export async function addEquipment(equipment: Equipment) {
  let client;
  try {
    if(isNull(equipment)){
      throw new Error("Equipment is null");
    }
    if(isNull(equipment.id)){
      throw new Error("Equipment id is null");
    }
    if(isNull(equipment.category_number)){
      throw new Error("Equipment category number is null");
    }
    if(isNull(equipment.name)){
      throw new Error("Equipment name is null");
    }
    if(isNull(equipment.daily_cost)){
      throw new Error("Equipment daily cost is null");
    }
    client = await pool.connect();
    const { rows } = await client.query(
      "INSERT INTO equipment (id,category_number,name,description,daily_cost) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [
        equipment.id.trim(),
        equipment.category_number.trim(),
        equipment.name.trim(),
        equipment.description.trim(),
        Number(equipment.daily_cost).toFixed(2)
      ]
    );
    return rows[0];
  } catch (e) {
    client.query("ROLLBACK");
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
    client.query("ROLLBACK");
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
    client.query("ROLLBACK");
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
    client.query("ROLLBACK");
    console.log(e);
  } finally {
    client?.release();
  }
}


