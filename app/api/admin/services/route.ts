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

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to get services:", error);
    return NextResponse.json(
      { error: "Failed to get services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const services = await getServices();
    
    const newId = String(Math.max(0, ...services.map(s => parseInt(s.id) || 0)) + 1);
    
    const newService = {
      ...body,
      id: newId,
    };
    
    services.unshift(newService);
    await saveServices(services);
    
    return NextResponse.json(newService);
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}


