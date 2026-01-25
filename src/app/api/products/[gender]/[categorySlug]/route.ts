import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const allowedGenders = new Set(["MALE", "FEMALE", "UNISEX"]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ gender: string; categorySlug: string }> }
) {
  const { searchParams } = new URL(request.url);
  const { gender, categorySlug } = await params;

  const genderUpper = gender.toUpperCase();
  if (!allowedGenders.has(genderUpper)) {
    return NextResponse.json({ error: "Invalid gender" }, { status: 400 });
  }

  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "12");
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          slug: categorySlug,
          gender: genderUpper,
          isActive: true,
        },
      },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    }),
    prisma.product.count({
      where: {
        isActive: true,
        category: { slug: categorySlug, gender: genderUpper, isActive: true },
      },
    }),
  ]);

  return NextResponse.json({
    products,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total,
      limit,
    },
  });
}
