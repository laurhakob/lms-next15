// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { 
//   ArrowUp, 
//   ArrowDown,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// export default function AdminDashboardPage() {
//   const [timeRange, setTimeRange] = useState<"3months" | "30days" | "7days">("3months");

//   const allData = {
//     "3months": {
//       labels: ["Jan", "Feb", "Mar"],
//       datasets: [
//         { label: "Total Revenue", data: [1.25, 1.3, 1.25], color: "#10b981" },
//         { label: "New Customers", data: [1200, 1100, 1234], color: "#34d399" },
//         { label: "Active Accounts", data: [45000, 45500, 45678], color: "#6ee7b7" },
//         { label: "Growth Rate", data: [0.04, 0.045, 0.045], color: "#a7f3d0" },
//         { label: "Total Visitors", data: [90000, 95000, 100000], color: "#059669" }
//       ]
//     },
//     "30days": {
//       labels: ["Day 1", "Day 2", "Day 3", "Day 4"],
//       datasets: [
//         { label: "Total Revenue", data: [1.2, 1.22, 1.24, 1.25], color: "#10b981" },
//         { label: "New Customers", data: [1100, 1150, 1200, 1234], color: "#34d399" },
//         { label: "Active Accounts", data: [44500, 44700, 45000, 45678], color: "#6ee7b7" },
//         { label: "Growth Rate", data: [0.042, 0.043, 0.044, 0.045], color: "#a7f3d0" },
//         { label: "Total Visitors", data: [32000, 33000, 34000, 35000], color: "#059669" }
//       ]
//     },
//     "7days": {
//       labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
//       datasets: [
//         { label: "Total Revenue", data: [1.2, 1.21, 1.22, 1.23, 1.24, 1.25, 1.25], color: "#10b981" },
//         { label: "New Customers", data: [1100, 1120, 1140, 1160, 1180, 1200, 1234], color: "#34d399" },
//         { label: "Active Accounts", data: [44500, 44600, 44700, 44800, 44900, 45000, 45678], color: "#6ee7b7" },
//         { label: "Growth Rate", data: [0.042, 0.043, 0.044, 0.0445, 0.0447, 0.0449, 0.045], color: "#a7f3d0" },
//         { label: "Total Visitors", data: [7000, 7200, 7400, 7600, 7800, 8000, 8000], color: "#059669" }
//       ]
//     }
//   };

//   const totalVisitorsData = allData[timeRange].datasets.find(d => d.label === "Total Visitors")?.data || [];
//   const latestTotalVisitors = totalVisitorsData[totalVisitorsData.length - 1] || "N/A";

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* Four Tables Side by Side */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-xl text-green-700">Total Revenue</CardTitle>
//             <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               +12.5%
//             </Badge>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p className="text-3xl font-bold text-green-700">$1,250.00</p>
//             <p className="text-sm text-green-600 flex items-center">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               Trending up this month
//             </p>
//             <p className="text-sm text-neutral-600">Visitors for the last 6 months</p>
//           </CardContent>
//         </Card>
//         <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-xl text-green-700">New Customers</CardTitle>
//             <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600">
//               <ArrowDown className="w-4 h-4 mr-1" />
//               -20%
//             </Badge>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p className="text-3xl font-bold text-green-700">1,234</p>
//             <p className="text-sm text-red-600 flex items-center">
//               <ArrowDown className="w-4 h-4 mr-1" />
//               Down 20% this period
//             </p>
//             <p className="text-sm text-neutral-600">Acquisition needs attention</p>
//           </CardContent>
//         </Card>
//         <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-xl text-green-700">Active Accounts</CardTitle>
//             <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               +12.5%
//             </Badge>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p className="text-3xl font-bold text-green-700">45,678</p>
//             <p className="text-sm text-green-600 flex items-center">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               Strong user retention
//             </p>
//             <p className="text-sm text-neutral-600">Engagement exceeds targets</p>
//           </CardContent>
//         </Card>
//         <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-xl text-green-700">Growth Rate</CardTitle>
//             <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               +4.5%
//             </Badge>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p className="text-3xl font-bold text-green-700">4.5%</p>
//             <p className="text-sm text-green-600 flex items-center">
//               <ArrowUp className="w-4 h-4 mr-1" />
//               Steady performance increase
//             </p>
//             <p className="text-sm text-neutral-600">Meets growth projections</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Total Visitors Table */}
//       <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up">
//         <CardHeader className="flex flex-row items-center justify-between">
//           <CardTitle className="text-xl text-green-700">Total Visitors</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant={timeRange === "3months" ? "default" : "outline"}
//               className={timeRange === "3months" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
//               onClick={() => setTimeRange("3months")}
//             >
//               Last 3 months
//             </Button>
//             <Button
//               variant={timeRange === "30days" ? "default" : "outline"}
//               className={timeRange === "30days" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
//               onClick={() => setTimeRange("30days")}
//             >
//               Last 30 days
//             </Button>
//             <Button
//               variant={timeRange === "7days" ? "default" : "outline"}
//               className={timeRange === "7days" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
//               onClick={() => setTimeRange("7days")}
//             >
//               Last 7 days
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <p className="text-3xl font-bold text-green-700">{latestTotalVisitors}</p>
//             <p className="text-sm text-neutral-600">Total for the {timeRange === "3months" ? "last 3 months" : timeRange === "30days" ? "last 30 days" : "last 7 days"}</p>
//           </div>
//           <div className="pt-4">
//             <svg className="w-full h-80" viewBox="0 0 400 200">
//               <rect width="400" height="200" fill="url(#grid)" />
//               <defs>
//                 <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
//                   <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
//                 </pattern>
//               </defs>
//               {allData[timeRange].datasets.map((dataset, index) => (
//                 <g key={index}>
//                   <polygon
//                     points={dataset.data.map((value, i) => {
//                       const x = (i / (dataset.data.length - 1)) * 380 + 10;
//                       const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
//                       return `${x},${y}`;
//                     }).concat("390,200 10,200").join(" ")}
//                     fill={`rgba(${parseInt(dataset.color.slice(1, 3), 16)}, ${parseInt(dataset.color.slice(3, 5), 16)}, ${parseInt(dataset.color.slice(5, 7), 16)}, 0.3)`}
//                     className="transition-all duration-300"
//                   />
//                   <polyline
//                     points={dataset.data.map((value, i) => {
//                       const x = (i / (dataset.data.length - 1)) * 380 + 10;
//                       const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
//                       return `${x},${y}`;
//                     }).join(" ")}
//                     fill="none"
//                     stroke={dataset.color}
//                     strokeWidth="2"
//                     className="transition-all duration-300"
//                   />
//                   {dataset.data.map((value, i) => {
//                     const x = (i / (dataset.data.length - 1)) * 380 + 10;
//                     const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
//                     return (
//                       <circle
//                         key={`${index}-${i}`}
//                         cx={x}
//                         cy={y}
//                         r="3"
//                         fill={dataset.color}
//                         className="hover:fill-green-700 transition-all duration-300"
//                       />
//                     );
//                   })}
//                 </g>
//               ))}
//             </svg>
//             <div className="flex justify-between text-xs text-neutral-600 mt-2">
//               {allData[timeRange].labels.map((label, index) => (
//                 <span key={index}>{label}</span>
//               ))}
//             </div>
//             <div className="flex gap-4 mt-2">
//               {allData[timeRange].datasets.map((dataset, index) => (
//                 <div key={index} className="flex items-center">
//                   <span className="w-3 h-3 mr-1" style={{ backgroundColor: dataset.color }}></span>
//                   <span className="text-sm text-neutral-600">{dataset.label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowUp, 
  ArrowDown,
  Clock,
  User,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"3months" | "30days" | "7days">("3months");
  const router = useRouter();
  const publishedCourses = useQuery(api.courses.getPublishedCourses);

  const allData = {
    "3months": {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [
        { label: "Total Revenue", data: [1.25, 1.3, 1.25], color: "#10b981" },
        { label: "New Customers", data: [1200, 1100, 1234], color: "#34d399" },
        { label: "Active Accounts", data: [45000, 45500, 45678], color: "#6ee7b7" },
        { label: "Growth Rate", data: [0.04, 0.045, 0.045], color: "#a7f3d0" },
        { label: "Total Visitors", data: [90000, 95000, 100000], color: "#059669" }
      ]
    },
    "30days": {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4"],
      datasets: [
        { label: "Total Revenue", data: [1.2, 1.22, 1.24, 1.25], color: "#10b981" },
        { label: "New Customers", data: [1100, 1150, 1200, 1234], color: "#34d399" },
        { label: "Active Accounts", data: [44500, 44700, 45000, 45678], color: "#6ee7b7" },
        { label: "Growth Rate", data: [0.042, 0.043, 0.044, 0.045], color: "#a7f3d0" },
        { label: "Total Visitors", data: [32000, 33000, 34000, 35000], color: "#059669" }
      ]
    },
    "7days": {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
      datasets: [
        { label: "Total Revenue", data: [1.2, 1.21, 1.22, 1.23, 1.24, 1.25, 1.25], color: "#10b981" },
        { label: "New Customers", data: [1100, 1120, 1140, 1160, 1180, 1200, 1234], color: "#34d399" },
        { label: "Active Accounts", data: [44500, 44600, 44700, 44800, 44900, 45000, 45678], color: "#6ee7b7" },
        { label: "Growth Rate", data: [0.042, 0.043, 0.044, 0.0445, 0.0447, 0.0449, 0.045], color: "#a7f3d0" },
        { label: "Total Visitors", data: [7000, 7200, 7400, 7600, 7800, 8000, 8000], color: "#059669" }
      ]
    }
  };

  const totalVisitorsData = allData[timeRange].datasets.find(d => d.label === "Total Visitors")?.data || [];
  const latestTotalVisitors = totalVisitorsData[totalVisitorsData.length - 1] || "N/A";

  // Function to extract plain text from HTML
  const extractPlainText = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Four Tables Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-green-700">Total Revenue</CardTitle>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              +12.5%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">$1,250.00</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              Trending up this month
            </p>
            <p className="text-sm text-neutral-600">Visitors for the last 6 months</p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-green-700">New Customers</CardTitle>
            <Badge variant="outline" className="border-red-200 bg-red-50 text-red-600">
              <ArrowDown className="w-4 h-4 mr-1" />
              -20%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">1,234</p>
            <p className="text-sm text-red-600 flex items-center">
              <ArrowDown className="w-4 h-4 mr-1" />
              Down 20% this period
            </p>
            <p className="text-sm text-neutral-600">Acquisition needs attention</p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-green-700">Active Accounts</CardTitle>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              +12.5%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">45,678</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              Strong user retention
            </p>
            <p className="text-sm text-neutral-600">Engagement exceeds targets</p>
          </CardContent>
        </Card>
        <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-green-700">Growth Rate</CardTitle>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-600">
              <ArrowUp className="w-4 h-4 mr-1" />
              +4.5%
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-green-700">4.5%</p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUp className="w-4 h-4 mr-1" />
              Steady performance increase
            </p>
            <p className="text-sm text-neutral-600">Meets growth projections</p>
          </CardContent>
        </Card>
      </div>

      {/* Total Visitors Table */}
      <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl text-green-700">Total Visitors</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={timeRange === "3months" ? "default" : "outline"}
              className={timeRange === "3months" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
              onClick={() => setTimeRange("3months")}
            >
              Last 3 months
            </Button>
            <Button
              variant={timeRange === "30days" ? "default" : "outline"}
              className={timeRange === "30days" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
              onClick={() => setTimeRange("30days")}
            >
              Last 30 days
            </Button>
            <Button
              variant={timeRange === "7days" ? "default" : "outline"}
              className={timeRange === "7days" ? "bg-[#195a5a] text-white hover:bg-[#195a5a]/90" : "border-green-200 text-green-700 hover:bg-green-50"}
              onClick={() => setTimeRange("7days")}
            >
              Last 7 days
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-3xl font-bold text-green-700">{latestTotalVisitors}</p>
            <p className="text-sm text-neutral-600">Total for the {timeRange === "3months" ? "last 3 months" : timeRange === "30days" ? "last 30 days" : "last 7 days"}</p>
          </div>
          <div className="pt-4">
            <svg className="w-full h-80" viewBox="0 0 400 200">
              <rect width="400" height="200" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
                </pattern>
              </defs>
              {allData[timeRange].datasets.map((dataset, index) => (
                <g key={index}>
                  <polygon
                    points={dataset.data.map((value, i) => {
                      const x = (i / (dataset.data.length - 1)) * 380 + 10;
                      const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
                      return `${x},${y}`;
                    }).concat("390,200 10,200").join(" ")}
                    fill={`rgba(${parseInt(dataset.color.slice(1, 3), 16)}, ${parseInt(dataset.color.slice(3, 5), 16)}, ${parseInt(dataset.color.slice(5, 7), 16)}, 0.3)`}
                    className="transition-all duration-300"
                  />
                  <polyline
                    points={dataset.data.map((value, i) => {
                      const x = (i / (dataset.data.length - 1)) * 380 + 10;
                      const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  {dataset.data.map((value, i) => {
                    const x = (i / (dataset.data.length - 1)) * 380 + 10;
                    const y = 200 - (value / Math.max(...allData[timeRange].datasets.map(d => Math.max(...d.data)))) * 160;
                    return (
                      <circle
                        key={`${index}-${i}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill={dataset.color}
                        className="hover:fill-green-700 transition-all duration-300"
                      />
                    );
                  })}
                </g>
              ))}
            </svg>
            <div className="flex justify-between text-xs text-neutral-600 mt-2">
              {allData[timeRange].labels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
            <div className="flex gap-4 mt-2">
              {allData[timeRange].datasets.map((dataset, index) => (
                <div key={index} className="flex items-center">
                  <span className="w-3 h-3 mr-1" style={{ backgroundColor: dataset.color }}></span>
                  <span className="text-sm text-neutral-600">{dataset.label}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <Card className="border border-green-200 bg-green-100 shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up">
        <CardHeader>
          <CardTitle className="text-xl text-green-700">Courses</CardTitle>
          <p className="text-sm text-neutral-600">Here you can see the courses you have access to</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {publishedCourses && publishedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedCourses.map((course) => (
                <Card
                  key={course._id}
                  className="border-none bg-white/80 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative">
                    <Image
                      src={course.thumbnail || "/placeholder-image.jpg"}
                      alt={course.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-[#195a5a]/80 text-white rounded-full px-3 py-1">
                      {course.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-[#195a5a] mb-2">{course.title}</h3>
                    <p className="text-sm text-[#2a7b7b]/80 mb-3 line-clamp-2">{extractPlainText(course.description)}</p>
                    <div className="flex items-center gap-4 text-sm text-[#195a5a] mb-3">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{course.duration} hrs</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{course.level}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Image
                        src={course.creatorImage}
                        alt={course.creatorName}
                        width={32}
                        height={32}
                        className="rounded-full border border-[#195a5a]/20"
                      />
                      <span className="text-sm text-[#195a5a] font-medium">{course.creatorName}</span>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-[#195a5a] to-[#2a7b7b] text-white hover:from-[#2a7b7b] hover:to-[#195a5a] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
                      onClick={() => router.push(`/admin/courses/${course._id}`)}
                    >
                      View Course
                      <BookOpen className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#195a5a]/80">No published courses available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}