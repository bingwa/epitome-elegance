import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const productCount = await prisma.product.count();
    const activeProducts = await prisma.product.count({ where: { isActive: true } });
    const featuredProducts = await prisma.product.count({ where: { isFeatured: true } });
    const categories = await prisma.category.findMany({ where: { isActive: true } });
    
    const sampleProducts = await prisma.product.findMany({
      where: { isActive: true },
      take: 3,
      include: { category: true, images: true }
    });

    return NextResponse.json({
      database: "connected ✅",
      counts: {
        total: productCount,
        active: activeProducts,
        featured: featuredProducts,
      },
      categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, gender: c.gender })),
      sampleProducts: sampleProducts.map(p => ({ 
        id: p.id, 
        name: p.name, 
        slug: p.slug,
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        category: p.category.name 
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
