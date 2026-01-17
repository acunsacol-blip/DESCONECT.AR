export default function BentoGrid({ images }: { images: string[] }) {
    if (!images || images.length === 0) return null;

    // Simple layout logic:
    // 1 image: Full width
    // 2 images: Two cols
    // 3 images: One big, two small
    // 4 images: Grid
    // 5+ images: Bento style (Big one, grid others)

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] mb-8">
            {/* Main Hero Image */}
            <div className={`relative rounded-xl overflow-hidden ${images.length > 2 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 row-span-2'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[0]} alt="Main property view" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Secondary Images */}
            {images.slice(1, 5).map((img, i) => ( // Show max 4 more images
                <div key={i} className="relative rounded-xl overflow-hidden hidden md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Property view ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
            ))}

            {/* If less than 5 images (1 main + 4 others), we might have empty slots in the grid definition above. 
            Tailwind Grid auto placement handles it reasonably well, but we forced some cols. 
            For a robust Bento, we usually map specifically based on index.
        */}
        </div>
    );
}
