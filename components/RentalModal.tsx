"use client";

import { RentalQuery, Customer, Equipment } from "@/app/lib/definitions";
import { useState, useRef, useEffect } from "react";
import {
  updateRental,
  addRental,
  fetchEquipments,
  updateEquipment,
} from "@/app/lib/data-brokers";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { daysBetween } from "@/app/lib/utils";

export default function RentalModal({
  display,
  displayStatus,
  rental,
  isUpdate,
  customers,
  equipments,
}: {
  display: boolean;
  displayStatus: any;
  rental: RentalQuery;
  isUpdate: boolean;
  customers: Customer[];
  equipments: Equipment[];
}) {
  const [currentRental, setCurrentRental] = useState<RentalQuery>(
    {} as RentalQuery
  );
  const modalRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef(null);
  const equipmentRef = useRef(null);
  const rentalDateRef = useRef(null);
  const returnDateRef = useRef(null);

  useEffect(() => {
    setCurrentRental(rental);
  }, [display]);

  useEffect(() => {
    if (display) {
      modalRef.current?.showModal();
    }
  }, [display]);

  const handleClose = () => {
    setCurrentRental({} as RentalQuery);
    modalRef.current?.close();
    displayStatus(false);
  };

  const handleOnChange = (e: any) => {
    let { name, value } = e.target;
    setCurrentRental({ ...currentRental, [name]: value });
  };

  const save = async () => {
    if (isUpdate) {
      currentRental.total =
        currentRental.daily_cost *
        daysBetween(currentRental.rental_date, currentRental.return_date);
      await updateRental(currentRental);
    } else {
      const equipments = await fetchEquipments({
        id: currentRental.equipment_id,
        name: "",
        category: "",
      });
      let status = equipments[0].status;
      if (status === "1") {
        throw new Error("Equipment is already rented");
      }
      currentRental.daily_cost = equipments[0].daily_cost;
      currentRental.total =
        equipments[0].daily_cost *
        daysBetween(currentRental.rental_date, currentRental.return_date);
      currentRental.customer_id = nameRef.current.value;
      currentRental.last_name =
        nameRef.current.selectedOptions[0].text.split(" ")[1];
      currentRental.equipment_id = equipmentRef.current.value;
      await updateEquipment({
        ...equipments[0],
        rental_id: currentRental.id,
        status: "1",
        rental_date: currentRental.rental_date,
        return_date: currentRental.return_date,
        rental_cost: currentRental.total,
      });
      await addRental(currentRental);
    }
    console.log(currentRental);
  };

  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box h-1/2">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Rental Detail</h3>
          <div>
            {!isUpdate && (
              <div>
                <label className="label">
                  <span className="label-text">ID</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-1/2"
                  name="id"
                  value={currentRental.id ?? ""}
                  onChange={handleOnChange}
                />
              </div>
            )}
          </div>
          <div className="grid grid-flow-row grid-cols-2 gap-2">
            <div>
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <select
                ref={nameRef}
                className="select select-bordered w-full max-w-xs"
                name="customer_id"
                value={currentRental.customer_id}
                onChange={handleOnChange}
              >
                {customers &&
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.first_name} {customer.last_name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Equipment</span>
              </label>
              <select
                ref={equipmentRef}
                className="select select-bordered w-full max-w-xs"
                name="equipment_id"
                value={currentRental.equipment_id}
                onChange={handleOnChange}
              >
                {equipments &&
                  equipments.map((equipment) => (
                    <option key={equipment.id} value={equipment.id}>
                      {equipment.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Rental Date</span>
              </label>
              <DatePicker
                className="input input-bordered w-full"
                name="rental_date"
                selected={currentRental.rental_date}
                onChange={(date) =>
                  setCurrentRental({ ...currentRental, rental_date: date })
                }
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Return Date</span>
              </label>
              <DatePicker
                className="input input-bordered w-full"
                name="return_date"
                selected={currentRental.return_date}
                onChange={(date) =>
                  setCurrentRental({ ...currentRental, return_date: date })
                }
              />
            </div>
            <div className="modal-action ">
              <form method="content-end">
                <button
                  className="absolute btn btn-primary bottom-4 right-4"
                  onClick={save}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
