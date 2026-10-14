import {
  RiDashboardLine,
  RiTeamLine,
  RiMapPinLine,
  RiArchiveLine,
  RiFileList3Line,
  RiBarChartBoxLine,
  RiSunLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";

const menuData = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: RiDashboardLine,
    type: "link",
  },
  {
    id: "management",
    title: "Management",
    icon: RiArchiveLine,
    type: "group",
    children: [
      { id: "users", title: "User Management", path: "/users", icon: RiTeamLine },
      { id: "areas", title: "Area Management", path: "/areas", icon: RiMapPinLine },
      { id: "inventory", title: "Inventory Management", path: "/inventory", icon: RiArchiveLine },
    ],
  },
  {
    id: "comparisons",
    title: "Comparisons",
    icon: RiBarChartBoxLine,
    type: "group",
    children: [
      { id: "bills", title: "WAPDA Bills", path: "/bill-management", icon: RiFileList3Line },
      { id: "reports", title: "Reports", path: "/reports", icon: RiBarChartBoxLine },
      { id: "ac-dc", title: "Comparison AC & DC", path: "/comparison-ac-dc", icon: RiSunLine },
      { id: "view-comparison", title: "View Comparison", path: "/dashboard?viewComparison=1", icon: RiBarChartBoxLine },
    ],
  },
];

export default menuData;
