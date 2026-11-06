import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import { getProjectCoverImage } from "@/lib/projectImages";

export default function NewLaunchCard({ project }) {
  const priceLabel = (() => {
    if (project.pricing?.displayPrice) return project.pricing.displayPrice;

    const min = project.pricing?.minPrice ?? project.pricing?.startingPrice;
    const max = project.pricing?.maxPrice ?? project.pricing?.endingPrice;

    if (min || max) {
      const formatValue = (value) => {
        if (!value) return "On Request";
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
        return `₹${value.toLocaleString("en-IN")}`;
      };

      return `${formatValue(min)} - ${formatValue(max)}`;
    }

    return "Price on request";
  })();

  return (
    <Link href={`/properties/${project.slug}`}>
      <div className="group w-full lg:w-[250px] bg-white border border-[#000000] rounded-2xl  p-2  transition cursor-pointer">

        <div className="flex gap-2">
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl shadow-md shadow-black/32">
            <ProjectImage
              src={getProjectCoverImage(project)}
              alt={project.projectName || "Project"}
              sizes="64px"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[12px] font-medium text-black ">
              {project.projectName}
            </h3>

            <p className="text-[10px] text-black  line-clamp-1">
              {project.address?.area}, {project.address?.city}
            </p>

            <p className="text-[12px] font-semibold text-[#742E85] mt-1">
              {priceLabel}
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}