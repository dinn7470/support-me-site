import { supabase } from "../supabase-client";
export async function uploadImage(file, userId) {
    const timestamp = Date.now();
    // Sanitize name
    const name = file.name.split("/").pop()?.split("\\").pop() || "upload";
    const fileExt = name.split(".").pop();
    const fileName = `${userId}-${timestamp}.${fileExt}`;
    const filePath = fileName;
    const { error: uploadError } = await supabase.storage
        .from("device-images")
        .upload(filePath, file, { upsert: true });
    if (uploadError) {
        throw new Error("Image upload failed: " + uploadError.message);
    }
    const { data, error: urlError } = await supabase.storage
        .from("device-images")
        .createSignedUrl(filePath, 60 * 60); // 1-hour valid URL
    if (urlError) {
        throw new Error("Failed to get signed URL: " + urlError.message);
    }
    console.log("✅ Uploaded image signed URL:", data?.signedUrl);
    return data?.signedUrl ?? "";
}
