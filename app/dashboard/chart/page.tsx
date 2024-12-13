"use client";

import { useState, useEffect } from "react";
import DateSalesChart from "@/components/DateSalesChart";
import CustomerSalesChart from "@/components/CustomerSalesChart";
import * as Broker from "@/app/lib/data-brokers";
import ItemsTable from "@/components/ItemsTable";
import { NextRequest, NextResponse } from "next/server";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportPage() {
  const [salesByDate, setSalesByDate] = useState<any>();
  const [salesByCustomer, setSalesByCustomer] = useState<any>({});
  const [itemsByCategory, setItemsByCategory] = useState<any[]>([]);

  useEffect(() => {
    fetchSalesByDate();
    fetchSalesByCustomer();
    fetchItemsByCategory();
  }, []);

  const fetchSalesByDate = async () => {
    const data = await Broker.fetchSalesByDate();
    let sales = {
      labels: [],
      data: [],
    };
    data.forEach((item: any) => {
      sales.labels.push(item.create_date);
      sales.data.push(item.total);
    });
    setSalesByDate(sales);
  };

  const fetchSalesByCustomer = async () => {
    const data = await Broker.fetchSalesByCustomer();
    let sales = {
      labels: [],
      data: [],
    };
    data.forEach((item: any) => {
      sales.labels.push(item.name);
      sales.data.push(item.total);
    });
    setSalesByCustomer(sales);
  };

  const fetchItemsByCategory = async () => {
    const data = await Broker.fetchItemsByCategory();
    let items = []
      
    data.forEach((item: any) => {
      let obj = {
        id: item.id,
        ctg: item.ctg,
        name: item.name,
        description: item.description,
        daily_cost: item.daily_cost
      }
      items.push(obj)
    });
    setItemsByCategory(items);
  };

  const handleDownload = async (type: number, data: any) => {
    if (type === 1) {
      let csv = 'Date,Sales\n';
      let labels = data.labels;
      for (let i = 0; i < labels.length; i++) {
        csv += `${labels[i]},${data.data[i]}\n`;
      }
      let filename = `sales-by-date-${new Date().toLocaleDateString()}.csv`;
      exportData(csv, filename);
    }else if(type === 2){
      let csv ='name,sales\n';
      let labels = data.labels;
      for (let i = 0; i < labels.length; i++) {
        csv += `${labels[i]},${data.data[i]}\n`;
      }
      let filename = `sales-by-customer-${new Date().toLocaleDateString()}.csv`;
      exportData(csv, filename);
    }else if(type === 3){
      let csv = 'Category,Name,Description,Daily Cost\n';
      for (let i = 0; i < data.length; i++) {
        csv += `${data[i].ctg},${data[i].name},${data[i].description},${data[i].daily_cost}\n`;
      }
      let filename = `items-by-category-${new Date().toLocaleDateString()}.csv`;
      exportData(csv, filename);
    }else{

    }
  };

  const exportData = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Reports</h1>
      <div className="container flex flex-col gap-8 mx-auto p-4">
        <div className="flex flex-row items-center gap-8">
          <div className="card bg-base-200 w-1/3 py-10 mb-4 place-items-center shadow-sm shadow-neutral-content hover:transition ease-in-out hover:scale-110 duration-1000">
            <div className="card-body flex flex-row justify-start items-center gap-8">
              
              <p className="underline underline-offset-4">Sales by Date</p>
              <button
                onClick={() => handleDownload(1, salesByDate)}
                className="btn btn-sm btn-primary"
              >
                Export
              </button>
            </div>
            <div className="card-body">
              <DateSalesChart sales={salesByDate} />
            </div>
          </div>

          <div className="card bg-base-200 w-1/3 py-10 mb-4 place-items-center shadow-sm shadow-neutral-content hover:transition ease-in-out hover:scale-110 duration-1000">
            <div className="card-body flex-row justify-center items-center gap-8">
              <p className="underline underline-offset-4">Sales by Customer</p>
              <button
                onClick={() => handleDownload(2, salesByCustomer)}
                className="btn btn-sm btn-primary"
              >
                Export
              </button>
            </div>
            <div className="card-body">
              <CustomerSalesChart sales={salesByCustomer}/>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 w-1/2 h-1/3 py-10 mb-4 place-items-center shadow-sm shadow-neutral-content hover:transition ease-in-out hover:scale-110 duration-1000">
          <div className="card-body flex-row justify-start items-center gap-8">
            <p className="underline underline-offset-4">Items by Category</p>
            <button
              onClick={() => handleDownload(3, itemsByCategory)}
              className="btn btn-sm btn-primary"
            >
              Export
            </button>
          </div>
          <div className="card-body">
            <ItemsTable items={itemsByCategory} />
          </div>
        </div>
      </div>
    </>
  );
}
