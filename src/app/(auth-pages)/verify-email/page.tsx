import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "your email";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Blobs for background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify your email</CardTitle>
            <CardDescription>
              We&apos;ve sent a verification link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Please check your inbox and click the verification link to
              complete your registration.
            </p>
            <p className="text-muted-foreground text-sm">
              If you don&apos;t see the email, check your spam folder.
            </p>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild variant="outline">
                <Link href="/login">Return to login</Link>
              </Button>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Wrong email?</p>
              <Link href="/sign-up" className="text-slate-700 hover:underline">
                Sign up with a different email
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
