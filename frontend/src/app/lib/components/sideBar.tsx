'use client';
import sidebarStyles from "../../styles/sidebar.module.css";
import { useAuth } from "@/app/context/authContext";

const sidebarLinks = [
  { label: "Overview", href: "/" },
  { label: "Predictive Inventory", href: "/predictive_inv" },
  { label: "Maintenance Engine", href: "/predictive_maintenance" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const { user } = useAuth();
  return (
    <aside className={sidebarStyles.sidebar}>
      <div className={sidebarStyles.logo}>
        <span className={sidebarStyles.logoText}>RedLaunch</span>
      </div>
      <nav className={sidebarStyles.nav}>
        {sidebarLinks.map((link) => (
          <a key={link.href} href={link.href} className={sidebarStyles.navLink}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className={sidebarStyles.sidebarFooter}>
        <span className={sidebarStyles.userName}>
          {user ? user.name : "Guest"}
        </span>
        <span className={sidebarStyles.userEmail}>
          {user ? user.email : ""}
        </span>
      </div>
    </aside>
  );
}