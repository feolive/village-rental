"use client";

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RentalQuery, Customer, Equipment } from "@/app/lib/definitions";
import {fetchRental,fetchCustomers,fetchEquipments} from "@/app/lib/data-brokers";
import RentalModal from "@/components/RentalModal";

export default function Page() {
  const [query, setQuery] = useState<RentalQuery>({} as RentalQuery);
  const [rentals, setRentals] = useState<RentalQuery[]>([]);
  const [editRental, setEditRental] = useState<RentalQuery>({} as RentalQuery);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [displayAdd, setDisplayAdd] = useState(false);

  useEffect(() => {
    allRentals();
    allCustomers();
    allEquipments();
  }, []);

  const allEquipments = async () => {
    const equipments = await fetchEquipments(null);
    setEquipments(equipments);
  };

  const allCustomers = async () => {
    const data = await fetchCustomers(null);
    setCustomers(data);
  };

  const allRentals = async () => {
    const data = await fetchRental(null);
    setRentals(data);
  };

  const changeSearchVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const changeRentalDate = (date: Date | null) => {
    if (date === null) {
      return;
    }
    setQuery({ ...query, rental_date: date });
  };

  const changeReturnDate = (date: Date | null) => {
    if (date === null) {
      return;
    }
    setQuery({ ...query, return_date: date });
  };

  const handleSearch = async () => {
    const rentals = await fetchRental(query);
    setRentals(rentals);
  };

  const handleEditRental = (rental: RentalQuery) => {
    setDisplayUpdate(true);
    setEditRental(rental);
  };

  const addRental = () => {
    setDisplayAdd(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Rental Management</h1>

      {/* Search Form */}
      <div className="mb-6 flex justify-start gap-3">
        <input
          type="text"
          placeholder="Equipment Name"
          className="input input-bordered grow-0"
          name="equipment_name"
          value={query.equipment_name}
          onChange={(e) => changeSearchVal(e)}
        />
        <input
          type="text"
          placeholder="Customer Last Name"
          className="input input-bordered grow-0"
          name="last_name"
          value={query.last_name}
          onChange={(e) => changeSearchVal(e)}
        />
        <DatePicker
          className="input input-bordered grow-0"
          name="rental_date"
          placeholderText="Rental Date"
          selected={query.rental_date}
          onChange={(date) => changeRentalDate(date)}
        />
        <DatePicker
          className="input input-bordered grow-0 shrink-0"
          name="return_date"
          placeholderText="Return Date"
          selected={query.return_date}
          onChange={(date) => changeReturnDate(date)}
        />
      </div>
      <button className="btn btn-primary w-28" onClick={handleSearch}>
        Search
      </button>

      <div className="flex justify-content items-center">
        {/* Customer Table */}
        <div className="overflow-auto w-3/4 h-2/3 mt-16">
          <table className="table w-3/4">
            <thead className="sticky top-0 bg-base-100">
              <tr>
                <th>Rental ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Equipment</th>
                <th>Rental Date</th>
                <th>Return Date</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rentals?.map((rental) => (
                <tr key={rental.id}>
                  <td>{rental.id}</td>
                  <td>
                    {rental.first_name} {rental.last_name}
                  </td>
                  <td>{rental.create_date.toLocaleString()}</td>
                  <td>{rental.equipment_name}</td>
                  <td>{rental.rental_date.toLocaleString()}</td>
                  <td>{rental.return_date.toLocaleString()}</td>
                  <td>{rental.total}</td>

                  <td>
                    <button
                      className="btn btn-accent btn-xs btn-outline"
                      onClick={() => handleEditRental(rental)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <RentalModal
            display={displayUpdate}
            displayStatus={setDisplayUpdate}
            rental={editRental}
            isUpdate={true}
            customers={customers}
            equipments={equipments}
          />
        </div>
        <button className="btn btn-primary w-28" onClick={addRental}>
          Add Rental
        </button>
        <RentalModal
          display={displayAdd}
          displayStatus={setDisplayAdd}
          rental={{} as RentalQuery}
          isUpdate={false}
          customers={customers}
          equipments={equipments}
        />
      </div>
    </div>
  );
}
