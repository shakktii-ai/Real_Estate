"use client";
import { useState, useEffect } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("All Budget");
    const [selectedPurpose, setSelectedPurpose] = useState("All Purpose");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/user/profile")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            });
    }, []);

    // Get unique lists for dropdowns
    const budgets = ["All Budget", ...new Set(users.map((u) => u.budget).filter(Boolean))];
    const purposes = ["All Purpose", ...new Set(users.map((u) => u.purpose).filter(Boolean))];

    // Enhanced Filter Logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const matchesBudget = selectedBudget === "All Budget" || user.budget === selectedBudget;
        const matchesPurpose = selectedPurpose === "All Purpose" || user.purpose === selectedPurpose;

        return matchesSearch && matchesBudget && matchesPurpose;
    });

    if (loading) return <div>Loading...</div>;

    return (

        <div className="text-black ">
            {/* Search Bar */}
            <div className="flex gap-4 mb-6 flex-wrap border border-gray-300 rounded-md shadow-md p-2">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="p-3 border border-gray-300 rounded-lg flex-grow min-w-[200px]"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="p-3 border border-gray-300 rounded-lg"
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                >
                    {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>

                <select
                    className="p-3 border border-gray-300 rounded-lg"
                    value={selectedPurpose}
                    onChange={(e) => setSelectedPurpose(e.target.value)}
                >
                    {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div className="border border-gray-300 rounded-md shadow-md p-2">
                <p className="p-1 text-md">All Users ({filteredUsers.length})</p>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                {["Name", "Phone", "Email", "Budget", "Purpose", "Date",].map(h => (
                                    <th key={h} className="px-2 py-2 text-sm font-bold text-gray-700">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 text-sm">
                                    <td className="px-2 py-4 font-medium">{user.fullName}</td>
                                    <td className="px-2 py-4">{user.phone}</td>
                                    <td className="px-2 py-4">{user.email}</td>
                                    <td className="px-2 py-4">{user.budget}</td>
                                    <td className="px-2 py-4">
                                        <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                            {user.purpose}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    {/* <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td> */}
                                    {/* <td className="px-2 py-4 flex gap-3">
                                        <button className="text-gray-500 hover:text-black"><Eye size={18} /></button>
                                        <button className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                                        <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}