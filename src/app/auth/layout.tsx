import { T } from "@/lib/tokens";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: T.bg, minHeight: "100vh" }}>
      {children}
    </div>
  );
}
