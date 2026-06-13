"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { 
  Leaf, 
  LogOut, 
  Users, 
  CreditCard, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Menu, 
  X,
  LayoutDashboard,
  UserCheck,
  TrendingUp,
  CheckCircle,
  Clock,
  RefreshCw,
  Award,
  Eye,
  Calendar,
  Activity,
  Sprout,
  Check,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/ToastProvider";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  amountPaid: number;
  paymentStatus: "Completed" | "Pending" | "Failed";
  dateJoined: string;
  weightKg: number;
  cropStage: "Seedling" | "Growing" | "Mature" | "Harvested";
  address: string;
}

interface ActivityLog {
  id: string;
  type: "booking" | "payment" | "stage_change" | "system";
  message: string;
  time: string;
  user: string;
  badgeColor: string;
}

const mockUsers: UserRecord[] = [];
const initialActivities: ActivityLog[] = [];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Completed" | "Pending" | "Failed">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [usersList, setUsersList] = useState<UserRecord[]>(mockUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>(initialActivities);
  const [hoveredChartPoint, setHoveredChartPoint] = useState<number | null>(null);
  
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const itemsPerPage = 6;
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Tab switch animation via GSAP
  useEffect(() => {
    if (tabContentRef.current) {
      gsap.killTweensOf(tabContentRef.current);
      gsap.fromTo(
        tabContentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const handleSingleDelete = async (orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderIds: [orderId] })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsersList(prev => prev.filter(u => u.id !== orderId));
        setSelectedUserIds(prev => prev.filter(id => id !== orderId));
      } else {
        showToast(data.message || "Failed to delete order.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("An error occurred while deleting the order.", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete the selected ${selectedUserIds.length} orders? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/orders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderIds: selectedUserIds })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsersList(prev => prev.filter(u => !selectedUserIds.includes(u.id)));
        setSelectedUserIds([]);
        showToast("Successfully deleted the selected records.", "success");
      } else {
        showToast(data.message || "Failed to delete selected records.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("An error occurred while deleting the records.", "error");
    }
  };

  // Session verification on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    if (userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  // Helper to format time ago
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 0) return "Just now";
      if (seconds < 60) return "Just now";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} mins ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} hours ago`;
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    } catch (err) {
      return "Recently";
    }
  };

  // Fetch real orders from database
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/orders`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.orders)) {
            // Map MongoDB orders to UserRecord interface
            const fetchedUsers = data.orders.map((order: any): UserRecord => {
              let cropStage: "Seedling" | "Growing" | "Mature" | "Harvested" = "Growing";
              if (order.status === "received" || order.status === "cancelled") {
                cropStage = "Seedling";
              } else if (order.status === "processing") {
                cropStage = "Growing";
              } else if (order.status === "shipped") {
                cropStage = "Mature";
              } else if (order.status === "delivered") {
                cropStage = "Harvested";
              }

              let paymentStatus: "Completed" | "Pending" | "Failed" = "Pending";
              if (order.paymentStatus === "paid") {
                paymentStatus = "Completed";
              } else if (order.paymentStatus === "failed") {
                paymentStatus = "Failed";
              }

              const weightKg = order.items ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) : 0;
              
              const addressParts = [
                order.shipping?.address,
                order.shipping?.city,
                order.shipping?.state,
                order.shipping?.pincode
              ].filter(Boolean);
              const address = addressParts.join(", ");

              return {
                id: order.orderId || order._id,
                name: order.customer?.name || "Unknown Customer",
                email: order.customer?.email || "",
                phone: order.customer?.mobile || "",
                amountPaid: order.financials?.total || 0,
                paymentStatus,
                dateJoined: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                weightKg: weightKg || 5.0,
                cropStage,
                address
              };
            });

            setUsersList(fetchedUsers);

            // Add activities for real orders
            const newActivities: ActivityLog[] = [];
            data.orders.slice(0, 5).forEach((order: any) => {
              const orderId = order.orderId || order._id;
              const weightKg = order.items ? order.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) : 0;
              const name = order.customer?.name || "Customer";
              const timeString = formatTimeAgo(order.createdAt);

              newActivities.push({
                id: `booking-${order._id}`,
                type: "booking",
                message: `Order ID ${orderId} placed by ${name} (${weightKg || 5.0}kg Jaggery Plan)`,
                time: timeString,
                user: name,
                badgeColor: "bg-amber-100 text-amber-800"
              });

              if (order.paymentStatus === "paid") {
                newActivities.push({
                  id: `payment-${order._id}`,
                  type: "payment",
                  message: `Payment of ₹${order.financials?.total} completed successfully for Order ID ${orderId}`,
                  time: timeString,
                  user: name,
                  badgeColor: "bg-emerald-100 text-emerald-800"
                });
              }
            });

            setActivities(newActivities);
          }
        }
      } catch (error) {
        console.error("Failed to fetch real orders:", error);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

  const totalRevenue = useMemo(() => {
    return usersList
      .filter(u => u.paymentStatus === "Completed")
      .reduce((sum, u) => sum + u.amountPaid, 0);
  }, [usersList]);

  const stats = useMemo(() => [
    {
      id: "users",
      label: "Total Users",
      value: `${usersList.length}`,
      trend: "+12.3% from last month",
      icon: Users,
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-500",
      accent: "#b45309",
      percentage: usersList.length > 0 ? "75%" : "0%"
    },
    {
      id: "payments",
      label: "Payments Completed",
      value: `${usersList.filter(u => u.paymentStatus === "Completed").length}`,
      trend: "+8.4% from last month",
      icon: UserCheck,
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-500",
      accent: "#047857",
      percentage: usersList.filter(u => u.paymentStatus === "Completed").length > 0 ? "68%" : "0%"
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      trend: "+15.2% from last month",
      icon: CreditCard,
      color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-500",
      accent: "#4338ca",
      percentage: totalRevenue > 0 ? "88%" : "0%"
    },
  ], [usersList, totalRevenue]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || user.paymentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [usersList, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExportExcel = () => {
    const dataToExport = filteredUsers.map(({ name, email, phone, amountPaid, paymentStatus, dateJoined, id, weightKg, cropStage, address }) => ({
      "Name": name,
      "Email": email,
      "Phone": phone,
      "Order ID": id,
      "Weight (kg)": weightKg,
      "Amount Paid (INR)": amountPaid,
      "Payment Status": paymentStatus,
      "Crop Stage": cropStage,
      "Date Joined": dateJoined,
      "Shipping Address": address,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    // Auto-fit columns
    const maxLens = dataToExport.reduce((acc, row) => {
      Object.keys(row).forEach((key) => {
        const val = row[key as keyof typeof row]?.toString() || "";
        acc[key] = Math.max(acc[key] || 0, val.length, key.length);
      });
      return acc;
    }, {} as Record<string, number>);
    worksheet["!cols"] = Object.keys(maxLens).map((key) => ({ wch: maxLens[key] + 3 }));

    XLSX.writeFile(workbook, "Krushisarthi_Users_Payments.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Krushisarthi - Users Payment & Farm Plot Report", 14, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 26);
    doc.text(`Total Records: ${filteredUsers.length}`, 14, 31);
    
    autoTable(doc, {
      startY: 38,
      head: [["Name", "Email", "Order ID", "Weight", "Amount", "Status", "Crop Stage"]],
      body: filteredUsers.map(u => [
        u.name,
        u.email,
        u.id,
        `${u.weightKg} kg`,
        `Rs. ${u.amountPaid}`,
        u.paymentStatus,
        u.cropStage
      ]),
      headStyles: { fillColor: [120, 53, 15] },
      styles: { font: "helvetica", fontSize: 9 },
      alternateRowStyles: { fillColor: [247, 244, 237] }
    });

    doc.save("Krushisarthi_Users_Report.pdf");
  };

  // Crop Stage distribution totals
  const cropDistribution = useMemo(() => {
    const counts = { Seedling: 0, Growing: 0, Mature: 0, Harvested: 0 };
    let totalWeight = 0;
    usersList.forEach(u => {
      if (counts[u.cropStage] !== undefined) {
        counts[u.cropStage]++;
      }
      totalWeight += u.weightKg;
    });
    return { ...counts, totalWeight };
  }, [usersList]);

  // Dynamically compute chartData based on usersList / real orders
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const base = [
      { name: "Jan", revenue: 0, bookings: 0 },
      { name: "Feb", revenue: 0, bookings: 0 },
      { name: "Mar", revenue: 0, bookings: 0 },
      { name: "Apr", revenue: 0, bookings: 0 },
      { name: "May", revenue: 0, bookings: 0 },
      { name: "Jun", revenue: 0, bookings: 0 }
    ];

    usersList.forEach(u => {
      try {
        const d = new Date(u.dateJoined);
        const m = d.getMonth();
        if (m >= 0 && m < 12) {
          const monthName = months[m];
          const found = base.find(b => b.name === monthName);
          if (found) {
            if (u.paymentStatus === "Completed") {
              found.revenue += u.amountPaid;
            }
            found.bookings += 1;
          } else {
            base.push({
              name: monthName,
              revenue: u.paymentStatus === "Completed" ? u.amountPaid : 0,
              bookings: 1
            });
          }
        }
      } catch (err) {
        // ignore
      }
    });

    return base;
  }, [usersList]);

  // SVG Chart rendering details
  const padding = 40;
  const chartWidth = 500;
  const chartHeight = 200;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  const maxVal = useMemo(() => {
    const maxRev = Math.max(...chartData.map(d => d.revenue), 10000);
    return Math.ceil(maxRev / 10000) * 10000;
  }, [chartData]);

  const points = useMemo(() => {
    return chartData.map((d, index) => {
      const x = padding + (index / (chartData.length - 1)) * graphWidth;
      const y = chartHeight - padding - (d.revenue / maxVal) * graphHeight;
      return { x, y, val: d.revenue, label: d.name, bookings: d.bookings };
    });
  }, [chartData, maxVal, graphWidth, graphHeight]);

  const linePath = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const start = `M ${points[0].x} ${chartHeight - padding}`;
    const line = points.map(p => `L ${p.x} ${p.y}`).join(" ");
    const end = `L ${points[points.length - 1].x} ${chartHeight - padding} Z`;
    return `${start} ${line} ${end}`;
  }, [points]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center antialiased">
        <div className="flex flex-col items-center gap-3 bg-white border border-stone-200 p-8 rounded-2xl shadow-sm text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#78350f]" />
          <p className="text-sm font-semibold text-stone-700">Verifying session security...</p>
          <p className="text-[10px] text-stone-400">Ensuring proper authorization before granting portal access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col text-stone-800 antialiased font-sans">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-stone-200/60 shadow-sm transition-all">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-stone-700" /> : <Menu className="w-5 h-5 text-stone-700" />}
            </button>
            <div className="flex items-center gap-2.5 font-bold tracking-tight text-[#78350f] text-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-800/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#78350f]" />
              </div>
              <span className="bg-gradient-to-r from-amber-900 to-amber-700 bg-clip-text text-transparent">Krushisarthi</span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full ml-1 uppercase tracking-wider">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border-r border-stone-200 pr-4">
              <div className="w-8 h-8 rounded-full bg-amber-800 text-amber-50 font-bold flex items-center justify-center text-xs shadow-inner uppercase">
                {adminUser?.name ? adminUser.name.split(" ").map(n => n[0]).join("") : "A"}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-stone-900 leading-3">{adminUser?.name || "Super Admin"}</span>
                <span className="text-[10px] text-stone-400">{adminUser?.email || "admin@krushisarthi.com"}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.8 border border-stone-200 rounded-lg text-xs font-medium bg-white hover:bg-stone-50 hover:border-stone-300 transition-all text-stone-600 hover:text-stone-900 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 max-w-[1600px] w-full mx-auto relative">
        
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-stone-200/60 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block pt-16 lg:pt-8
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="px-4 space-y-7">
            <div>
              <p className="px-3 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Management</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("overview");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${activeTab === "overview" ? "bg-amber-800/10 text-amber-950 shadow-sm border-l-4 border-amber-800 pl-2" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 border-l-4 border-transparent"}`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("users");
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${activeTab === "users" ? "bg-amber-800/10 text-amber-950 shadow-sm border-l-4 border-amber-800 pl-2" : "text-stone-500 hover:text-stone-900 hover:bg-stone-100/50 border-l-4 border-transparent"}`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users & Payments</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-stone-900/30 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-x-hidden w-full max-w-[1250px] mx-auto">
          <div ref={tabContentRef} className="w-full space-y-8">
            {/* TAB 1: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
                <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none translate-x-12">
                  <Leaf className="w-64 h-64 rotate-12" />
                </div>
                <div className="relative z-10 max-w-xl">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
                    Welcome Back, Super Admin!
                  </h1>
                  <p className="text-xs md:text-sm text-stone-200 font-light leading-relaxed">
                    Here is the general health report of the Krushisarthi user payments, organic jaggery production cycles, and platform statistics.
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.id}
                      className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-stone-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</span>
                        <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold tracking-tight text-stone-900 mt-3">{stat.value}</div>
                      
                      {/* Interactive visual line sparkline */}
                      <div className="mt-3.5 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            backgroundColor: stat.accent,
                            width: stat.percentage 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visual Insights Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Revenue Chart */}
                <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs lg:col-span-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        Financial Overview & Bookings
                      </h3>
                      <p className="text-[10px] text-stone-400">Total monthly revenue growth and user order plans</p>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/40">
                      Jan - Jun 2026
                    </span>
                  </div>

                  {/* SVG Canvas */}
                  <div className="relative w-full h-[190px] flex items-center justify-center select-none">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#78350f" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#78350f" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
                        const y = padding + r * graphHeight;
                        return (
                          <line
                            key={i}
                            x1={padding}
                            y1={y}
                            x2={chartWidth - padding}
                            y2={y}
                            stroke="#e7e5e4"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                        );
                      })}

                      {/* Area Fill */}
                      <path d={areaPath} fill="url(#areaGrad)" />

                      {/* Trend Line */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#78350f"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interaction Area & Data Points */}
                      {points.map((p, i) => (
                        <g key={i}>
                          {/* Inner Dot */}
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={hoveredChartPoint === i ? "6" : "4"}
                            fill={hoveredChartPoint === i ? "#78350f" : "#ffffff"}
                            stroke="#78350f"
                            strokeWidth="2.5"
                            className="transition-all duration-200 cursor-pointer"
                            onMouseEnter={() => setHoveredChartPoint(i)}
                            onMouseLeave={() => setHoveredChartPoint(null)}
                          />
                          {/* Month Label */}
                          <text
                            x={p.x}
                            y={chartHeight - padding + 15}
                            textAnchor="middle"
                            fill="#878685"
                            fontSize="9"
                            fontWeight="bold"
                          >
                            {p.label}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Chart Tooltip Overlay */}
                    {hoveredChartPoint !== null && (
                      <div 
                        className="absolute bg-stone-900 text-white rounded-lg p-2 text-[10px] shadow-lg pointer-events-none z-10 border border-stone-700/60 animate-in fade-in zoom-in-95 duration-100"
                        style={{
                          left: `${(points[hoveredChartPoint].x / chartWidth) * 100}%`,
                          top: `${(points[hoveredChartPoint].y / chartHeight) * 80}%`,
                          transform: "translate(-50%, -110%)"
                        }}
                      >
                        <p className="font-bold border-b border-stone-700 pb-1 mb-1 text-amber-400 uppercase tracking-wider">{chartData[hoveredChartPoint].name} 2026</p>
                        <p className="flex justify-between gap-4"><span>Revenue:</span> <span className="font-extrabold text-white">₹{chartData[hoveredChartPoint].revenue.toLocaleString()}</span></p>
                        <p className="flex justify-between gap-4"><span>Bookings:</span> <span className="font-extrabold text-white">{chartData[hoveredChartPoint].bookings} users</span></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="bg-white border border-stone-200/60 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#78350f]" />
                      Recent Activity Stream
                    </h3>
                    <p className="text-[10px] text-stone-400">Live system updates, plot updates, and payment alerts</p>
                  </div>
                  <button 
                    onClick={() => setActivities(initialActivities)}
                    className="p-1 text-stone-400 hover:text-stone-800 transition-colors"
                    title="Reset list"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100">
                  {activities.map((log) => {
                    let IconComp = Sprout;
                    if (log.type === "payment") IconComp = CreditCard;
                    if (log.type === "booking") IconComp = Calendar;
                    if (log.type === "system") IconComp = Activity;

                    return (
                      <div key={log.id} className="py-3.5 flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                            <IconComp className="w-4 h-4 text-stone-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-stone-800 truncate group-hover:text-stone-950 transition-colors">{log.message}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-stone-400">{log.time}</span>
                              <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                              <span className="text-[10px] font-semibold text-stone-500">{log.user}</span>
                            </div>
                          </div>
                        </div>

                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${log.badgeColor}`}>
                          {log.type}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Users & Payments */}
          {activeTab === "users" && (
            <div className="space-y-6">
              
              {/* Toolbar Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#78350f]" />
                    Registered Users & Orders
                  </h2>
                  <p className="text-xs text-stone-400">Manage payment details, plot allocation, and crop cycles.</p>
                </div>
                
                {/* Export Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportExcel}
                    className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-600 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-400" />
                    <span>Export Excel</span>
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-600 transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-400" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Bulk Actions Panel */}
              {selectedUserIds.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 px-4 flex items-center justify-between animate-in slide-in-from-top duration-300">
                  <div className="flex items-center gap-2 text-rose-950 text-xs font-semibold">
                    <span className="bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                      {selectedUserIds.length}
                    </span>
                    <span>users/orders selected</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkDelete}
                      className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Selected
                    </button>
                    <button
                      onClick={() => setSelectedUserIds([])}
                      className="px-3 py-1.5 border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 text-xs font-bold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Filters Block */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                
                {/* Status Tabs */}
                <div className="flex border border-stone-200/80 bg-white p-1 rounded-xl w-full sm:w-auto">
                  {(["All", "Completed", "Pending", "Failed"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === status ? "bg-[#78350f] text-white shadow-xs" : "text-stone-500 hover:text-stone-800 hover:bg-stone-50"}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs border border-stone-200 bg-white px-3 py-2 rounded-xl flex items-center gap-2 focus-within:border-stone-400 transition-colors shadow-xs">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input 
                    type="text"
                    placeholder="Search name, email, order ID..."
                    className="w-full bg-transparent focus:outline-none text-xs text-stone-900 placeholder:text-stone-400"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="p-0.5 rounded-full hover:bg-stone-100 text-stone-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-stone-200/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50/75 border-b border-stone-200 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        <th className="p-4 pl-6 w-10">
                          <input 
                            type="checkbox" 
                            className="rounded border-stone-300 text-[#78350f] focus:ring-[#78350f] focus:ring-offset-0 cursor-pointer" 
                            checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id))}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUserIds(filteredUsers.map(u => u.id));
                              } else {
                                setSelectedUserIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-4">User / Contact</th>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Jaggery Weight</th>
                        <th className="p-4">Amount Paid</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Crop Stage</th>
                        <th className="p-4 pr-6 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => {
                          const initials = user.name.split(" ").map(n => n[0]).join("").slice(0, 2);
                          
                          // Set color themes based on status
                          let badgeTheme = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
                          let dotColor = "bg-emerald-600";
                          if (user.paymentStatus === "Pending") {
                            badgeTheme = "bg-amber-50 text-amber-700 border-amber-200/60";
                            dotColor = "bg-amber-500";
                          } else if (user.paymentStatus === "Failed") {
                            badgeTheme = "bg-rose-50 text-rose-700 border-rose-200/60";
                            dotColor = "bg-rose-600";
                          }

                          let cropBadge = "bg-stone-100 text-stone-700";
                          if (user.cropStage === "Seedling") cropBadge = "bg-emerald-50 text-emerald-700 border border-emerald-100";
                          if (user.cropStage === "Growing") cropBadge = "bg-blue-50 text-blue-700 border border-blue-100";
                          if (user.cropStage === "Mature") cropBadge = "bg-amber-50 text-amber-700 border border-amber-100";
                          if (user.cropStage === "Harvested") cropBadge = "bg-stone-200 text-stone-800 border border-stone-300";

                          return (
                            <tr key={user.id} className={`hover:bg-stone-50/60 transition-colors ${selectedUserIds.includes(user.id) ? "bg-amber-50/30" : ""}`}>
                              <td className="p-4 pl-6 w-10">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-stone-300 text-[#78350f] focus:ring-[#78350f] focus:ring-offset-0 cursor-pointer" 
                                  checked={selectedUserIds.includes(user.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedUserIds(prev => [...prev, user.id]);
                                    } else {
                                      setSelectedUserIds(prev => prev.filter(id => id !== user.id));
                                    }
                                  }}
                                />
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-amber-800/10 text-amber-950 font-bold flex items-center justify-center text-xs shadow-inner">
                                    {initials}
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="font-semibold text-stone-900 leading-4">{user.name}</span>
                                    <span className="text-[10px] text-stone-400">{user.email} • {user.phone}</span>
                                    <span className="text-[9px] text-stone-500 font-light truncate max-w-[200px]" title={user.address}>{user.address}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 font-mono font-bold text-stone-600">{user.id}</td>
                              <td className="p-4 font-medium text-stone-800">{user.weightKg.toFixed(1)} kg</td>
                              <td className="p-4 font-bold text-stone-950">₹{user.amountPaid.toLocaleString()}</td>
                              <td className="p-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${badgeTheme}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                                  {user.paymentStatus}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${cropBadge}`}>
                                  {user.cropStage}
                                </span>
                              </td>
                              <td className="p-4 pr-6 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => setSelectedUser(user)}
                                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-[#78350f] hover:border-stone-300 transition-all shadow-xs"
                                    title="View User Details"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleSingleDelete(user.id)}
                                    className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-all shadow-xs"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-stone-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Search className="w-6 h-6 text-stone-300" />
                              <span>No matching users found matching your filters.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {totalPages > 1 && (
                  <div className="p-4 px-6 border-t border-stone-200/60 bg-stone-50/50 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-stone-400">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 border border-stone-200 bg-white rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-xs"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-stone-600" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 border border-stone-200 bg-white rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white shadow-xs"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* MODAL: User Detail Slide-over */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div 
            onClick={() => setSelectedUser(null)}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs"
          />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              {/* User Identity */}
              <div className="flex items-center gap-4 border-b border-stone-100 pb-5">
                <div className="w-14 h-14 rounded-full bg-amber-800 text-amber-50 font-bold flex items-center justify-center text-lg shadow-inner">
                  {selectedUser.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-stone-900">{selectedUser.name}</h3>
                  <p className="text-xs text-stone-500">{selectedUser.email}</p>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">{selectedUser.phone}</p>
                </div>
              </div>

              {/* Order Plan Summary */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200/50">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest border-b border-stone-200 pb-1.5">Order Details</h4>
                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-stone-400 block">Order ID</span>
                    <span className="font-mono font-bold text-stone-800 break-all">{selectedUser.id}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Jaggery Target</span>
                    <span className="font-bold text-stone-800">{selectedUser.weightKg} kg</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Amount Paid</span>
                    <span className="font-bold text-stone-950">₹{selectedUser.amountPaid.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Date Joined</span>
                    <span className="font-bold text-stone-800">{selectedUser.dateJoined}</span>
                  </div>
                </div>
                <div className="border-t border-stone-200 pt-2 text-xs">
                  <span className="text-stone-400 block">Shipping Address</span>
                  <span className="font-semibold text-stone-800 leading-relaxed block mt-0.5">{selectedUser.address || "N/A"}</span>
                </div>
              </div>

              {/* Crop Tracking timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-widest">Crop Stage Cycle</h4>
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-8">
                  
                  {/* Seedling Stage */}
                  <div className="relative">
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-white ${
                      selectedUser.cropStage === "Seedling" || selectedUser.cropStage === "Growing" || selectedUser.cropStage === "Mature" || selectedUser.cropStage === "Harvested"
                      ? "bg-emerald-600 border-emerald-600" : "bg-white border-stone-300 text-stone-400"
                    }`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">Seedling Stage</p>
                      <p className="text-[10px] text-stone-400">Sugarcane stalks selected, rooted, and planted in organic nutrients.</p>
                    </div>
                  </div>

                  {/* Growing Stage */}
                  <div className="relative">
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedUser.cropStage === "Growing" || selectedUser.cropStage === "Mature" || selectedUser.cropStage === "Harvested"
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : selectedUser.cropStage === "Seedling" 
                      ? "bg-amber-500 border-amber-500 text-white animate-pulse" 
                      : "bg-white border-stone-300 text-stone-400"
                    }`}>
                      {selectedUser.cropStage === "Growing" || selectedUser.cropStage === "Mature" || selectedUser.cropStage === "Harvested" ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : selectedUser.cropStage === "Seedling" ? (
                        <Clock className="w-2.5 h-2.5 text-white" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">Growing Stage</p>
                      <p className="text-[10px] text-stone-400">Sunlight absorption, active drip-irrigation, and organic compost feed cycles.</p>
                    </div>
                  </div>

                  {/* Mature Stage */}
                  <div className="relative">
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedUser.cropStage === "Mature" || selectedUser.cropStage === "Harvested"
                      ? "bg-emerald-600 border-emerald-600 text-white" 
                      : selectedUser.cropStage === "Growing" 
                      ? "bg-amber-500 border-amber-500 text-white animate-pulse" 
                      : "bg-white border-stone-300 text-stone-400"
                    }`}>
                      {selectedUser.cropStage === "Mature" || selectedUser.cropStage === "Harvested" ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : selectedUser.cropStage === "Growing" ? (
                        <Clock className="w-2.5 h-2.5 text-white" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">Mature / Ripened</p>
                      <p className="text-[10px] text-stone-400">Sugarcane reaches peaks sucrose concentration. Ready for hand harvesting.</p>
                    </div>
                  </div>

                  {/* Harvested Stage */}
                  <div className="relative">
                    <div className={`absolute -left-[27px] w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedUser.cropStage === "Harvested"
                      ? "bg-[#78350f] border-[#78350f] text-white" 
                      : selectedUser.cropStage === "Mature" 
                      ? "bg-amber-500 border-amber-500 text-white animate-pulse" 
                      : "bg-white border-stone-300 text-stone-400"
                    }`}>
                      {selectedUser.cropStage === "Harvested" ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : selectedUser.cropStage === "Mature" ? (
                        <Clock className="w-2.5 h-2.5 text-white" />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-800">Harvested & Processed</p>
                      <p className="text-[10px] text-stone-400">Sugarcane crushed, juice boiled traditionally in iron pans, cooled into raw jaggery cubes.</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4 flex gap-2.5">
              <button 
                onClick={() => setSelectedUser(null)}
                className="w-full py-2 bg-[#78350f] text-amber-50 rounded-xl text-xs font-bold hover:bg-amber-950 transition-colors shadow-sm text-center"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
