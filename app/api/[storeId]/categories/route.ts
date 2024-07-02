import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change this to your frontend domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, billboardId, imageUrl } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 403,
        headers: corsHeaders,
      });
    }

    if (!name) {
      return new NextResponse("Name is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", {
        status: 405,
        headers: corsHeaders,
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category, { headers: corsHeaders });
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const categories = await prisma.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories, { headers: corsHeaders });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
