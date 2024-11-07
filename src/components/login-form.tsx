import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { TriangleAlert } from "lucide-react";

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  username: string;
  password: string;
  isLoading?: boolean;
  error?: string;
}

export function LoginForm({
  username,
  password,
  onSubmit,
  onChange,
  isLoading,
  error,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Masuk</CardTitle>
          <CardDescription className="text-center">
            Masukkan nama pengguna dan kata sandi untuk masuk ke akun Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-8">
              <TriangleAlert className="h4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error ?? "Terjadi kesalahan saat mencoba masuk."}
              </AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Nama Pengguna</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username || ""}
                onChange={onChange}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                value={password || ""}
                onChange={onChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
