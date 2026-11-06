import Image from "next/image";

function canUseNextImage(src) {
  if (typeof src !== "string" || !src) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;

  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

export default function ProjectImage({
  src,
  alt,
  sizes = "100vw",
  className = "",
  preload = false,
  draggable = false,
}) {
  if (!src) return null;

  if (!canUseNextImage(src)) {
    return (
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        className={className}
        loading={preload ? "eager" : "lazy"}
        draggable={draggable}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      preload={preload}
      draggable={draggable}
    />
  );
}
