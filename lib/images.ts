/**
 * Registry of the original WordPress images (downloaded to /public/images).
 * Dimensions are the intrinsic pixel sizes of the original files, so next/image can
 * reserve the right aspect ratio (no layout shift).
 */
export interface ImageInfo {
  src: string;
  width: number;
  height: number;
}

const DIMS: Record<string, [number, number]> = {
  "247-Taxi-Service.png": [94, 94],
  "About-Western-Cars-Taxi-Gatwick.jpg": [600, 600],
  "Airport-Transfer-Pickup-Taxi.jpg": [600, 600],
  "Business-Accounts.jpg": [600, 600],
  "Button-Background.jpg": [397, 258],
  "Chauffering-Hire.jpg": [600, 600],
  "Contact-Us.jpg": [600, 600],
  "Crawley-Station-Header.jpg": [1920, 1080],
  "Phone-App-Background.jpg": [1024, 589],
  "Services.png": [94, 94],
  "Taxi-Image.jpg": [612, 613],
  "Three-Bridges-Station-Slider.jpg": [1920, 1080],
  "VIP-Taxi-Service.jpg": [600, 600],
  "Wester-Cars-Page-Header.jpg": [1920, 608],
  "Western-Cards-Mercedes.jpg": [1920, 1080],
  "Western-Cars-AppStore-App.png": [157, 53],
  "Western-Cars-Crawley-Taxi-Service.jpg": [1080, 1080],
  "Western-Cars-Google-Play-App.png": [157, 53],
  "Western-Cars-Mobile-App.png": [375, 510],
  "Western-Cars-Taxi-Logo-No-URL.png": [340, 201],
  "Why-Choose-Us.png": [94, 94],
};

/**
 * The four Airport-Taxi-*.jpg uploads on WordPress were byte-identical copies of Taxi-Image.jpg,
 * so they are served from one file. Old upload URLs are 301-redirected (see next.config.ts).
 */
const ALIASES: Record<string, string> = {
  "Airport-Taxi-Biggin-Hill.jpg": "Taxi-Image.jpg",
  "Airport-Taxi-London-City.jpg": "Taxi-Image.jpg",
  "Airport-Taxi-Luton.jpg": "Taxi-Image.jpg",
  "Airport-Taxi-Southend.jpg": "Taxi-Image.jpg",
};

export function image(file: string): ImageInfo {
  const resolved = ALIASES[file] ?? file;
  const dims = DIMS[resolved];
  if (!dims) throw new Error(`Unknown image "${file}" — add it to lib/images.ts`);
  return { src: `/images/${resolved}`, width: dims[0], height: dims[1] };
}
