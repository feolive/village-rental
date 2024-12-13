export default function ItemsTable({items}) {
  return (
    <div className="overflow-auto w-full h-64">
      <table className="table table-zebra">
        <thead className="sticky top-0 bg-base-100">
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Description</th>
            <th>Daily Cost</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.ctg}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.daily_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
