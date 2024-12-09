"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { logout } from "@/app/lib/actions";
import { log } from "console";

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
      <form className="absolute bottom-8 inset-x-1/3" onSubmit={async (e) => { e.preventDefault();  await logout(); }}>
        <button type="submit" className="btn btn-outline">
          Logout
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
