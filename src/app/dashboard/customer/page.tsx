export default function Customer(){
    return (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
          
          {/* Search Form */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Customer ID"
              className="input input-bordered mr-2"
              value= '1'
              
            />
            <input
              type="text"
              placeholder="Customer Name"
              className="input input-bordered mr-2"
              value= "John Doe"
              
            />
            <select
              className="select select-bordered mr-2"
              value='inactive'
            >
              <option value="">All Statuses</option>
              <option value="0">Inactive</option>
              <option value="1">Active</option>
              <option value="2">10% Discount</option>
            </select>
            <button className="btn btn-primary" >
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
                
                  {/* <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{`${customer.firstName} ${customer.lastName}`}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.status === '0' ? 'Inactive' : customer.status === '1' ? 'Active' : '10% Discount'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline">Edit</button>
                    </td>
                  </tr> */}
                
              </tbody>
            </table>
          </div>
        </div>
      );
}