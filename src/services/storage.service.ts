import { supabase } from '../lib/supabase';

export const IMAGES_BUCKET = 'images';
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const createImagePath = (file: File, folder: string): string => {
    const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    return `${folder}/${crypto.randomUUID()}/image.${extension}`;
};

const getStorageError = (error: unknown, fallback: string): Error => {
    const storageError = error as { message?: string; statusCode?: string | number; status?: number };
    const rawMessage = storageError.message || (error instanceof Error ? error.message : '');
    const message = rawMessage.toLowerCase();

    if (message.includes('bucket not found') || message.includes('not found')) {
        return new Error(`Supabase Storage bucket "${IMAGES_BUCKET}" was not found. Create it in Supabase Dashboard > Storage.`);
    }

    if (message.includes('permission') || message.includes('not authorized') || message.includes('row-level') || message.includes('policy')) {
        return new Error('Image storage permission denied. Check the Supabase Storage policies.');
    }

    if (message.includes('network') || message.includes('fetch')) {
        return new Error('Could not connect to image storage. Check your internet connection.');
    }

    if (storageError.status === 400 || storageError.statusCode === '400') {
        return new Error('Supabase rejected the image upload. Check that the images bucket exists and its upload policy is enabled.');
    }

    return new Error(fallback);
};

const validateImage = (file: File): void => {
    if (!file) throw new Error('Please select an image file.');
    if (!file.type.startsWith('image/')) throw new Error('Please select a valid image file.');
    if (file.size > MAX_IMAGE_SIZE_BYTES) throw new Error('Image must be smaller than 10 MB.');
};

export const storageService = {
    uploadFile: async (file: File, path: string, bucket = IMAGES_BUCKET): Promise<string> => {
        if (!file) throw new Error('Please select a file.');
        if (!path.trim()) throw new Error('A storage path is required.');

        const { error } = await supabase.storage.from(bucket).upload(path, file, {
            cacheControl: '3600',
            contentType: file.type || undefined,
            upsert: false,
        });

        if (error) throw getStorageError(error, 'The file could not be uploaded.');
        return path;
    },

    uploadImage: async (file: File, path: string): Promise<string> => {
        validateImage(file);
        return storageService.uploadFile(file, path, IMAGES_BUCKET);
    },

    deleteFile: async (path: string, bucket = IMAGES_BUCKET): Promise<void> => {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw getStorageError(error, 'The file could not be deleted.');
    },

    getPublicUrl: (path: string, bucket = IMAGES_BUCKET): string => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    },
};
