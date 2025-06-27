import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChefHat, Sparkles } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface FooterProps {
  user?: User | null;
}

export function Footer({ user }: FooterProps) {
  return (
    <footer className="border-t border-slate-700/50 py-12 px-4 bg-slate-900/50 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <ChefHat className="w-8 h-8 text-blue-400" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-0.5 -right-0.5" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                plAIte
              </span>
            </div>
            <p className="text-slate-400 max-w-md mb-4">
              Transform your meal planning with AI-powered personalisation.
              Create perfect meal plans tailored to your lifestyle and dietary
              needs.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <span>Made with</span>
              <span className="text-red-400">❤️</span>
              <span>for healthier eating.</span>
              <Link href={"https://shed61.co.uk"}>By Shed61</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              {/* <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Features
                </Button>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Pricing
                </Button>
              </div> */}
              {user ? (
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                    asChild
                  >
                    <Link href="/account">Account</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                      asChild
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                      asChild
                    >
                      <Link href="/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <div className="space-y-2">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-slate-800 py-0.5 px-1 h-auto hover:bg-slate-50"
                  asChild
                >
                  <Link href="/subscriptions">Subscriptions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} plAIte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
