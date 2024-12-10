'use client';

import { Customer } from "@/app/lib/definitions";
import { useState,useRef } from "react";
import { set } from "zod";

export default function CustomerModal({
  display,
  customer,
  setDisplayModal
}: {
  display: boolean;
  customer: Customer;
  setDisplayModal: (display: boolean) => void;
}) {
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(customer as Customer);
  const modalRef = useRef<HTMLDialogElement>(null);

  if (display) {
    modalRef.current?.showModal();
  }

  const handleClose = () => {
    setDisplayModal(false)
    modalRef.current?.close();
  };

  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Customer Detail</h3>
          <div className="flex w-full flex-grow-0 gap-5">
            <div className="w-1/2">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                value={currentCustomer.first_name}
              />
            </div>
            <div className="w-1/2">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                value={currentCustomer.last_name}
              />
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
