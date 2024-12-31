"use client";

import { useState, useEffect, useRef } from "react";
import { Equipment, Category, EquipmentQuery } from "@/app/lib/definitions";
import {
  fetchEquipments,
  fetchCategories,
  addCategory,
} from "@/app/lib/data-brokers";
import EquipmentModal from "@/components/EquipmentModal";
import "@/app/styles/custom.css";

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<EquipmentQuery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [newCtg, setNewCtg] = useState<Category>({} as Category);

  const [displayUpdate, setDisplayUpdate] = useState(false);
  const [displayAdd, setDisplayAdd] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(
    {} as Equipment
  );
  const [currentCategory, setCurrentCategory] = useState<Category>(
    {} as Category
  );
  const ctgTargetRef = useRef(null);
  const ctgRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    allEquipments();
    fetchCategories().then((categories) => {
      setCategories(categories);
    });
    document.addEventListener("click", closeCategoryUpdate);
    return () => {
      document.removeEventListener("click", closeCategoryUpdate);
    };
  }, []);

  
  const closeCategoryUpdate = (e) => {
    if (
      ctgTargetRef.current !== null &&
      ctgTargetRef.current !== undefined &&
      e.target !== ctgTargetRef.current
    ) {
      let top = ctgTargetRef.current.offsetTop;
      let bottom = top + ctgTargetRef.current.offsetHeight;
      let left = ctgTargetRef.current.offsetLeft;
      let right = left + ctgTargetRef.current.offsetWidth;
      if (
        e.clientY >= top &&
        e.clientY <= bottom &&
        e.clientX >= left &&
        e.clientX <= right
      ) {
        return;
      }
      ctgTargetRef.current.classList.remove("active");
      ctgTargetRef.current.firstElementChild.classList.remove("gone");
      ctgTargetRef.current.lastElementChild.classList.remove("active");
      
    }
  }

  

    // document.addEventListener("click", (e) => {
    //   if (
    //     ctgTarget !== null &&
    //     ctgTarget !== undefined &&
    //     e.target !== ctgTarget
    //   ) {
    //     let top = ctgTarget.offsetTop;
    //     let bottom = top + ctgTarget.offsetHeight;
    //     let left = ctgTarget.offsetLeft;
    //     let right = left + ctgTarget.offsetWidth;
    //     if (
    //       e.clientY >= top &&
    //       e.clientY <= bottom &&
    //       e.clientX >= left &&
    //       e.clientX <= right
    //     ) {
    //       return;
    //     }
    //     ctgTarget.classList.remove("active");
    //     ctgTarget.firstElementChild.classList.remove("gone");
    //     ctgTarget.lastElementChild.classList.remove("active");
    //   }
    // });

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
      ctgRef.current.classList.add("show");
    }
  };

  const cancelCategory = () => {
    if (ctgRef.current !== null && ctgRef.current !== undefined) {
      ctgRef.current.classList.remove("show");
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

  const openAddEquipment = () => {
    setCurrentEquipment({} as Equipment);
    setDisplayAdd(true);
  };

  const openEditEquipment = (equipment: EquipmentQuery) => {
    setCurrentEquipment(convertEquipment(equipment));
    setDisplayUpdate(true);
  };

  const convertEquipment = (equipment: EquipmentQuery): Equipment => {
    return {
      id: equipment.id,
      category_number: equipment.category_number,
      name: equipment.name,
      description: equipment.description,
      daily_cost: equipment.daily_cost,
      status: equipment.status,
      rental_date: equipment.rental_date,
      return_date: equipment.return_date,
    } as Equipment;
  };

  const editCategory = (e) => {
    let element = e.target;
    if (element.tagName === "INPUT") {
      return;
    }
    if (!element.classList.contains("active")) {
      element.classList.add("active");
      element.firstElementChild.classList.add("gone");
      element.lastElementChild.classList.add("active");
      closeCategoryUpdate(e);
      ctgTargetRef.current = e.target;
    }
  };

  

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
          {categories?.map((category) => (
            <option key={category.number} value={category.number}>
              {category.description}
            </option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
        <button className="ml-28 btn btn-primary" onClick={openAddEquipment}>
          Add Equipment
        </button>
      </div>
      <EquipmentModal
        display={displayAdd}
        displayStatus={setDisplayAdd}
        equipment={{} as Equipment}
        isUpdate={false}
        categories={categories}
      />

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
                <td>
                  <div className="badge badge-secondary badge-outline">
                    {equipment.ctg}
                  </div>
                </td>
                <td>{equipment.daily_cost.toString()}</td>
                <td>
                  {equipment.status?.trim() === "0" ? "Available" : "Rented"}
                </td>
                <td>
                  <button
                    className="btn btn-xs btn-accent btn-outline"
                    onClick={() => openEditEquipment(equipment)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EquipmentModal
        display={displayUpdate}
        displayStatus={setDisplayUpdate}
        equipment={currentEquipment}
        isUpdate={true}
        categories={categories}
      />

      {/* categories */}
      <div className="mt-24">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <div className="h-[300px] w-3/4 flex justify-start flex-nowrap items-center gap-2 overflow-x-scroll">
          {categories?.map((category) => (
            <div
              id={"ctg_" + category.number}
              className="category-card"
              key={category.number}
              onClick={(e) => editCategory(e)}
            >
              <div className="category-display">
                <div className="card-title badge badge-secondary badge-outline text-sm">
                  {category.description}
                </div>
                <p className="mt-4">
                  number{" "}
                  <span className="ml-2 badge badge-secondary">
                    {category.number}
                  </span>
                </p>
              </div>
              <div className="category-update">
                <input
                  className="input input-bordered h-8 w-2/3 mr-1 ctg-input"
                  type="text"
                  value={category.description}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      description: e.target.value,
                    })
                  }
                />
                <input
                  className="input input-bordered h-8 w-2/3 mr-1 ctg-input"
                  type="text"
                  value={category.number}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      number: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ))}
          <div className="carousel-item">
            <div
              ref={ctgRef}
              className="card shrink-0 grow-0 h-40 w-56 bg-neutral text-neutral-start shadow-md new-card"
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
          {/* add category */}
          {  categories && 
          <div className="carousel-item" id="add-btn">
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
          </div>}
        </div>
      </div>
    </div>
  );
}
