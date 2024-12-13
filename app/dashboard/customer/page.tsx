"use client";

import { useState, useEffect } from "react";
import { Customer } from "@/app/lib/definitions";
import { fetchCustomers } from "@/app/lib/data-brokers";
import CustomerModal from "@/components/CustomerModal";

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [displayModal, setDisplayModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(
    {} as Customer
  );
  const [displayAdd, setDisplayAdd] = useState(false);


  useEffect(() => {
    allCustomers();
  }, []);

  const allCustomers = async () => {
    const data = await fetchCustomers(null);
    setCustomers(data);
  };

  const handleSearch = async () => {
    const customers = await fetchCustomers({
      id: searchId,
      name: searchName,
      status: searchStatus,
    });
    setCustomers(customers);
  };

  const editCustomer = (customer: Customer) => {
    setDisplayModal(true);
    setCurrentCustomer(customer);
  };

  const addCustomer = () => {
    setDisplayAdd(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <div className="flex flex-row items-center gap-80">
        <div className="flex flex-col">
          {/* Search Form */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Customer ID"
              className="input input-bordered mr-2"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered mr-2"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <select
              className="select select-bordered mr-2"
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="0">Inactive</option>
              <option value="1">Active</option>
              <option value="2">10% Discount</option>
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>

          {/* Customer Table */}
          <div className="overflow-auto h-2/3 mt-16">
            <table className="table">
              <thead className="sticky top-0 bg-base-100">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers?.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12 rounded-full">
                            <img
                              src={
                                customer.avatar == null || customer.avatar.trim() == ""
                                  ? "/images/avatar.png"
                                  : customer.avatar
                              }
                              alt="Avatar"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{`${customer.first_name} ${customer.last_name}`}</div>
                          <div className="text-sm opacity-50">
                            ID: {customer.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>
                      {customer.status.trim() == "0"
                        ? "Inactive"
                        : customer.status.trim() === "1"
                        ? "Active"
                        : "10% Discount"}
                    </td>
                    <td>
                      <button
                        className="btn btn-accent btn-xs btn-outline"
                        onClick={() => editCustomer(customer)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <CustomerModal
              display={displayModal}
              displayStatus={setDisplayModal}
              customer={currentCustomer}
              isUpdate={true}
            />
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => addCustomer()}
        >
          Add Customer
        </button>
        <CustomerModal
          display={displayAdd}
          displayStatus={setDisplayAdd}
          customer={{} as Customer}
          isUpdate={false}
        />
      </div>
    </div>
  );
}
