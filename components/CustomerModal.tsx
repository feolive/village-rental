"use client";

import { Customer } from "@/app/lib/definitions";
import { useState, useRef,useEffect } from "react";

export default function CustomerModal({
  display,
  displayStatus,
  customer,
}: {
  display: boolean;
  displayStatus: any;
  customer: Customer;
}) {
  const [currentCustomer, setCurrentCustomer] = useState<Customer>({} as Customer);
  const modalRef = useRef<HTMLDialogElement>(null);


  useEffect(() => {
    setCurrentCustomer(customer);
  }, [display]);

  useEffect(() => {
    if (display) {
      modalRef.current?.showModal();
    }
  }, [display]);

  const handleClose = () => {
    setCurrentCustomer({} as Customer);
    modalRef.current?.close();
    displayStatus(false)
  };

  const handleOnChange = (e: any) => {
    let { name, value } = e.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const save = async() => {

    console.log(currentCustomer);
  };

  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box w-1/2">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={handleClose}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Customer Detail</h3>
          <div className="grid grid-flow-row grid-cols-2 gap-2">
            <div className="">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="first_name"
                value={currentCustomer.first_name??""}
                onChange={handleOnChange}
              />
            </div>
            
            <div className="">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="last_name"
                value={currentCustomer.last_name}
                onChange={handleOnChange}
              />
            </div>
            <div className="">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="phone"
                value={currentCustomer.phone}
                onChange={handleOnChange}
              />
            </div>
            <div className="">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                name="email"
                value={currentCustomer.email}
                onChange={handleOnChange}
              />
            </div>
            <div className="">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select className="select select-primary w-full max-w-xs" name="status">
                <option disabled selected>
                  {currentCustomer.status}
                </option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="modal-action">
              <form method="post">
                <button className="btn btn-primary" onClick={save}>Save</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
