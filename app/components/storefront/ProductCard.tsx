import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
  };
}

interface iAppPropsTwo {
  category?: { id: string; title: string; createdAt: Date; slug: string }; // Сделано опциональным
  item: {
    id: string;
    name: string;
    description: string;
    status: ProductStatus;
    price: Decimal;
    images: string[];
    isFeatured: boolean;
    createdAt: Date;
    categoryId: string;
  };
}

export function ProductCard({ item }: iAppProps | iAppPropsTwo) {
  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {item.images.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  src={item}
                  alt="Product Image"
                  fill
                  className="object-contain w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious small className="ml-16" />
        <CarouselNext small className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-center mt-2">
        <h1 className="font-semibold text-xl customline-clamp-3 custom">
          {item.name}
        </h1>
        <h3 className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/10">
          {item.price.toString()} BYN
        </h3>
      </div>
      <p className="text-gray-600 text-sm mt-2 customline-clamp-2 custom-description">
        {item.description}
      </p>

      <Button asChild className="w-full mt-5">
        <Link className="custom-button " href={`/product/${item.id}`}>
          Подробнее
        </Link>
      </Button>
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
}
