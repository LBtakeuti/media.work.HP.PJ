import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "service-tags.json");

interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

// Ensure data directory and file exist
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// GET: Fetch all service tags
export async function GET() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tags: Tag[] = JSON.parse(data);
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error reading service tags:", error);
    return NextResponse.json({ error: "Failed to load service tags" }, { status: 500 });
  }
}

// POST: Create a new service tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Invalid tag name" }, { status: 400 });
    }

    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const tags: Tag[] = JSON.parse(data);

    // Check for duplicates
    if (tags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())) {
      return NextResponse.json({ error: "Tag already exists" }, { status: 400 });
    }

    const newTag: Tag = {
      id: String(Date.now()),
      name,
      createdAt: new Date().toISOString(),
    };

    tags.push(newTag);
    await fs.writeFile(DATA_FILE, JSON.stringify(tags, null, 2));

    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating service tag:", error);
    return NextResponse.json({ error: "Failed to create service tag" }, { status: 500 });
  }
}


