import { NextResponse } from "next/server";
import { getServices } from "@/lib/data";
import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const servicesFilePath = path.join(dataDir, "services.json");

async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function saveServices(services: any[]) {
  await ensureDataDir();
  await fs.writeFile(servicesFilePath, JSON.stringify(services, null, 2), "utf8");
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const services = await getServices();
    const item = services.find((s) => s.id === params.id);
    
    if (!item) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to get service:", error);
    return NextResponse.json(
      { error: "Failed to get service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const services = await getServices();
    const index = services.findIndex((s) => s.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    
    services[index] = {
      ...body,
      id: params.id,
    };
    
    await saveServices(services);
    return NextResponse.json(services[index]);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const services = await getServices();
    const filtered = services.filter((s) => s.id !== params.id);
    
    if (filtered.length === services.length) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }
    
    await saveServices(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}



