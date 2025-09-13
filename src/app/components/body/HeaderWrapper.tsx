"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
    const pathname = usePathname();
    const hiddenHeaderRoutes = ["/login", "/register"];

    if (hiddenHeaderRoutes.includes(pathname)) {
        return null;
    }

    return <Header />;
}
