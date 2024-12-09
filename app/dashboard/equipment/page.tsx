'use client'

import { useState, useEffect } from 'react'
import { Equipment, Category } from '@prisma/client'

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchId, setSearchId] = useState('')
  const [searchName, setSearchName] = useState('')
  const [searchCategory, setSearchCategory] = useState('')

  useEffect(() => {
    fetchEquipments()
    fetchCategories()
  }, [])

  const fetchEquipments = async () => {
    const response = await fetch('/api/equipment')
    const data = await response.json()
    setEquipments(data)
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/category')
    const data = await response.json()
    setCategories(data)
  }

  const handleSearch = async () => {
    const response = await fetch(`/api/equipment?id=${searchId}&name=${searchName}&category=${searchCategory}`)
    const data = await response.json()
    setEquipments(data)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Equipment Management</h1>
      
      {/* Search Form */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Equipment ID"
          className="input input-bordered mr-2"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Equipment Name"
          className="input input-bordered mr-2"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <select
          className="select select-bordered mr-2"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.number} value={category.number}>
              {category.description}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Equipment Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Daily Cost</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((equipment) => (
              <tr key={equipment.id}>
                <td>{equipment.id}</td>
                <td>{equipment.name}</td>
                <td>{equipment.categoryNumber}</td>
                <td>{equipment.dailyCost.toString()}</td>
                <td>{equipment.status === '0' ? 'Available' : 'Rented'}</td>
                <td>
                  <button className="btn btn-sm btn-outline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Carousel */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
          {categories.map((category) => (
            <div key={category.number} className="carousel-item">
              <div className="card w-64 bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">{category.description}</h2>
                  <p>Category Number: {category.number}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}