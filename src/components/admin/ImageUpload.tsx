'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/app/admin/actions';

interface ImageUploadProps {
    defaultValue?: string[];
    onImagesChange?: (urls: string[]) => void;
}

export default function ImageUpload({ defaultValue = [], onImagesChange }: ImageUploadProps) {
    const [images, setImages] = useState<string[]>(defaultValue);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages = [...images];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            try {
                const formData = new FormData();
                formData.append('file', file);

                const publicUrl = await uploadFile(formData);
                newImages.push(publicUrl);
            } catch (error: any) {
                console.error('Error uploading:', error);
                alert(`Error al subir imagen: ${error.message}`);
                continue;
            }
        }

        setImages(newImages);
        onImagesChange?.(newImages);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onImagesChange?.(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {images.map((url, index) => (
                    <div key={index} className="relative w-24 h-24 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={url}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover rounded-lg border border-slate-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg hover:border-brand hover:bg-brand/5 transition-all text-slate-400 hover:text-brand"
                >
                    {uploading ? (
                        <Loader2 size={24} className="animate-spin" />
                    ) : (
                        <>
                            <Upload size={24} />
                            <span className="text-[10px] mt-1 font-medium">Subir</span>
                        </>
                    )}
                </button>
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="O pega una URL de imagen aquí..."
                    className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-brand"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.currentTarget.value.trim();
                            if (url) {
                                const newImages = [...images, url];
                                setImages(newImages);
                                onImagesChange?.(newImages);
                                e.currentTarget.value = '';
                            }
                        }
                    }}
                />
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                multiple
                className="hidden"
            />

            <div className="hidden">
                <input name="images" id="images_input" type="hidden" value={images.join(', ')} />
            </div>

            <p className="text-[10px] text-slate-400">
                Puedes subir varias fotos a la vez o pegar URLs externas. Las fotos subidas se guardan permanentemente.
            </p>
        </div>
    );
}
