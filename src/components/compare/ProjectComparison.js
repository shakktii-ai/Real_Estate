"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import ProjectImage from "@/components/ProjectImage";
import { getProjectCoverImage } from "@/lib/projectImages";

const MAX_PROJECTS = 4;

const comparisonRows = [
  { key: "builderName", label: "Developer Name" },
  { key: "location", label: "Project Location" },
  { key: "reraNumber", label: "RERA Number" },
  { key: "status", label: "Project Status" },
  { key: "possessionDate", label: "Possession Date", highlighted: true },
  { key: "configuration", label: "Configuration", highlighted: true },
  { key: "priceRange", label: "Price Range", highlighted: true },
  { key: "amenities", label: "Amenities" },
  {
    key: "constructionProgress",
    label: "Construction Progress",
    highlighted: true,
  },
];

function getLocation(project) {
  return [project.address?.area, project.address?.city]
    .filter((part) => typeof part === "string" && part.trim())
    .join(", ");
}

function getSearchText(project) {
  return [
    project.projectName,
    project.builderName,
    project.address?.area,
    project.address?.city,
  ]
    .filter((part) => typeof part === "string")
    .join(" ")
    .toLowerCase();
}

function getRowValue(project, key) {
  switch (key) {
    case "location":
      return getLocation(project);
    case "priceRange":
      return project.pricing?.displayPrice;
    case "configuration":
      return Array.isArray(project.configuration)
        ? project.configuration.filter(Boolean).join(", ")
        : "";
    case "amenities":
      return Array.isArray(project.amenities)
        ? project.amenities.filter(Boolean)
        : [];
    case "constructionProgress":
      return project.constructionProgress;
    default:
      return project[key];
  }
}

function isAvailable(value) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function ProjectThumbnail({ project, className = "h-14 w-14" }) {
  const image = getProjectCoverImage(project);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-[#742E85]/10 text-[#742E85] ${className}`}
    >
      {image ? (
        <ProjectImage
          src={image}
          alt={project.projectName ? `${project.projectName} project` : "Project"}
          sizes="(max-width: 640px) 96px, 128px"
          className="h-full w-full object-cover"
        />
      ) : (
        <Building2 size={22} aria-hidden="true" />
      )}
    </div>
  );
}

function ProjectOption({ project, isSelected, isFull, onSelect }) {
  const location = getLocation(project);
  const configurations = Array.isArray(project.configuration)
    ? project.configuration.filter(Boolean).join(", ")
    : "";

  return (
    <li className="flex items-center gap-3 p-3 transition hover:bg-purple-50/60 sm:px-4">
      <ProjectThumbnail project={project} className="h-14 w-14 sm:h-16 sm:w-16" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-gray-900">
          {project.projectName || "Unnamed project"}
        </span>
        <span className="mt-0.5 block truncate text-xs text-gray-500">
          {[project.builderName, location].filter(Boolean).join(" · ") ||
            "Project details not available"}
        </span>
        <span className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-500">
          {configurations && <span>{configurations}</span>}
          {project.status && <span>{project.status}</span>}
        </span>
      </span>
      <button
        type="button"
        onClick={() => onSelect(project)}
        disabled={isSelected || isFull}
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#742E85] px-3 text-xs font-semibold text-white transition hover:bg-[#5e246c] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 sm:px-4"
        aria-label={
          isSelected
            ? `${project.projectName || "Project"} already added`
            : isFull
              ? "Maximum of four projects selected"
              : `Add ${project.projectName || "project"} to comparison`
        }
      >
        {isSelected ? (
          <>
            <Check size={15} aria-hidden="true" />
            Added
          </>
        ) : isFull ? (
          "Limit reached"
        ) : (
          <>
            <Plus size={15} aria-hidden="true" />
            Add
          </>
        )}
      </button>
    </li>
  );
}

function ProjectSelector({ projects, selectedIds, onSelect, disabled }) {
  const [query, setQuery] = useState("");
  const [browseOpen, setBrowseOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleOutsidePointerDown = (event) => {
      if (!selectorRef.current?.contains(event.target)) {
        setBrowseOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter(
      (project) =>
        !normalizedQuery || getSearchText(project).includes(normalizedQuery)
    );
  }, [projects, query]);

  const handleSelect = (project) => {
    onSelect(project);
    setQuery("");
    setSearchOpen(false);
    setBrowseOpen(false);
  };

  return (
    <div ref={selectorRef} className="relative">
      <label
        htmlFor="compare-project-search"
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        Search and add projects
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            id="compare-project-search"
            type="search"
            autoComplete="off"
            value={query}
            onFocus={() => {
              if (query.trim()) setSearchOpen(true);
            }}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              setSearchOpen(Boolean(nextQuery.trim()));
            }}
            placeholder="Search by project, developer, or location"
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#742E85] focus:ring-4 focus:ring-[#742E85]/10"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            const shouldOpen = !browseOpen;
            setBrowseOpen(shouldOpen);
            setSearchOpen(false);
            if (shouldOpen) setQuery("");
          }}
          aria-expanded={browseOpen}
          aria-controls="browse-projects-panel"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#742E85] bg-white px-4 text-sm font-semibold text-[#742E85] transition hover:bg-[#742E85]/5 focus:outline-none focus:ring-4 focus:ring-[#742E85]/10"
        >
          <Building2 size={17} aria-hidden="true" />
          Browse All Projects
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`transition-transform ${browseOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {searchOpen && query.trim() && !browseOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[65vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {matches.length ? (
            <ul className="divide-y divide-gray-100">
              {matches.map((project) => (
                <ProjectOption
                  key={project._id}
                  project={project}
                  isSelected={selectedIds.includes(project._id)}
                  isFull={disabled && !selectedIds.includes(project._id)}
                  onSelect={handleSelect}
                />
              ))}
            </ul>
          ) : (
            <p className="px-4 py-5 text-sm text-gray-500">
              No projects match “{query.trim()}”.
            </p>
          )}
        </div>
      )}
      {!query.trim() && !disabled && !browseOpen && (
        <p className="mt-2 text-xs text-gray-500">
          Search using a project name, developer, area, or city.
        </p>
      )}

      {browseOpen && (
        <div
          id="browse-projects-panel"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[80vh] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
        >
          <div className="border-b border-gray-100 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-gray-900">Browse all projects</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {projects.length} {projects.length === 1 ? "project" : "projects"} available
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBrowseOpen(false)}
                aria-label="Close project browser"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="max-h-[45vh] overflow-y-auto overscroll-contain sm:max-h-[50vh]">
            {projects.length ? (
              <ul className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <ProjectOption
                    key={project._id}
                    project={project}
                    isSelected={selectedIds.includes(project._id)}
                    isFull={disabled && !selectedIds.includes(project._id)}
                    onSelect={handleSelect}
                  />
                ))}
              </ul>
            ) : (
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                No projects are available.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonCell({ project, row }) {
  const value = getRowValue(project, row.key);

  if (row.key === "constructionProgress") {
    const progress =
      typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100
        ? value
        : null;

    if (progress === null) {
      return <span className="text-sm text-gray-400">Not Available</span>;
    }

    return (
      <div className="min-w-32">
        <div
          className="mb-2 h-2 overflow-hidden rounded-full bg-[#742E85]/10"
          role="progressbar"
          aria-label={`${project.projectName || "Project"} construction progress`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-[#E5097F] transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-semibold text-gray-800">{progress}%</span>
      </div>
    );
  }

  if (row.key === "amenities") {
    if (!isAvailable(value)) {
      return <span className="text-sm text-gray-400">Not Available</span>;
    }

    return (
      <ul className="space-y-1.5">
        {value.map((amenity, index) => (
          <li
            key={`${amenity}-${index}`}
            className="flex items-start gap-2 text-sm leading-5 text-gray-700"
          >
            <Check
              size={15}
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-[#742E85]"
            />
            <span>{amenity}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <span className={isAvailable(value) ? "text-sm text-gray-800" : "text-sm text-gray-400"}>
      {isAvailable(value) ? value : "Not Available"}
    </span>
  );
}

function ComparisonTable({ projects, onRemove }) {
  const minTableWidth = 210 + projects.length * 240;

  return (
    <div
      className="overflow-x-auto overscroll-x-contain rounded-2xl border border-gray-200 bg-white shadow-sm"
      aria-label="Project comparison table"
    >
      <table
        className="w-full border-separate border-spacing-0"
        style={{ minWidth: `${minTableWidth}px` }}
      >
        <thead>
          <tr>
            <th
              scope="col"
              className="z-30 w-[210px] border-b border-r border-gray-200 bg-gray-50 p-4 text-left align-top text-xs font-semibold uppercase tracking-wide text-gray-500"
            >
              Compare Features
            </th>
            {projects.map((project) => (
              <th
                key={project._id}
                scope="col"
                className="sticky top-0 z-20 w-[240px] border-b border-r border-gray-200 bg-white p-4 text-left align-top last:border-r-0"
              >
                <div className="flex items-start gap-3">
                  <ProjectThumbnail
                    project={project}
                    className="h-14 w-16 rounded-lg"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#742E85]">
                      Project
                    </span>
                    <span className="block break-words text-sm font-bold leading-snug text-gray-900">
                      {project.projectName || "Unnamed project"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(project._id)}
                    aria-label={`Remove ${project.projectName || "project"} from comparison`}
                    title="Remove project"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-[#742E85]"
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparisonRows.map((row) => (
            <tr
              key={row.key}
              className={row.highlighted ? "bg-[#742E85]/[0.035]" : "bg-white"}
            >
              <th
                scope="row"
                className={` z-10 w-[210px] border-b border-r border-gray-200 p-4 text-left align-top text-sm font-semibold text-gray-800 ${
                  row.highlighted ? "bg-[#F8F3F9]" : "bg-white"
                }`}
              >
                {row.label}
              </th>
              {projects.map((project) => (
                <td
                  key={`${project._id}-${row.key}`}
                  className={`w-[240px] border-b border-r border-gray-200 p-4 align-top last:border-r-0 ${
                    row.highlighted ? "bg-[#742E85]/[0.035]" : "bg-white"
                  }`}
                >
                  <ComparisonCell project={project} row={row} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectComparison() {
  const [projects, setProjects] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const initialFetchStarted = useRef(false);

  const selectedProjects = useMemo(
    () =>
      selectedIds
        .map((id) => projects.find((project) => project._id === id))
        .filter(Boolean),
    [projects, selectedIds]
  );

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/properties", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Projects could not be loaded.");
      }
      if (!Array.isArray(data)) {
        throw new Error("The projects response was not in the expected format.");
      }

      setProjects(data);
    } catch (fetchError) {
      console.error("Project comparison fetch failed:", fetchError);
      setError(fetchError.message || "Projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetchStarted.current) return;
    initialFetchStarted.current = true;
    loadProjects();
  }, [loadProjects]);

  const addProject = (project) => {
    setSelectedIds((currentIds) => {
      if (currentIds.length >= MAX_PROJECTS || currentIds.includes(project._id)) {
        return currentIds;
      }
      return [...currentIds, project._id];
    });
  };

  const removeProject = (projectId) => {
    setSelectedIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== projectId)
    );
  };

  const clearAll = () => setSelectedIds([]);

  return (
    <section className="min-h-screen bg-[#FAF9FB] px-4 py-8 text-gray-900 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm text-gray-500"
        >
          <Link href="/" className="inline-flex items-center gap-1 hover:text-[#742E85]">
            <Home size={15} aria-hidden="true" />
            Home
          </Link>
          <ChevronRight size={15} aria-hidden="true" className="text-gray-400" />
          <span aria-current="page" className="font-medium text-[#742E85]">
            Compare Projects
          </span>
        </nav>

        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#742E85]/10 px-3 py-1.5 text-xs font-semibold text-[#742E85]">
            {/* <Building2 size={15} aria-hidden="true" /> */}
            Side-by-side project comparison
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Compare Properties
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Compare projects side by side and find the right property for you.
          </p>
        </header>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Choose your projects
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add 2 to 4 projects to compare.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#742E85]/10 px-3 py-1.5 text-xs font-bold text-[#742E85]">
                {selectedProjects.length} of {MAX_PROJECTS} projects selected
              </span>
              {selectedProjects.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div
              role="status"
              className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-5 text-sm text-gray-600"
            >
              <LoaderCircle
                size={19}
                aria-hidden="true"
                className="animate-spin text-[#742E85]"
              />
              Loading projects…
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="flex items-start gap-2 text-sm text-red-700">
                <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
                {error}
              </p>
              <button
                type="button"
                onClick={loadProjects}
                className="rounded-lg bg-[#742E85] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5e246c]"
              >
                Try again
              </button>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
              <Building2
                size={26}
                aria-hidden="true"
                className="mx-auto mb-2 text-gray-400"
              />
              <p className="font-semibold text-gray-800">No projects found</p>
              <p className="mt-1 text-sm text-gray-500">
                There are no projects available to compare right now.
              </p>
            </div>
          ) : (
            <ProjectSelector
              projects={projects}
              selectedIds={selectedIds}
              onSelect={addProject}
              disabled={selectedIds.length >= MAX_PROJECTS}
            />
          )}
        </div>

        {selectedProjects.length > 0 && (
          <section aria-label="Selected projects" className="mb-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-gray-900">
                Selected projects
              </h2>
              <span className="text-xs font-medium text-gray-500">
                {selectedProjects.length} of {MAX_PROJECTS} Projects Selected
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto overscroll-x-contain pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4">
              {selectedProjects.map((project) => {
                const location = getLocation(project);

                return (
                  <article
                    key={project._id}
                    className="flex min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:min-w-0"
                  >
                    <ProjectThumbnail
                      project={project}
                      className="h-16 w-20 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-gray-900">
                        {project.projectName || "Unnamed project"}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-gray-600">
                        {project.builderName || "Developer not available"}
                      </p>
                      <p className="mt-1 flex items-center gap-1 truncate text-[11px] text-gray-500">
                        <MapPin
                          size={12}
                          aria-hidden="true"
                          className="shrink-0"
                        />
                        {location || "Location not available"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProject(project._id)}
                      aria-label={`Remove ${project.projectName || "project"} from comparison`}
                      title="Remove project"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-[#742E85]"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {selectedProjects.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-[#742E85]/30 bg-white px-5 py-10 text-center shadow-sm sm:py-14">
            {/* <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#742E85]/10 text-[#742E85]">
              <Building2 size={22} aria-hidden="true" />
            </span> */}
            <h2 className="text-lg font-bold text-gray-900">
              Select at least 2 projects
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Search for projects above and add them to see their details
              compared side by side.
            </p>
          </div>
        ) : (
          <section aria-labelledby="comparison-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="comparison-heading"
                  className="text-xl font-bold text-gray-950"
                >
                  Project comparison
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Scroll horizontally to view all selected projects.
                </p>
              </div>
              <span className="text-xs font-medium text-gray-500">
                {selectedProjects.length} projects
              </span>
            </div>
            <ComparisonTable
              projects={selectedProjects}
              onRemove={removeProject}
            />
            <p className="mt-3 text-xs text-gray-500">
              Values marked “Not Available” are not present in the project
              record.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}
