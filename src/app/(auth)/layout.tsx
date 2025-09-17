import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NilTube | Auth",
  description: "Страницы авторизации NilTube",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}
