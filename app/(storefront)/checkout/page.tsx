"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CheckoutSidebar,
  Container,
  Title,
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
} from "@/shared/components";
import { CheckoutFormValues, checkoutFormSchema } from "@/shared/constants";
// import { useCart } from '@/shared/hooks';
import { createOrder, delItem, updateQuantity } from "@/app/actions";
import toast from "react-hot-toast";
import React from "react";
import { useSession } from "next-auth/react";
// import { Api } from '@/shared/services/api-client';
import { User } from "next-auth";

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false);
  //   const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
  const { data: session } = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  React.useEffect(() => {
    async function fetchUserInfo() {
      //       const data = await Api.auth.getMe();
      //       const [firstName, lastName] = data.fullName.split(' ');

      //       form.setValue('firstName', firstName);
      //       form.setValue('lastName', lastName);
      //       form.setValue('email', data.email);
      //     }

      //     if (session) {
      //       fetchUserInfo();
      //     }
      //   }, [session]);

      try {
        const response = await fetch("/api/authroute");
        if (!response.ok) throw new Error("Ошибка загрузки пользователя");
        const data: User = await response.json();
        // setCategories(data);
        const [firstName, lastName] = data.name?.split(" ");
        form.setValue("firstName", firstName);
        form.setValue("lastName", lastName);
        form.setValue("email", data.email);
      } catch (error) {
        console.error(error);
      }
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);

      const url = await createOrder(data);

      toast.error("Заказ успешно оформлен! 📝 Переход на оплату... ", {
        icon: "✅",
      });

      if (url) {
        location.href = url;
      }
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      toast.error("Не удалось создать заказ", {
        icon: "❌",
      });
    }
  };

  const onClickCountButton = (
    id: string,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateQuantity(id, newQuantity);
  };

  return (
    <Container className="mt-10">
      <Title
        text="Оформление заказа"
        className="font-extrabold mb-8 text-[36px]"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Левая часть */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                onClickCountButton={onClickCountButton}
                removeCartItem={delItem}
                items={items}
                // loading={loading}
              />

              <CheckoutPersonalForm
                className={
                  // loading ? 'opacity-40 pointer-events-none' :
                  ""
                }
              />

              <CheckoutAddressForm
                className={
                  // loading ? 'opacity-40 pointer-events-none' :
                  ""
                }
              />
            </div>

            {/* Правая часть */}
            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                //   loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
