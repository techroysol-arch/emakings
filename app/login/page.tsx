import { AuthForm } from "@/components/auth-form";
import { Nav } from "@/components/nav";
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export default function Login() {
  return (
    <>
      <Nav />
      <main>
        <AuthForm />
      </main>
    </>
  );
}
