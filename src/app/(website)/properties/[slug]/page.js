//src/app/(website)/properties/[slug]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, FileText, MapPin, ArrowLeft, Phone, ShieldCheck, Star, Mail } from "lucide-react";
import Link from "next/link";
import BookSiteVisitModal from "@/components/BookSiteVisitModal";
import BookVirtualTourModal from "@/components/BookVirtualTourModal";
import { useAuth } from "@/lib/context/AuthContext";
import { toast } from "react-toastify";
import AuthModal from "@/components/AuthModal";
import { BsDash } from "react-icons/bs";
import ShareProject from "@/components/ShareProject";
import { RiTelegram2Fill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
import Image from "next/image";
export default function ProjectDetails() {
  const { user } = useAuth();
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVirtualModalOpen, setIsVirtualModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSimilarIndex, setActiveSimilarIndex] = useState(0);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const categoryColors = {
    Premium: "bg-[#009966]",
    Luxury: "bg-[#F97316]",
    Affordable: "bg-[#1447EA]",
    Holiday: "bg-[#1DA2B3]",
    Featured: "bg-[#A566B8]",
    Residential: "bg-[#8B5CF6]",
    Commercial: "bg-black",
    "Sold out": "bg-[#c80815]",
    "New Launch": "bg-[#E5097F]",
    "Highest Selling": "bg-[FFA900]"


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

  const parsePriceToLakhs = (priceText) => {
    if (!priceText) return 0;

    const regex = /([\d\.]+)\s*(cr|lakhs|lakh|l|k)?/gi;
    let match;
    let minLakhs = Infinity;

    while ((match = regex.exec(priceText)) !== null) {
      let value = parseFloat(match[1]);
      const unit = match[2] ? match[2].toLowerCase() : "";

      if (unit.startsWith("cr")) value *= 100;
      else if (unit === "k") value /= 100;
      else if (!unit && value > 1000) value /= 100000;

      if (value > 0 && value < minLakhs) minLakhs = value;
    }

    return minLakhs === Infinity ? 0 : minLakhs;
  };

  const getSimilarProjects = (currentProject, allProjects) => {
    if (!currentProject || !allProjects?.length) return [];

    const currentPrice = parsePriceToLakhs(currentProject.pricing?.displayPrice);
    if (!currentPrice) return [];

    const lowerBound = currentPrice * 0.7;
    const upperBound = currentPrice * 1.3;

    const scoredProjects = allProjects
      .filter((item) => item._id !== currentProject._id)
      .map((item) => {
        const itemPrice = parsePriceToLakhs(item.pricing?.displayPrice);
        const withinRange = itemPrice >= lowerBound && itemPrice <= upperBound;
        const sameCity =
          currentProject.address?.city &&
          item.address?.city?.toLowerCase() === currentProject.address.city.toLowerCase();
        const priceDifference = currentPrice ? Math.abs(itemPrice - currentPrice) : 0;

        return {
          ...item,
          itemPrice,
          withinRange,
          sameCity,
          priceDifference,
        };
      })
      .filter((item) => item.itemPrice > 0 && item.withinRange)
      .sort((a, b) => {
        if (a.sameCity !== b.sameCity) return a.sameCity ? -1 : 1;
        return a.priceDifference - b.priceDifference;
      })
      .slice(0, 6);

    if (scoredProjects.length >= 3) return scoredProjects;

    const fallbackProjects = allProjects
      .filter((item) => item._id !== currentProject._id)
      .map((item) => {
        const itemPrice = parsePriceToLakhs(item.pricing?.displayPrice);
        const sameCity =
          currentProject.address?.city &&
          item.address?.city?.toLowerCase() === currentProject.address.city.toLowerCase();
        const priceDifference = currentPrice ? Math.abs(itemPrice - currentPrice) : 0;

        return { ...item, itemPrice, sameCity, priceDifference };
      })
      .filter((item) => item.itemPrice > 0)
      .sort((a, b) => {
        if (a.sameCity !== b.sameCity) return a.sameCity ? -1 : 1;
        return a.priceDifference - b.priceDifference;
      })
      .slice(0, 6);

    return fallbackProjects;
  };

  useEffect(() => {
    const fetchProjectAndSimilar = async () => {
      try {
        const [projectRes, propertiesRes] = await Promise.all([
          fetch(`/api/properties/${slug}`),
          fetch(`/api/properties`),
        ]);

        const projectData = await projectRes.json();
        const propertiesData = await propertiesRes.json();

        setProject(projectData);
        setSimilarProjects(getSimilarProjects(projectData, propertiesData));
        setActiveSimilarIndex(0);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProjectAndSimilar();
  }, [slug]);
  // for similar project showcase slider
  useEffect(() => {
    if (similarProjects.length <= 1) return;

    const timer = setInterval(() => {
      setActiveSimilarIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= similarProjects.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [similarProjects]);
  //for rate us popup
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReviewPopup(true);
    }, 60000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);
  if (loading) return <div className="p-10 text-center text-black">Loading Project Details...</div>;
  if (!project) return <div className="p-10 text-center">Project not found.</div>;

  const handleDownload = (fileUrl, fileName) => {
    if (!user) {
      setShowAuthModal(true); // or open your auth modal
      toast.info("Sign up to download brochures and price sheets.");
      return;
    }

    if (!fileUrl) return;
    const downloadUrl = `/api/download?url=${encodeURIComponent(fileUrl)}&name=${encodeURIComponent(fileName)}`;
    window.location.href = downloadUrl;
  };
  const name = user?.name || "Customer";

  const message = `Dear ${name},

Thank you for choosing PIINGGAKSHA to help you find your dream home.

We would truly appreciate it if you could take just one minute today to share your experience with our team. Your feedback helps us improve our services and also helps other homebuyers make informed decisions.

⭐ Please leave your review here:
https://g.page/r/CYYb97YJda6_EBM/review

Your kind words mean a lot to us and motivate our team to serve every customer better.

Thank you for your valuable time and support.

Warm Regards,
Team Piinggaksha`;

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  return (

    <div className="max-w-7xl mx-auto mx-auto p-4 md:p-8 bg-[#F8F9FA] min-h-screen text-black">
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

        <div className="flex flex-wrap lg:flex-nowrap w-full lg:w-auto gap-2">

          <ShareProject project={project} showText={true} />
          {project.brochureUrl && (
            <button
              onClick={() => handleDownload(project.brochureUrl, `${project.projectName}-Brochure.pdf`)}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50"
            >
              <Download size={16} /> Brochure
            </button>
          )}
          {project.priceSheetUrl && (
            <button
              onClick={() => handleDownload(project.priceSheetUrl, `${project.projectName}-PriceSheet.pdf`)}
              className="flex items-center gap-2 px-4 py-2 border bg-white rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50"
            >
              <FileText size={16} /> Price Sheet
            </button>
          )}
          <button onClick={() => {
            if (!user) {
              toast.error("Please SignUp first to book a site visit");
              setShowAuthModal(true);
              return;

            }
            setIsModalOpen(true)
          }}
            className="flex-1 lg:flex-none px-4 py-3 text-sm bg-[#742E85] text-white rounded-lg text-sm font-bold shadow-md hover:cursor-pointer">Book Site Visit</button>
          <button
            onClick={() => {
              if (!user) {
                toast.error("Please SignUp first to book a vitual tour");
                setShowAuthModal(true);
                return;
              }
              setIsVirtualModalOpen(true)
            }}
            className="flex-1 lg:flex-none px-4 py-3 text-sm bg-[#E5097F] text-white rounded-lg text-sm font-bold shadow-md hover:cursor-pointer">Book Virtual Tour</button>
        </div>
      </div>

      {/* 2. Main Hero Image Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full lg:w-[70%]">
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/10] md:aspect-[16/8]">
            <img
              src={project.mainImage || "https://via.placeholder.com/1200x500"}
              alt={project.projectName}
              className="w-full h-full"
            />
            {project.tags?.includes("RERA Verified") && (
              <div className="absolute bottom-3 left-3 bg-[#DBFCE7] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#009318] font-bold border border-green-200">
                RERA Verified
              </div>
            )}
            {project.tags?.includes("Highest Selling") && (
              <div className="absolute bottom-3 left-26 bg-[#FFA900] px-2 py-1 rounded-full flex items-center gap-1 text-[10px] text-[#ffffff] font-normal  whitespace-nowrap shadow-md">
                <Image
                  src="/fire.png"
                  alt="Highest Selling"
                  width={12}
                  height={12}
                  className="object-contain flex-shrink-0"
                />
                <span>Highest Selling</span>
              </div>
            )}
            <div className="absolute top-3 right-3 flex flex-wrap gap-2 max-w-[80%]">


              {project.tags
                ?.filter((tag) => tag !== "RERA Verified" && tag !== "Highest Selling")
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
          <div className="bg-white rounded-2xl shadow-sm border p-6 mt-6 grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 items-center">
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
          <div className="mt-8 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2 rounded-xl bg-[#E0E0E0] p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 py-2.5 px-4 sm:px-5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-black"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
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
                    <button
                      onClick={() => handleDownload(project.priceSheetUrl, `${project.projectName}-PriceSheet.pdf`)}
                      className="inline-flex items-center gap-2 mt-2 px-4 py-3 bg-[#742E85] text-white rounded-xl w-fit hover:bg-[#5a246a]"
                    >
                      <FileText size={18} />
                      Download Price Sheet
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "Amenities" && (
              <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6">Amenities</h3>

                {project.amenities?.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc list-inside text-gray-700">
                    {project.amenities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <BsDash size={18} className="mt-1 text-[#000000]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No amenities listed for this project.</p>
                )}
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

                {project.usp?.length > 0 ? (
                  <ul className="space-y-3 list-disc list-inside text-gray-700">
                    {project.usp.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <BsDash size={18} className="mt-1 text-[#000000]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No USPs have been added for this project yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-[30%]">
          {/* <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm  flex flex-col "> */}
          <div className="mb-4 space-y-6">

            {/* Talk to an Expert */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-5">
              <h3 className="text-xl font-semibold mb-5">
                Talk to an Expert
              </h3>

              <button
                onClick={() => window.open("tel:+918244291917")}
                className="w-full bg-[#E5097F] hover:bg-[#d4007d] text-white text[15px] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
              >
                <Phone size={18} /><a href="tel:+919284429197"> Call Me Instantly • 92844 29197 </a>
              </button>

              <button
                onClick={() => window.open("tel:+919529249230")}
                className="w-full mt-3 bg-[#742E85] hover:bg-[#60246d] text-white text-[15px] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition"
              >
                <Phone size={18} /><a href="tel:+919529249230"> Call • 95292 49230 </a>
              </button>

              <button
                className="w-full mt-3 border border-[#742E85] text-[#742E85] text-[15px] py-3 rounded-xl font-medium hover:bg-[#742E85] hover:text-white transition"
              >
                Consult Now
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-[15px] font-medium text-black">
                <ShieldCheck size={16} className="text-gray-600" />
                <span>No spam • Free service</span>
              </div>
            </div>

          </div>
          <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-lg font-semibold mb-4">
              Similar Price Range
            </h3>

            <div className="relative overflow-hidden min-h-[320px]">
              {similarProjects.length > 0 ? (
                <div className="space-y-3 transition-all duration-1000 ease-out">
                  {[
                    ...similarProjects.slice(activeSimilarIndex),
                    ...similarProjects.slice(0, activeSimilarIndex),
                  ].map((item) => (
                    <Link
                      key={item._id}
                      href={`/properties/${item.slug}`}
                      className="flex gap-3 cursor-pointer rounded-xl p-2 hover:bg-gray-50 transition-all duration-1000 ease-out"
                    >
                      <img
                        src={item.mainImage}
                        alt={item.projectName}
                        className="w-24 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-semibold text-sm line-clamp-1">
                          {item.projectName}
                        </h4>

                        <p className="text-xs text-gray-500">
                          {item.address?.area}, {item.address?.city}
                        </p>

                        <p className="text-[#1447EA] font-medium text-sm mt-1">
                          {item.pricing?.displayPrice}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>) : (
                <p className="text-sm text-gray-500">
                  No similar projects found in the same price range yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showReviewPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/62  p-4">
          <div className="relative w-full max-w-[400px]  rounded-3xl  overflow-hidden shadow-2xl">

            {/* Close */}
            <button
              onClick={() => setShowReviewPopup(false)}
              className="absolute top-4 right-4 text-white text-2xl z-10"
            >
              ×
            </button>

            {/* Header */}
            <div className="bg-gradient-to-br from-[#742E85] to-[#E5097F] text-white p-6 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={24}
                    className="fill-white text-white"
                  />
                ))}
              </div>

              <h2 className="text-[18px] font-semibold text-white">
                You Made Our Day!
              </h2>

              <p className="mt-2 text-white text-[12px]">
                Would you spare 60 seconds to share your experience?
              </p>
            </div>

            {/* Body */}
            <div className="p-6 bg-white">

              <div className="rounded-2xl bg-[#E5FFE9] border border-[#009318] p-2 text-center text-[14px] text-black">
                Your review helps other homebuyers make informed
                decisions & motivates our team.
              </div>

              <a
                href="https://g.page/r/CYYb97YJda6_EBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex justify-center items-center rounded-[16px] bg-gradient-to-r from-[#E509C8] to-[#7F056F] text-white py-4 font-medium"
              >
                <Star size={24} className="fill-[#FFD600] text-[#FFD600] mr-2" /> Rate Us on Google Now
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex justify-center items-center rounded-[16px] bg-[#25D366] text-white py-4 font-medium"
              >
                <FaTelegramPlane size={24} className="mr-2" /> Hare Review Link via WhatsApp
              </a>
              <p className="flex justify-center mt-2 text-black text-[12px]">
                Takes less than 60 seconds - No login required.
              </p>
            </div>

          </div>
        </div>
      )}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}