'use client'

import { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
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
} from 'chart.js'



export default function ReportPage() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  )
  
  const [salesByDate, setSalesByDate] = useState<any>({})
  const [salesByCustomer, setSalesByCustomer] = useState<any>({})
  const [itemsByCategory, setItemsByCategory] = useState<any[]>([])
  const [dateRange, setDateRange] = useState('week')

  useEffect(() => {
    fetchSalesByDate()
    fetchSalesByCustomer()
    fetchItemsByCategory()
  }, [dateRange])

  const fetchSalesByDate = async () => {
    const response = await fetch(`/api/report/sales-by-date?range=${dateRange}`)
    const data = await response.json()
    setSalesByDate(data)
  }

  const fetchSalesByCustomer = async () => {
    const response = await fetch('/api/report/sales-by-customer')
    const data = await response.json()
    setSalesByCustomer(data)
  }

  const fetchItemsByCategory = async () => {
    const response = await fetch('/api/report/items-by-category')
    const data = await response.json()
    setItemsByCategory(data)
  }

  const handleDownload = (chartType: string) => {
    // Implement download logic here
    // console.log(`Downloading ${chartType} chart`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Sales by Date */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Sales by Date</h2>
        <div className="mb-2">
          <select
            className="select select-bordered"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
          <button className="btn btn-primary ml-2" onClick={() => handleDownload('sales-by-date')}>
            Download
          </button>
        </div>
        <Line data={salesByDate} />
      </div>

      {/* Sales by Customer */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Sales by Customer</h2>
        <button className="btn btn-primary mb-2" onClick={() => handleDownload('sales-by-customer')}>
          Download
        </button>
        <div style={{ height: '400px', overflowY: 'scroll' }}>
          <Bar data={salesByCustomer} options={{ indexAxis: 'y' }} />
        </div>
      </div>

      {/* Items by Category */}
      <div>
        <h2 className="text-xl font-bold mb-2">Items by Category</h2>
        <button className="btn btn-primary mb-2" onClick={() => handleDownload('items-by-category')}>
          Download
        </button>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Daily Cost</th>
              </tr>
            </thead>
            <tbody>
              {itemsByCategory.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.dailyCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}