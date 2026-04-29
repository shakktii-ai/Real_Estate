//src/app/(website)/properties/[slug]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, FileText, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import BookVirtualTourModal from "@/components/BookVirtualTourModal";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "react-toastify";
export default function ProjectDetails() {
  const { user } = useAuth();
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVirtualModalOpen,setIsVirtualModalOpen] = useState(false);
  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
  };
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = ["Overview", "Pricing", "Amenities", "Construction", "Location", "USP's of Project"];
  const formatPrice = (price) => {
  if (!price) return "--";

  if (price >= 10000000) {
    return "₹" + (price / 10000000).toFixed(2) + " Cr";
  }
  if (price >= 100000) {
    return "₹" + (price / 100000).toFixed(1) + " L";
  }
  return "₹" + price.toLocaleString("en-IN");
};
const oldPrice = project?.priceDrop?.oldPrice || 0;
const newPrice = project?.priceDrop?.newPrice || 0;

const percentage =
  oldPrice > 0
    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    : 0;

const dropAmount = oldPrice - newPrice;
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/properties/${slug}`);
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading Project Details...</div>;
  if (!project) return <div className="p-10 text-center">Project not found.</div>;

  return (

    <div className="max-w-full mx-auto p-4 md:p-8 bg-[#F8F9FA] min-h-screen text-black">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-[450px] w-full">
            <BookSiteVisitModal
              propertyId={project._id}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
      {isVirtualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-[450px] w-full">
            <BookVirtualTourModal
              propertyId={project._id}
              onClose={() => setIsVirtualModalOpen(false)}
            />
          </div>
        </div>
      )}
      {/* 1. Top Navigation & Document Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-1 text-gray-500 text-sm mb-2 hover:text-black">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="text-3xl font-semibold">{project.projectName}</h1>
          <p className="text-gray-500 flex items-center gap-1 text-sm">
            <MapPin size={14} /> {project.address.area}, {project.address.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.brochureUrl && (
            <a target="_blank" className="flex items-center gap-2 px-4 py-2 border bg-white rounded-lg text-sm font-bold shadow-sm">
              <Download size={16} /> Brochure
            </a>
          )}
          {project.priceSheetUrl && (
            <a target="_blank" className="flex items-center gap-2 px-4 py-2 border bg-white rounded-lg text-sm font-bold shadow-sm">
              <FileText size={16} /> Price Sheet
            </a>
          )}
          <button onClick={() => {
            if (!user) {
              toast.error("Please SignUp first to book a site visit");
              return;
            }
            setIsModalOpen(true)
          }}
            className="px-6 py-2 bg-[#742E85] text-white rounded-lg text-sm font-bold shadow-md hover:cursor-pointer">Book Site Visit</button>
          <button 
          onClick={() => {
            if (!user) {
              toast.error("Please SignUp first to book a vitual tour");
              return;
            }
            setIsVirtualModalOpen(true)
          }}
           className="px-6 py-2 bg-[#E5097F] text-white rounded-lg text-sm font-bold shadow-md hover:cursor-pointer">Book Virtual Tour</button>
        </div>
      </div>

      {/* 2. Main Hero Image Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[10/7]">
        <img
          src={project.mainImage || "https://via.placeholder.com/1200x500"}
          alt={project.projectName}
          className="w-full h-full object-cover"
        />
        {project.tags?.includes("RERA Verified") && (
          <div className="absolute top-3 left-3 bg-[#DBFCE7] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#009318] font-bold border border-green-200">
            RERA Verified
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-wrap gap-2 max-w-[80%]">


          {project.tags
            ?.filter((tag) => tag !== "RERA Verified")
            .map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${categoryColors[tag] || "text-gray-600 bg-gray-100"
                  }`}
              >
                {tag}
              </span>
            ))}
        </div>
      </div>

      {/* 3. Stats Highlight Bar */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6 grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
        <div>
          <p className="text-black text-md font-bold uppercase">Price Range</p>
          <p className="text-[#1447EA] font-bold text-lg">{project.pricing?.displayPrice}</p>
        </div>
        <div>
          <p className="text-black text-md font-bold uppercase">Possession</p>
          <p className=" text-md">{project.possessionDate}</p>
        </div>
        <div>
          <p className="text-black text-md font-bold uppercase">Configurations</p>
          <p className=" text-md">{project.configuration?.join(" & ")}</p>
        </div>
        <div>
          <p className="text-black text-md font-bold uppercase">RERA Number</p>
          <p className=" text-md">{project.reraNumber}</p>
        </div>
        <div className="flex justify-center md:justify-end">
          {project.qrCodeUrl && (
            <img src={project.qrCodeUrl} className="w-16 h-16  rounded-md" alt="QR" />
          )}
        </div>
      </div>
      <div className="mt-8 bg-[#E0E0E0] p-1.5 rounded-xl flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
              ? "bg-white text-black shadow-sm"
              : "text-gray-600 hover:text-black"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* 4. Details Section */}
      <div className="mt-6">
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-4">
                About {project.projectName}
              </h3>

              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Project Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Builder</p>
                  <p className="font-semibold">{project.builderName}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase">Status</p>
                  <p className="font-semibold">{project.status}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase">Possession</p>
                  <p className="font-semibold">{project.possessionDate}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase">Configuration</p>
                  <p className="font-semibold">
                    {project.configuration?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Pricing" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Pricing Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-xs uppercase mb-1">
                  Current Price
                </p>
                <p className="text-2xl font-bold text-[#742E85]">
                  {project.pricing?.displayPrice}
                </p>
              </div>

              {project.priceDrop?.isEnabled && (
                <>
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">
                      Old Price
                    </p>
                    <p className="text-lg font-semibold line-through text-gray-400">
                      {formatPrice(oldPrice)}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">
                      New Price
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatPrice(newPrice)}
                    </p>
                  </div>
                </>
              )}

              {project.priceSheetUrl && (
                <a
                  href={project.priceSheetUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-3 bg-[#742E85] text-white rounded-xl w-fit"
                >
                  <FileText size={18} />
                  Download Price Sheet
                </a>
              )}
            </div>
          </div>
        )}

        {activeTab === "Amenities" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Amenities</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {project.amenities?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border rounded-xl p-2"
                >
                  <CheckCircle size={18} className="text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Construction" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between pb-2">
              <h3 className="text-sm font-normal">Overall Progress</h3>
              <p className=" font-normal text-black">
                {project.constructionProgress || 0}%
              </p>
            </div>
            <div className="w-full bg-[#F6D0FF] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#742E85] h-full rounded-full"
                style={{ width: `${project.constructionProgress || 0}%` }}
              />
            </div>

            <p className="p-2 rounded-xl text-[#742E85] bg-[#F6D0FF] my-4">
              Construction is on schedule. Expected possession in {project.possessionDate}.
            </p>
          </div>
        )}

        {activeTab === "Location" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Location Details</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs uppercase">Area</p>
                <p className="font-semibold">{project.address?.area}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">City</p>
                <p className="font-semibold">{project.address?.city}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase">RERA Number</p>
                <p className="font-semibold">{project.reraNumber}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "USP's of Project" && (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold mb-6">USP's of Project</h3>

            <div className="space-y-4">
              {(project.tags || []).map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border rounded-xl p-4"
                >
                  <CheckCircle size={18} className="text-[#D81B60]" />
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>    </div>
  );
}