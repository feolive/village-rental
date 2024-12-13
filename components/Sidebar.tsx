"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { logout } from "@/app/lib/actions";
import ThemeIcon from "@/app/ui/ThemeIcon";
import DashboardIcon from "@/app/ui/DashboardIcon";

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { href: "/dashboard/customer", label: "Customers", icon: "" },
    { href: "/dashboard/equipment", label: "Equipments", icon: "" },
    { href: "/dashboard/rental", label: "Rentals", icon: "" },
    { href: "/dashboard/chart", label: "Reports", icon: "" },
  ];

  return (
    <div className="h-screen w-64 bg-base-100 text-base-content fixed left-0 top-0 ">
      <div className="mt-2 mb-16 flex flex-col items-center gap-6">
        <div className="w-full h-10 bg-gradient-to-r from-[#6B9099] to-gray-500 rounded-badge">
          <div className="text-2xl font-bold italic ml-4 text-center">
            Village Rental
          </div>
        </div>
        <ThemeIcon theme="dim" />
      </div>
      <nav className="py-12 ml-4">
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

      <div className="absolute left-[30%] bottom-12 inset-x-auto flex justify-center content-end gap-10">
        <button
          className="btn btn-outline rounded-badge"
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}; // 6B9099  - 243033

export default Sidebar;
