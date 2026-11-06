export const MAX_PROJECT_IMAGES = 15;
export const MAX_PROJECT_IMAGE_SIZE = 10 * 1024 * 1024;
export const PROJECT_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function getProjectImages(project) {
  const projectImages = Array.isArray(project?.images)
    ? project.images
        .filter((image) => typeof image === "string" || image?.url)
        .map((image, index) =>
          typeof image === "string"
            ? { url: image, isCover: false, order: index, alt: "" }
            : {
                url: image.url,
                isCover: Boolean(image.isCover),
                order: Number.isFinite(Number(image.order))
                  ? Number(image.order)
                  : index,
                alt: image.alt || "",
                category: image.category || "",
              }
        )
        .sort((a, b) => a.order - b.order)
    : [];

  if (!projectImages.length && project?.mainImage) {
    return [
      {
        url: project.mainImage,
        isCover: true,
        order: 0,
        alt: project.projectName || "",
        category: "",
      },
    ];
  }

  if (!projectImages.length) return [];

  const coverIndex = projectImages.findIndex(
    (image) => image.url === project.mainImage
  );
  const markedCoverIndex = projectImages.findIndex((image) => image.isCover);
  const selectedCoverIndex =
    coverIndex >= 0 ? coverIndex : markedCoverIndex >= 0 ? markedCoverIndex : 0;

  return projectImages.map((image, index) => ({
    ...image,
    isCover: index === selectedCoverIndex,
  }));
}

export function getProjectCoverImage(project) {
  return (
    project?.mainImage ||
    getProjectImages(project).find((image) => image.isCover)?.url ||
    getProjectImages(project)[0]?.url ||
    ""
  );
}

export function normalizeProjectImages(images, mainImage = "", defaultAlt = "") {
  const normalizedImages = Array.isArray(images)
    ? images
        .filter((image) => typeof image === "string" || image?.url)
        .map((image, index) =>
          typeof image === "string"
            ? {
                url: image,
                isCover: false,
                order: index,
                alt: defaultAlt,
                category: "",
              }
            : {
                url: image.url,
                isCover: Boolean(image.isCover),
                order: index,
                alt: image.alt || defaultAlt,
                category: image.category || "",
              }
        )
    : [];

  if (!normalizedImages.length && mainImage) {
    return [
      {
        url: mainImage,
        isCover: true,
        order: 0,
        alt: defaultAlt,
        category: "",
      },
    ];
  }

  if (!normalizedImages.length) return [];

  const markedCoverIndex = normalizedImages.findIndex((image) => image.isCover);
  const mainImageIndex = normalizedImages.findIndex(
    (image) => image.url === mainImage
  );
  const coverIndex =
    markedCoverIndex >= 0 ? markedCoverIndex : mainImageIndex >= 0 ? mainImageIndex : 0;

  return normalizedImages.map((image, index) => ({
    ...image,
    isCover: index === coverIndex,
    order: index,
  }));
}

export function isValidProjectImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  if (value.startsWith("/") && !value.startsWith("//")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
