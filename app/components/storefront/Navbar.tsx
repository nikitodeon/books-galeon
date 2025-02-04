"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { NavbarLinks } from "./NavbarLinks";
import { ShoppingBagIcon } from "lucide-react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { LoginButton, RegisterButton } from "../AuthButtons";
import Image from "next/image";
import { Hero } from "./Hero";
import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "next-themes";
import { User } from "next-auth";
import SearchBar from "./SearchBar";

// Тип данных для пользователя

interface NavbarProps {
  user: User | null; // Пропс для передачи данных о пользователе
  banners: { id: string; imageString: string; title: string }[]; // Пропс для баннеров
}

export function Navbar({ user, banners }: NavbarProps) {
  const { theme, resolvedTheme } = useTheme(); // Получаем текущую тему
  const [themeLoaded, setThemeLoaded] = useState(false); // Состояние для отслеживания загрузки темы

  useEffect(() => {
    if (theme) {
      setThemeLoaded(true); // Обновляем состояние, когда тема загружена
    }
  }, [theme]);

  // Если тема не загружена, показываем индикатор загрузки
  if (!themeLoaded) {
    return <div>Загрузка...</div>;
  }

  // Логика для смены логотипа в зависимости от темы
  const logoPath =
    resolvedTheme === "dark" ? "/blacklogo.png" : "/whitelogo.png";

  return (
    <div>
      <nav className="w-full max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <NavbarLinks />
        </div>

        <div className="flex items-center ">
          {user ? (
            <>
              <div className="mt-2 mr-13">
                <ThemeToggle />
              </div>
              <Link href="/bag" className="group p-2 flex items-center mr-2">
                <ShoppingBagIcon className="h-6 w-6 mt-3 text-gray-400 group-hover:text-gray-500" />
                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {/* {total} */}
                </span>
              </Link>

              <UserDropdown
                email={user.email ?? ""}
                name={user.name ?? ""}
                userImage={`https://avatar.vercel.sh/${user.name}`}
              />
            </>
          ) : (
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-2">
              <div className="mt-2">
                <ThemeToggle />
              </div>
              <LoginButton />
              <span className="h-6 w-px bg-gray-200"></span>
              <Button variant="ghost" asChild>
                <RegisterButton />
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Левый баннер */}
        <div className="hidden md:flex w-1/4 h-24 bg-gray-100 items-center justify-center">
          <span className="text-gray-500">Левый баннер</span>
        </div>

        {/* Логотип */}
        <div className="flex flex-col items-center w-1/2">
          <Link href="/">
            <Image
              src={logoPath} // Логотип меняется в зависимости от темы
              alt="Logo"
              width={250}
              height={250}
              className="mx-auto"
            />
          </Link>
          {/* Описание */}
          <p className="mt-4 text-center text-md text-gray-600 font-moondance">
            Ветер в твоих парусах,
            <br /> открывай море историй!
          </p>
          {/* Поле поиска */}
          {/* <div className="mt-4 w-full max-w-md"> */}
          <div className="mx-auto w-full max-w-md  mt-4 flex flex-col ">
            <SearchBar />
          </div>
        </div>

        {/* Правый баннер */}
        <div className="md:flex w-1/4 min-h-41">
          <div className="w-full h-full">
            <Hero banners={banners} />
          </div>
        </div>
      </div>
    </div>
  );
}
