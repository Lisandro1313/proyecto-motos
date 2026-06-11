export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Reduce y comprime la imagen en el navegador antes de guardarla.
// Así una foto de celular (varios MB) queda en ~100-200 KB y entra
// cómoda en Firestore (límite 1 MB por documento). Devuelve un data URL.
export async function readImageAsResizedDataUrl(
  file: File,
  maxSize = 1100,
  quality = 0.72,
): Promise<string> {
  const originalDataUrl = await readFileAsDataUrl(file);

  // SVG o formatos no rasterizables: devolver tal cual.
  if (!/^data:image\/(jpeg|jpg|png|webp)/i.test(originalDataUrl)) {
    return originalDataUrl;
  }

  try {
    const image = await loadImage(originalDataUrl);
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return originalDataUrl;

    context.drawImage(image, 0, 0, width, height);
    const resized = canvas.toDataURL("image/jpeg", quality);

    // Si por algún motivo quedó más grande, conservar el original.
    return resized.length < originalDataUrl.length ? resized : originalDataUrl;
  } catch {
    return originalDataUrl;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}
