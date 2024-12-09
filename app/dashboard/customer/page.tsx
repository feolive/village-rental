'use client'

import { useState, useEffect } from 'react'
import {sql} from '@vercel/postgres'
import { Customer } from '@prisma/client'

export default function Page() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  // useEffect(() => {
  //   fetchCustomers()
  // }, [])

  const fetchCustomers = async () => {
    const response = await fetch('/api/customer')
    const data = await response.json()
    setCustomers(data)
  }

  const handleSearch = async () => {
    const response = await fetch(`/api/customer?id=${searchId}&name=${searchName}&status=${searchStatus}`)
    const data = await response.json()
    setCustomers(data)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      
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
          placeholder="Customer Name"
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
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{`${customer.firstName} ${customer.lastName}`}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.status === '0' ? 'Inactive' : customer.status === '1' ? 'Active' : '10% Discount'}</td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}