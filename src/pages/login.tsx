"use client";

import { signIn } from "next-auth/react";
import { LoginForm } from "~/components/login-form";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { useRouter } from "next/router";

type LoginInput = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [loginInput, setLoginInput] = useState<LoginInput>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginInput((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: loginInput.username,
        password: loginInput.password,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(result.error);
        // Handle error (e.g., show error message to user)
      } else {
        await router.push("/");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      // Handle unexpected error (e.g., show error message to user)
    }
    setIsLoading(false);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm
        onChange={handleChange}
        onSubmit={handleSubmit}
        username={loginInput.username}
        password={loginInput.password}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
