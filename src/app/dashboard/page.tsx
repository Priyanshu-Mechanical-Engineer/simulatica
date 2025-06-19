// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, logout } from "@/lib/auth";

// export default function DashboardPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         router.push("/login");
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     router.push("/login");
//   };

//   return (
//     <main className="flex min-h-screen items-center justify-center bg-green-50 flex-col">
//       <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome to your Dashboard 🚀</h1>
//       <p className="text-green-600 mb-6">You are logged in!</p>
//       <button
//         onClick={handleLogout}
//         className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//       >
//         Logout
//       </button>
//     </main>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
      <p>Your dashboard is live.</p>
    </div>
  );
}
