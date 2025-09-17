import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Upload a single file to Supabase Storage
export async function uploadFile(bucket, file, path) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Upload multiple files to Supabase Storage
export async function uploadMultipleFiles(bucket, files, basePath) {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}-${index}.${fileExtension}`;
      const filePath = `${basePath}/${fileName}`;
      
      return uploadFile(bucket, file, filePath);
    });

    const results = await Promise.all(uploadPromises);
    
    // Check if all uploads were successful
    const failedUploads = results.filter(result => !result.success);
    if (failedUploads.length > 0) {
      return {
        success: false,
        error: `Failed to upload ${failedUploads.length} files`,
        results
      };
    }

    return {
      success: true,
      results: results.map(result => ({
        path: result.path,
        url: result.url
      }))
    };
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Delete a file from Supabase Storage
export async function deleteFile(bucket, path) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Get public URL for a file
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}

// List files in a bucket folder
export async function listFiles(bucket, folder) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder);

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data
    };
  } catch (error) {
    console.error('Error listing files:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
