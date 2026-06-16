/**
 * Admin layout — intentionally strips the global Navbar and Footer.
 * All /admin/* pages get a bare shell.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
