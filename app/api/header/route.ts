// app/api/header/route.ts
import { currentUser, auth } from "@clerk/nextjs/server";
import { getHeaderData, getCategoriesForNav } from "@/sanity/queries/header";
import { getMyOrders } from "@/sanity/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    const { userId } = await auth();
    
    const [headerData, categories] = await Promise.all([
      getHeaderData(),
      getCategoriesForNav(),
    ]);

    let orders = null;
    if (userId) {
      orders = await getMyOrders(userId);
    }

    return NextResponse.json({
      user,
      userId,
      headerData,
      categories,
      orders,
    });
  } catch (error) {
    console.error("Error fetching header data:", error);
    return NextResponse.json(
      { error: "Failed to fetch header data" },
      { status: 500 }
    );
  }
}