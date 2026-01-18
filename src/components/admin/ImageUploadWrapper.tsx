'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

export default function ImageUploadWrapper({ defaultValue = [] }: { defaultValue?: string[] }) {
    const [images, setImages] = useState<string[]>(defaultValue);

    return (
        <div>
            <ImageUpload
                defaultValue={defaultValue}
                onImagesChange={setImages}
            />
            {/* The hidden input is already in ImageUpload, but let's make sure it's here if we want to be explicit or if we want to handle the state here */}
            {/* Actually, my ImageUpload already has the hidden input. Let's verify that. */}
        </div>
    );
}
