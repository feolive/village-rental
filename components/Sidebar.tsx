"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/auth";

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: "/dashboard/customer", label: "Customers", icon: "" },
    { href: "/dashboard/equipment", label: "Equipments", icon: "" },
    { href: "/dashboard/report", label: "Reports", icon: "" },
    { href: "/dashboard/chart", label: "Charts", icon: "" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white fixed left-0 top-0 p-4">
      <div className="text-2xl font-bold mb-16">Village Rental</div>
      <nav className="py-12">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="btn btn-ghost text-xl">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* <form
        onSubmit={async () => {
          await signOut();
        }}
      >
        <button type="submit" className="btn glass">
          Logout
        </button>
      </form> */}
    </div>
  );
};

export default Sidebar;
