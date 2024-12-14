"use client";

import { Equipment, Category, EquipmentQuery } from "@/app/lib/definitions";
import { useState, useRef, useEffect } from "react";
import { updateEquipment, addEquipment } from "@/app/lib/data-brokers";

export default function EquipmentModal({
  display,
  displayStatus,
  equipment,
  isUpdate,
  categories,
}: {
  display: boolean;
  displayStatus: any;
  equipment: Equipment;
  isUpdate: boolean;
  categories: Category[];
}) {
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(
    {} as Equipment
  );
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setCurrentEquipment(equipment);
  }, [display]);

  useEffect(() => {
    if (display) {
      modalRef.current?.showModal();
    }
  }, [display]);

  const handleClose = () => {
    setCurrentEquipment({} as Equipment);
    modalRef.current?.close();
    displayStatus(false);
  };

  const handleOnChange = (e: any) => {
    let { name, value } = e.target;
    setCurrentEquipment({ ...currentEquipment, [name]: value });
  };

  const save = async () => {
    if (isUpdate) {
      await updateEquipment(currentEquipment);
    } else {
      currentEquipment.status = currentEquipment.status ?? "0";
      await addEquipment(currentEquipment);
      displayStatus(false);
    }
    console.log(currentEquipment);
  };

  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box w-1/2 h-[400px]">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Customer Detail</h3>
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
                  value={currentEquipment.id ?? ""}
                  onChange={handleOnChange}
                />
              </div>
            )}
          </div>

          <div className="grid grid-flow-row grid-cols-2 gap-2">
            <div className="">
              <div>
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  name="name"
                  value={currentEquipment.name ?? ""}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <div className="">
              <div>
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="category_number"
                  value={currentEquipment.category_number}
                  onChange={handleOnChange}
                >
                  {categories.map((category) => (
                    <option key={category.number} value={category.number}>
                      {category.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="">
              <div>
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  name="description"
                  value={currentEquipment.description ?? ""}
                  onChange={handleOnChange}
                />
              </div>
            </div>
            <div className="">
              <div>
                <label className="label">
                  <span className="label-text">Daily Cost</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  name="daily_cost"
                  value={currentEquipment.daily_cost ?? ""}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            <div className="modal-action">
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
