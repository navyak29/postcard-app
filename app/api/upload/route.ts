import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "file must be an image" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";

  try {
    const blob = await put(`postcards/${nanoid(10)}.${ext}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Failed to upload image:", err);
    return NextResponse.json(
      { error: "Image upload failed. Try again." },
      { status: 500 }
    );
  }
}
