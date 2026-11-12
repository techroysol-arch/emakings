import { AuthForm } from "@/components/auth-form";
import { Nav } from "@/components/nav";
export const metadata = {
  title: "Get started",
  robots: { index: false, follow: false },
};
export default function Signup() {
  return (
    <>
      <Nav />
      <main>
        <AuthForm signup />
      </main>
    </>
  );
}
