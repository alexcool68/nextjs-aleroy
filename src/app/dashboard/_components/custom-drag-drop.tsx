import React from 'react';
import Image from 'next/image';
import { DragEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface customDragDropProps {
    updateFileUpload: (file: File) => void;
    removeFile?: boolean;
}

function CustomDragDrop({ updateFileUpload, removeFile }: customDragDropProps) {
    const FileInput = useRef(null) as unknown as React.MutableRefObject<HTMLInputElement>;

    // drag state
    const [dragActive, setDragActive] = useState(false);

    // handle drag events
    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragover' || e.type === 'dragenter') {
            setDragActive(true);
        } else if (e.type === 'dragleave' || e.type === 'drop') {
            setDragActive(false);
        }
    };

    // handle drop event
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            updateFileUpload(e.dataTransfer.files[0]);
            setDragActive(false);
        }
    };

    // handle change event
    const handleChange = (e: FormEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.files && e.target.files.length > 0) {
            updateFileUpload(e.target.files[0]);
        }
    };

    // remove file
    useEffect(() => {
        if (removeFile) {
            FileInput.current.value = '';
        }
    }, [removeFile]);

    return (
        <div>
            <div onDragEnter={handleDrag} className="relative p-5 py-6 bg-background border border-dashed rounded-lg max-h-60">
                <input
                    ref={FileInput}
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleChange}
                    accept="image/jpeg, image/jpg, image/png"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer border-2"
                />
                <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="h-32 w-32 text-secondary" />

                    <div className="text-center">
                        <p className="font-bold text-primary">Tap or drag and drop to upload Image</p>
                        <span>PNG, JPEG</span>
                    </div>
                </div>
            </div>

            {dragActive && (
                <div
                    className="absolute top-0 left-0 w-full h-full z-20"
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                ></div>
            )}
        </div>
    );
}

export default CustomDragDrop;
