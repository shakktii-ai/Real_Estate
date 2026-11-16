"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Award,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Home,
  LoaderCircle,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import ProjectImage from "@/components/ProjectImage";
import { getProjectCoverImage } from "@/lib/projectImages";

const MAX_PROJECTS = 4;
const PROPERTY_OPTIONS = ["Residential", "Commercial", "Plot"];
const STATUS_OPTIONS = ["Ready", "Under Construction", "Late Possession"];
const PUNE_LOCATION_OPTIONS = [
  { value: "Pune", label: "Pune" },
  { value: "Hadapsar", label: "Pune - Hadapsar" },
  { value: "Kondhwa", label: "Pune - Kondhwa" },
  { value: "Pisoli", label: "Pune - Pisoli" },
  { value: "Undri", label: "Pune - Undri" },
  { value: "Mohammed Wadi", label: "Pune - Mohammed Wadi" },
  { value: "Salisbury Park", label: "Pune - Salisbury Park" },
  { value: "Gultekdi", label: "Pune - Gultekdi" },
  { value: "Wadachi Wadi", label: "Pune - Wadachi Wadi" },
  { value: "NIBM Road", label: "Pune - NIBM Road" },
  { value: "Lullanagar", label: "Pune - Lullanagar" },
  { value: "Mahadev wadi", label: "Pune - Mahadev wadi" },
  { value: "NIBM Annex", label: "Pune - NIBM Annex" },
  { value: "Ked Nagar undri", label: "Pune - Ked Nagar undri" },
  {
    value: "Tribica High street Nibm",
    label: "Pune - Tribica High street Nibm",
  },
];

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

function getUniqueOptions(projects, getValue) {
  const uniqueOptions = new Map();
  projects.flatMap(getValue).forEach((value) => {
    if (typeof value !== "string" || !value.trim()) return;
    const option = value.trim();
    const normalizedOption = option.toLocaleLowerCase();
    if (!uniqueOptions.has(normalizedOption)) {
      uniqueOptions.set(normalizedOption, option);
    }
  });
  return [...uniqueOptions.values()].sort((a, b) => a.localeCompare(b));
}

function getStartingPriceInRupees(project) {
  const price = project.pricing?.displayPrice;
  if (typeof price !== "string") return null;

  const amountMatch = price.match(/([\d,]+(?:\.\d+)?)/);
  const unitMatch = price.match(/(crores?|cr|lakhs?|l|k)\b/i);
  if (!amountMatch || !unitMatch) return null;

  const amount = Number.parseFloat(amountMatch[1].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const unit = unitMatch[1].toLowerCase();
  const multiplier = unit.startsWith("cr")
    ? 10000000
    : unit.startsWith("l")
      ? 100000
      : 1000;
  return amount * multiplier;
}

function getComparableConfigurations(project) {
  return new Set(
    (Array.isArray(project.configuration) ? project.configuration : [])
      .filter((configuration) => typeof configuration === "string")
      .map((configuration) => configuration.trim())
      .filter(Boolean)
      .map((configuration) =>
        configuration.replace(/\s+/g, " ").toLocaleLowerCase()
      )
  );
}

function getPossessionTimestamp(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const monthYear = value.trim().match(/^([a-z]+)\s+(\d{4})$/i);
  if (monthYear) {
    const monthIndex = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ].findIndex((month) => month.startsWith(monthYear[1].toLowerCase()));
    if (monthIndex >= 0) {
      return Date.UTC(Number(monthYear[2]), monthIndex, 1);
    }
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getRecommendation(projects) {
  if (!projects.length) return null;

  let candidates = projects.map((project, index) => ({ project, index }));
  const reasons = [];
  const readyCandidates = candidates.filter(
    ({ project }) => project.status === "Ready"
  );

  if (readyCandidates.length) {
    const readyProjectsNarrowedCandidates =
      readyCandidates.length < candidates.length;
    candidates = readyCandidates;
    reasons.push(
      readyProjectsNarrowedCandidates
        ? "Ready-to-move status: prioritized projects marked Ready."
        : "All compared projects are marked Ready."
    );
  } else {
    reasons.push("No project is marked Ready; the next priority is considered.");
  }

  if (candidates.length > 1) {
    const configurationSets = candidates.map(({ project }) =>
      getComparableConfigurations(project)
    );
    const sharedConfigurations = [...configurationSets[0]].filter(
      (configuration) =>
        configurationSets.every((configurations) =>
          configurations.has(configuration)
        )
    );
    const sharedConfigurationLabels = sharedConfigurations.map(
      (configuration) =>
        candidates[0].project.configuration.find(
          (item) =>
            typeof item === "string" &&
            item.trim().replace(/\s+/g, " ").toLocaleLowerCase() ===
              configuration
        )
    );
    const prices = candidates.map(({ project }) =>
      getStartingPriceInRupees(project)
    );

    if (sharedConfigurations.length && prices.every(Number.isFinite)) {
      const lowestPrice = Math.min(...prices);
      const lowerPricedCandidates = candidates.filter(
        (_, index) => prices[index] === lowestPrice
      );
      candidates = lowerPricedCandidates;
      reasons.push(
        candidates.length < prices.length
          ? `Lower listed price for the shared ${sharedConfigurationLabels.join(
              ", "
            )} configuration${sharedConfigurations.length > 1 ? "s" : ""}.`
          : `Listed prices are equal for the shared ${sharedConfigurationLabels.join(
              ", "
            )} configuration${sharedConfigurations.length > 1 ? "s" : ""}.`
      );
    } else if (!sharedConfigurations.length) {
      reasons.push(
        "Price was not used: the remaining projects have no shared configuration."
      );
    } else {
      reasons.push(
        "Price was not used: comparable listed prices are not available for every remaining project."
      );
    }
  }

  if (candidates.length > 1) {
    const possessionDates = candidates.map(({ project }) =>
      getPossessionTimestamp(project.possessionDate)
    );
    if (possessionDates.every(Number.isFinite)) {
      const earliestPossession = Math.min(...possessionDates);
      const earliestCandidates = candidates.filter(
        (_, index) => possessionDates[index] === earliestPossession
      );
      candidates = earliestCandidates;
      reasons.push(
        candidates.length < possessionDates.length
          ? "Earlier stated possession date."
          : "Stated possession dates are equal."
      );
    } else {
      reasons.push(
        "Possession dates were not used because a comparable date is unavailable."
      );
    }
  }

  if (candidates.length > 1) {
    const progressValues = candidates.map(({ project }) =>
      typeof project.constructionProgress === "number" &&
      Number.isFinite(project.constructionProgress) &&
      project.constructionProgress >= 0 &&
      project.constructionProgress <= 100
        ? project.constructionProgress
        : null
    );
    if (progressValues.every(Number.isFinite)) {
      const highestProgress = Math.max(...progressValues);
      const highestProgressCandidates = candidates.filter(
        (_, index) => progressValues[index] === highestProgress
      );
      candidates = highestProgressCandidates;
      reasons.push(
        candidates.length < progressValues.length
          ? "Higher reported construction progress."
          : "Reported construction progress is equal."
      );
    } else {
      reasons.push(
        "Construction progress was not used because a valid value is unavailable."
      );
    }
  }

  const recommended = candidates.reduce(
    (first, candidate) => (candidate.index < first.index ? candidate : first),
    candidates[0]
  );
  if (candidates.length > 1) {
    reasons.push("Selection order was used to resolve the remaining tie.");
  }

  return { project: recommended.project, reasons };
}

function RecommendationPanel({ projects }) {
  const recommendation = getRecommendation(projects);
  const recommendedProject = recommendation?.project;

  return (
    <aside
      aria-labelledby="comparison-recommendations-heading"
      className="mt-6 overflow-hidden rounded-2xl border border-[#742E85]/15 bg-white shadow-sm"
    >
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-[#742E85]/[0.07] to-white px-5 py-4 sm:px-6">
        {/* <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#742E85] text-white shadow-sm">
          <Award size={20} aria-hidden="true" />
        </span> */}
        <div className="min-w-0">
          <h3
            id="comparison-recommendations-heading"
            className="text-base font-bold text-gray-900"
          >
            Our recommendation
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Ranked using your priorities and the project details available.
          </p>
        </div>
      </div>
      {recommendedProject ? (
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
          <div className="flex min-w-0 items-center gap-4">
            <ProjectThumbnail
              project={recommendedProject}
              className="h-20 w-24 rounded-xl"
            />
            <div className="min-w-0">
              <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck size={13} aria-hidden="true" />
                Recommended match
              </span>
              <h4 className="text-lg font-bold leading-snug text-gray-950">
                {recommendedProject.projectName || "Unnamed project"}
              </h4>
              <p className="mt-1 truncate text-sm text-gray-600">
                {recommendedProject.builderName || "Developer not available"}
                {getLocation(recommendedProject)
                  ? ` · ${getLocation(recommendedProject)}`
                  : ""}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#742E85]">
                {recommendedProject.pricing?.displayPrice || "Price not available"}
              </p>
            </div>
          </div>
          {/* <div className="rounded-xl border border-gray-100 bg-[#FAF9FB] p-4 sm:p-5">
            <h5 className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Why this project
            </h5>
            <ol className="mt-3 space-y-2.5">
              {recommendation.reasons.map((reason, index) => (
                <li
                  key={`${index}-${reason}`}
                  className="flex gap-2.5 text-sm leading-5 text-gray-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#742E85]/10 text-[10px] font-bold text-[#742E85]">
                    {index + 1}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-xs leading-5 text-gray-500 lg:col-span-2">
            Price is compared only when all remaining candidates share a
            configuration. Recommendations reflect listed information only
            and are not investment advice.
          </p> */}
        </div>
      ) : (
        <p className="p-5 text-sm text-gray-600">
          Select projects to see a recommendation.
        </p>
      )}
    </aside>
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
  const [filters, setFilters] = useState({
    location: "",
    property: "",
    status: "",
  });
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
        (!normalizedQuery || getSearchText(project).includes(normalizedQuery)) &&
        (!filters.location ||
          filters.location === "Pune" ||
          project.address?.city === filters.location ||
          project.address?.area?.includes(filters.location)) &&
        (!filters.property || project.tags?.includes(filters.property)) &&
        (!filters.status || project.status === filters.status)
    );
  }, [projects, query, filters]);
  const handleSelect = (project) => {
    onSelect(project);
    setQuery("");
    setSearchOpen(false);
    setBrowseOpen(false);
  };

  const locations = useMemo(() => {
    const knownLocations = new Set(
      PUNE_LOCATION_OPTIONS.map((location) => location.value)
    );
    const projectCities = getUniqueOptions(projects, (project) =>
      project.address?.city ? [project.address.city] : []
    )
      .filter((city) => city !== "Pune" && !knownLocations.has(city))
      .map((city) => ({ value: city, label: city }));
    return [...PUNE_LOCATION_OPTIONS, ...projectCities];
  }, [projects]);
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

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
            setBrowseOpen((open) => !open);
            setSearchOpen(false);
          }}
          aria-expanded={browseOpen}
          aria-controls="browse-projects-panel"
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#742E85] bg-white px-4 text-sm font-semibold text-[#742E85] transition hover:bg-[#742E85]/5 focus:outline-none focus:ring-4 focus:ring-[#742E85]/10"
        >
          <Building2 size={17} aria-hidden="true" />
          Browse All Projects
          {activeFiltersCount > 0 && (
            <span className="rounded-full bg-[#742E85]/10 px-2 py-0.5 text-[10px] font-bold">
              {activeFiltersCount} {activeFiltersCount === 1 ? "filter" : "filters"}
            </span>
          )}
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
                  {matches.length} {matches.length === 1 ? "project" : "projects"} found
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        location: "",
                        property: "",
                        status: "",
                      })
                    }
                    className="rounded-lg px-2 py-1.5 text-xs font-semibold text-[#742E85] hover:bg-[#742E85]/5"
                  >
                    Clear filters
                  </button>
                )}
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
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["location", "Location", locations],
                ["property", "Property", PROPERTY_OPTIONS],
                ["status", "Status", STATUS_OPTIONS],
              ].map(([key, label, options]) => (
                <label key={key} className="min-w-0">
                  <span className="mb-1 block text-[11px] font-semibold text-gray-500">
                    {label}
                  </span>
                  <select
                    value={filters[key]}
                    onChange={(event) =>
                      setFilters((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-800 outline-none focus:border-[#742E85] focus:ring-2 focus:ring-[#742E85]/10"
                  >
                    <option value="">All</option>
                    {options.map((option) => (
                      <option
                        key={typeof option === "string" ? option : option.value}
                        value={typeof option === "string" ? option : option.value}
                      >
                        {typeof option === "string" ? option : option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
          <div className="max-h-[45vh] overflow-y-auto overscroll-contain sm:max-h-[50vh]">
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
              <p className="px-4 py-8 text-center text-sm text-gray-500">
                No projects match the current search and filters.
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
            <RecommendationPanel projects={selectedProjects} />
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
