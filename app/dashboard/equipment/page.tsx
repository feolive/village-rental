"use client";

import { useState, useEffect, useRef } from "react";
import { Equipment, Category } from "@/app/lib/definitions";
import {
  fetchEquipments,
  fetchCategories,
  addCategory,
} from "@/app/lib/data-brokers";

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [newCtg, setNewCtg] = useState<Category>({} as Category);

  const ctgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    allEquipments();
    fetchCategories().then((categories) => {
      setCategories(categories);
    });
  }, []);

  const allEquipments = async () => {
    const equipments = await fetchEquipments(null);
    setEquipments(equipments);
  };

  const handleSearch = async () => {
    const equipments = await fetchEquipments({
      id: searchId,
      name: searchName,
      category: searchCategory,
    });
    setEquipments(equipments);
  };

  const openCategory = () => {
    if (ctgRef.current !== null && ctgRef.current !== undefined) {
      ctgRef.current.style.display = "block";
    }
  };

  const cancelCategory = () => {
    if (ctgRef.current !== null && ctgRef.current !== undefined) {
      ctgRef.current.style.display = "none";
    }
    setNewCtg({} as Category);
  };

  const saveCategory = () => {
    if (newCtg !== undefined) {
      addCategory(newCtg).then((category) => {
        setCategories([...categories, category]);
      });
      cancelCategory();
    }
  };


  const openEditCategory = () => {

  }

  const editCategory = () => {
    
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
            {equipments?.map((equipment) => (
              <tr key={equipment.id}>
                <td>{equipment.id}</td>
                <td>{equipment.name}</td>
                <td>{equipment.category_number}</td>
                <td>{equipment.daily_cost.toString()}</td>
                <td>{equipment.status === "0" ? "Available" : "Rented"}</td>
                <td>
                  <button className="btn btn-xs btn-accent btn-outline">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          
      {/* categories */}
      <div className="mt-24">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="h-[300px] w-3/4 flex justify-start flex-nowrap items-center gap-2 overflow-x-scroll">
          {categories.map((category) => (
              <div className="card group shrink-0 grow-0 h-40 w-56 bg-neutral text-neutral-content shadow-md hover:cursor-pointer hover:scale-110 transition-transform duration-300">
                <div className="card-body">
                  <div className="card-title badge badge-secondary badge-outline text-sm">
                    {category.description}
                  </div>
                  <p className="mt-4">
                    number{" "}
                    <span className="ml-2 badge badge-secondary">
                      {category.number}
                    </span>
                  </p>
                  {/* <button className="btn btn-outline btn-sm btn-square absolute bottom-4 right-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto duration-300 transition-opacity " onClick={openEditCategory}>edit</button> */}
                </div>
              </div>
          ))}
          <div className="carousel-item">
            <div
              ref={ctgRef}
              className="card shrink-0 grow-0 h-40 w-56 bg-neutral text-neutral-start shadow-md hidden"
            >
              <div className="card-body p-2 text-sm flex flex-col justify-center mt-6">
                <div className="flex items-center">
                  <p>Desc: </p>
                  <input
                    className="input input-bordered h-8 w-2/3 mr-1"
                    type="text"
                    value={newCtg?.description}
                    onChange={(e) =>
                      setNewCtg({ ...newCtg, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center">
                  <p>Number: </p>
                  <input
                    className="input input-bordered h-8 w-2/3 mr-1"
                    type="text"
                    value={newCtg?.number}
                    onChange={(e) =>
                      setNewCtg({ ...newCtg, number: e.target.value })
                    }
                  />
                </div>
                <div className="card-actions justify-evenly">
                  <button
                    className="btn btn-xs btn-error"
                    onClick={cancelCategory}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-xs btn-primary"
                    onClick={saveCategory}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div className="card shrink-0 grow-0 h-40 w-56 bg-neutral text-neutral-start shadow-md hover:cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="card-body">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={openCategory}
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
