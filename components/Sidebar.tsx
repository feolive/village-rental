"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { logout } from "@/app/lib/actions";

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: "/dashboard/customer", label: "Customers", icon: "" },
    { href: "/dashboard/equipment", label: "Equipments", icon: "" },
    { href: "/dashboard/chart", label: "Reports", icon: "" },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-neutral-content fixed left-0 top-0 p-4">
      <div className="text-2xl font-bold mt-4 mb-16 italic">Village Rental</div>
      <nav className="py-12">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={clsx("btn btn-ghost text-xl", {
                  "btn-active": pathname === item.href,
                })}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button className="absolute bottom-12 inset-x-1/3 btn btn-outline rounded-badge" onClick={async () => { await logout(); }}>Logout</button>
    </div>
  );
}; // 6B9099  - 243033

export default Sidebar;
