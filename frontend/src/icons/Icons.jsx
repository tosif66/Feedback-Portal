import { Home, Users, PieChart, BarChart, Users2 } from "lucide-react";
import MainDash from '../dashboard/MainDash';
import Cards from '../dashboard/Cards';
import UserTable from '../components/UserTable';
import Analytics from "../components/Analytics";
import FeedbackTable from "../components/FeedbackTable";
import AdminTable from "../components/AdminTable";

export const SidebarData = (isSuperAdmin) => {
  let baseSidebar = [
    { icon: Home, heading: 'Dashboard', component: MainDash },
    { icon: Users, heading: 'Feedback', component: FeedbackTable },
    { icon: BarChart, heading: 'Users', component: UserTable },
    { icon: PieChart, heading: 'Analytics', component: Analytics },
  ];

  return isSuperAdmin
    ? [...baseSidebar, { icon: Users2, heading: 'Manage Admins', component: AdminTable }]
    : baseSidebar;
};