"use client";

import { useCallback, useEffect, useState } from "react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);

      const url =
        filter === "all"
          ? "/api/leads"
          : `/api/leads?sourceType=${filter}`;

      const response = await fetch(url);

      const result = await response.json();

      if (result.success) {
        setLeads(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setCurrentPage(1);
    fetchLeads();
  }, [fetchLeads]);

  const totalPages = Math.max(1, Math.ceil(leads.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedLeads = leads.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatSource = (source) => {
    switch (source) {
      case "site_visit":
        return "Site Visit";

      case "virtual_tour":
        return "Virtual Tour";

      case "chatbot":
        return "Chatbot";
        return "Other";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Leads
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage all leads generated from your website
          </p>
        </div>

        {/* Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option value="all">All Leads</option>
          {/* <option value="profile">Profile</option> */}
          <option value="site_visit">Site Visit</option>
          <option value="virtual_tour">Virtual Tour</option>
          <option value="chatbot">Chatbot Leads</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Total Leads
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {leads.length}
          </h2>
        </div>

        {/* <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Profile Leads
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {
              leads.filter(
                (lead) => lead.sourceType === "profile"
              ).length
            }
          </h2>
        </div> */}

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Site Visits
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {
              leads.filter(
                (lead) => lead.sourceType === "site_visit"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Virtual Tours
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {
              leads.filter(
                (lead) =>
                  lead.sourceType === "virtual_tour"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-sm text-gray-500">
            Chatbot Leads
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {
              leads.filter(
                (lead) => lead.sourceType === "chatbot"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No leads found
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Name
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Phone
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Email
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Project
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    City
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Source
                  </th>

                  <th className="text-left px-5 py-4 text-sm font-medium">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>

                {paginatedLeads.map((lead) => (

                  <tr
                    key={lead._id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Name */}
                    <td className="px-5 py-4">
                      <div className="font-medium">
                        {lead.firstName ||
                          lead.name ||
                          lead.userId?.fullName ||
                          "-"}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      {lead.phone ||
                        lead.userId?.phone ||
                        "-"}
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      {lead.email ||
                        lead.userId?.email ||
                        "-"}
                    </td>

                    {/* Project */}
                    <td className="px-5 py-4">
                      {lead.project ||
                        lead.propertyId?.projectName ||
                        lead.projectName ||
                        "-"}
                    </td>

                    {/* City */}
                    <td className="px-5 py-4">
                      {lead.city ||
                        lead.propertyId?.city ||
                        lead.preferredLocation ||
                        "-"}
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-sm">
                        {formatSource(
                          lead.sourceType
                        )}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {lead.createdAt
                        ? new Date(
                            lead.createdAt
                          ).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {!loading && leads.length > 0 && (
        <div className="flex items-center justify-between mt-6 gap-4">
          <p className="text-sm text-gray-500">
            Showing {Math.min(startIndex + 1, leads.length)}-{Math.min(startIndex + pageSize, leads.length)} of {leads.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}