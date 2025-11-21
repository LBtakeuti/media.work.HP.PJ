import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "service-tags.json");

interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

// PUT: Update a service tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tags: Tag[] = JSON.parse(data);

    const tagIndex = tags.findIndex((tag) => tag.id === params.id);
    if (tagIndex === -1) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check for duplicates (excluding current tag)
    if (
      tags.some(
        (tag, index) =>
          index !== tagIndex && tag.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return NextResponse.json({ error: "Tag name already exists" }, { status: 400 });
    }

    tags[tagIndex].name = name;
    await fs.writeFile(DATA_FILE, JSON.stringify(tags, null, 2));

    return NextResponse.json(tags[tagIndex]);
  } catch (error) {
    console.error("Error updating service tag:", error);
    return NextResponse.json({ error: "Failed to update service tag" }, { status: 500 });
  }
}

// DELETE: Delete a service tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tags: Tag[] = JSON.parse(data);

    const filteredTags = tags.filter((tag) => tag.id !== params.id);

    if (filteredTags.length === tags.length) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    await fs.writeFile(DATA_FILE, JSON.stringify(filteredTags, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service tag:", error);
    return NextResponse.json({ error: "Failed to delete service tag" }, { status: 500 });
  }
}


