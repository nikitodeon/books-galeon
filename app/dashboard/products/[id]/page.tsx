import { EditForm } from "@/app/components/dashboard/ProductEditForm";
import { prisma } from "@/app/utils/db";
import { Decimal } from "@prisma/client/runtime/library";
import { notFound } from "next/navigation";

async function getData(productId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!data) {
    return notFound();
  }

  return {
    ...data,
    price:
      data.price instanceof Decimal
        ? data.price.toFixed(2)
        : String(data.price), // 👈 Преобразуем Decimal в строку
  };
}

export default async function EditRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getData(id);
  return <EditForm data={data} />;
}
