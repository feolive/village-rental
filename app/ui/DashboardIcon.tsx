import Image from "next/image";

export default function DashboardIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/dashboard.svg"
      alt="dashboard icon"
      width={24}
      height={24}
      className={className}
    />
  );
}
