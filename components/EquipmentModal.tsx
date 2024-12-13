"use client";

import { Customer } from "@/app/lib/definitions";
import { useState, useRef,useEffect } from "react";
import { updateCustomer,addCustomer } from "@/app/lib/data-brokers";

export default function EquipmentModal({
  display,
  displayStatus,
  customer,
  isUpdate,
}: {
  display: boolean;
  displayStatus: any;
  customer: Customer;
  isUpdate: boolean;
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
    if (isUpdate) {
      await updateCustomer(currentCustomer);
    }else{
      currentCustomer.status = currentCustomer.status??'0';
      await addCustomer(currentCustomer);
    }
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
          <div>
            {!isUpdate && 
              <div>
                <label className="label">
                  <span className="label-text">ID</span>
                </label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-1/2"
                  name="id"
                  value={currentCustomer.id??""}
                  onChange={handleOnChange}
                />
              </div>
            }
          </div>
          
          <div className="grid grid-flow-row grid-cols-2 gap-2">
            <div className="">
              <div>
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
            </div>
            
            <div className="">
              <div>
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
            </div>
            <div className="">
              <div>
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
            </div>
            <div className="">
              <div>
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
            </div>
            <div className="">
              <div>
                <label className="label">
                  <span className="label-text">Status</span>
                </label>
                <select className="select select-accent min-w-10 max-w-xs" name="status" onChange={handleOnChange} value={currentCustomer.status?.trim()}>
                  <option value="0">Inactive</option>
                  <option value="1">Active</option>
                  <option value="2">10% Discount</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <form className="content-end">
                <button className="btn btn-primary" onClick={save}>Save</button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
