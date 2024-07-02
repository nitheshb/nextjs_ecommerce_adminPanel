// import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

// import prismadb from '@/lib/prismadb';

// export async function POST(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const { userId } = auth();

//     const body = await req.json();

//     const { label, imageUrl } = body;

//     if (!userId) {
//       return new NextResponse("Unauthenticated", { status: 403 });
//     }

//     if (!label) {
//       return new NextResponse("Label is required", { status: 400 });
//     }

//     if (!imageUrl) {
//       return new NextResponse("Image URL is required", { status: 400 });
//     }

//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
//     }

//     const storeByUserId = await prismadb.store.findFirst({
//       where: {
//         id: params.storeId,
//         userId,
//       }
//     });

//     if (!storeByUserId) {
//       return new NextResponse("Unauthorized", { status: 405 });
//     }

//     const billboard = await prismadb.billboard.create({
//       data: {
//         label,
//         imageUrl,
//         storeId: params.storeId,
//       }
//     });

//     return NextResponse.json(billboard);
//   } catch (error) {
//     console.log('[BILLBOARDS_POST]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
//     }

//     const billboards = await prismadb.billboard.findMany({
//       where: {
//         storeId: params.storeId
//       }
//     });

//     return NextResponse.json(billboards);
//   } catch (error) {
//     console.log('[BILLBOARDS_GET]', error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// };
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

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

    const { productId, status } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", {
        status: 403,
        headers: corsHeaders,
      });
    }

    if (!productId) {
      return new NextResponse("Product ID is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!status) {
      return new NextResponse("Status is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const storeByUserId = await prismadb.store.findFirst({
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

    const booking = await prismadb.booking.create({
      data: {
        productId,
        status,
        storeId: params.storeId,
        userId,
      },
    });

    return NextResponse.json(booking, { headers: corsHeaders });
  } catch (error) {
    console.log("[BOOKINGS_POST]", error);
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
      return new NextResponse("Store ID is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const bookings = await prismadb.booking.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(bookings, { headers: corsHeaders });
  } catch (error) {
    console.log("[BOOKINGS_GET]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
