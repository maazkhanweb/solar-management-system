// React Icons
import {
  RiDashboardLine,
  RiTeamLine,
  RiMapPinLine,
  RiArchiveLine,
  RiHistoryLine,
  RiFileList3Line,
  RiBarChartBoxLine,
} from "react-icons/ri";

const menuData = [
  {
    id: 1,
    title: "Dashboard",
    path: "/dashboard",
    icon: RiDashboardLine,
  },
  {
    id: 2,
    title: "User Management",
    path: "/users",
    icon: RiTeamLine,
  },
  {
    id: 3,
    title: "Area Management",
    path: "/areas",
    icon: RiMapPinLine,
  },
  {
    id: 4,
    title: "Inventory Management",
    path: "/inventory",
    icon: RiArchiveLine,
  },
  {
    id: 5,
    title: "Inventory Transaction History",
    path: "/inventory-transactions",
    icon: RiHistoryLine,
  },
  {
    id: 6,
    title: "Reports",
    path: "/reports",
    icon: RiBarChartBoxLine,
  },
  {
  id: 7,
  title: "Bill Management",
  path: "/bill-management",
  icon: RiFileList3Line,
},
  
];

export default menuData;