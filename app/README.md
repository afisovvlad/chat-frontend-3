В проекте 3 layout: RootLayout, AuthLayout, MainLayout.
RootLayout - определяет общую структуру (head, body), подключает глобальные стили и шрифты.
MainLayout - шаблон для всех страниц приложения, включает Header и Sidebar и оборачивает проект в Container.
AuthLayout - шаблон для страниц login и registration.
Каждый layout может при необходимости иметь свои стили layout.module.scss

Домашняя страница (page.tsx, - внутри называется HomePage) должна находиться в папке main.
