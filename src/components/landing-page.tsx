"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Sparkles,
  Calendar,
  ShoppingCart,
  Zap,
  Check,
  Star,
  Clock,
  Target,
  Users,
  ArrowRight,
  PlayCircle,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface LandingPageProps {
  user: User | null;
  onGetStarted: () => void;
}

export function LandingPage({ user, onGetStarted }: LandingPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Generation",
      description:
        "Advanced AI creates personalized meal plans tailored to your dietary needs and preferences",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Planning",
      description:
        "Generate meal plans from 1-14 days with customizable meals per day",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Nutrition Tracking",
      description:
        "Set specific calorie, protein, carb, and fat targets for optimal nutrition",
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Smart Shopping Lists",
      description:
        "Automatically generated, categorized shopping lists for every meal plan",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Save Time",
      description:
        "No more decision fatigue - get your weekly meal planning done in seconds",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dietary Restrictions",
      description:
        "Support for all dietary needs: vegan, gluten-free, keto, and more",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Busy Professional",
      content:
        "plAIte has completely transformed my meal planning. I save hours every week and eat healthier!",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Fitness Enthusiast",
      content:
        "The macro tracking is perfect for my training goals. Best investment I've made this year.",
      rating: 5,
    },
    {
      name: "Emma L.",
      role: "Parent of 3",
      content:
        "Finally, meal planning that works for our whole family's dietary restrictions. Amazing!",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen landing-gradient-bg text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ChefHat className="w-8 h-8 text-blue-400" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              plAIte
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button variant="ghost" asChild>
                  <Link href="/account">Account</Link>
                </Button>
                <Button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Go to App
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={() =>
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Pricing
                  </Button>
                </div>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 px-4 py-6">
            <div className="space-y-4">
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                  >
                    Features
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setMobileMenuOpen(false);
                    }}
                  >
                    Pricing
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                    asChild
                  >
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                </>
              )}
              {user && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/account">Account</Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={() => {
                      onGetStarted();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Go to App
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Logo/Brand */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <ChefHat className="w-12 h-12 text-blue-400" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                plAIte
              </h1>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your AI-Powered
              <br />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Meal Planning
              </span>
              <br />
              Revolution
            </h2>

            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stop wasting time deciding what to eat. Generate personalized meal
              plans in seconds with AI that understands your dietary needs,
              preferences, and nutrition goals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {user ? "Create Your Plan" : "Start Free Trial"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {!user && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  See How It Works
                </Button>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span>Loved by 1000+ users</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-400" />
                <span>10,000+ meal plans generated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose plAIte?
            </h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful AI meets intuitive design to make meal planning
              effortless and enjoyable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="landing-card bg-slate-800/50 border-slate-700/50 backdrop-blur-md hover:bg-slate-800/70 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-white">
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-300 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h3>
            <p className="text-xl text-slate-300">
              Choose the plan that fits your lifestyle
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white mb-2">Free</CardTitle>
                <div className="text-4xl font-bold text-white mb-2">£0</div>
                <CardDescription className="text-slate-300">
                  Perfect for trying out plAIte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">
                      Up to 5-day meal plans
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">
                      Basic dietary restrictions
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">
                      Shopping list generation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">
                      Save up to 3 meal plans
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-slate-700 hover:bg-slate-600"
                  onClick={onGetStarted}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="pricing-card-popular bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-500/50 backdrop-blur-md relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                  MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl text-white mb-2">Pro</CardTitle>
                <div className="text-4xl font-bold text-white mb-2">£5</div>
                <div className="text-slate-300 mb-2">per month</div>
                <div className="text-sm text-slate-400">
                  or £50/year (save 17%)
                </div>
                <CardDescription className="text-slate-300">
                  For serious meal planners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">
                      Up to 14-day meal plans
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">
                      Advanced AI models (GPT-4)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Unlimited meal plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">
                      Advanced dietary customization
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">
                      Detailed nutrition tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400" />
                    <span className="text-white">Priority support</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  asChild
                >
                  <Link href="/subscriptions">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 text-slate-400">
            <p>30-day money-back guarantee • Cancel anytime • No hidden fees</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h3>
            <p className="text-xl text-slate-300">
              Join thousands of satisfied meal planners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-800/50 border-slate-700/50 backdrop-blur-md"
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="border-t border-slate-700 pt-4">
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Meal Planning?
          </h3>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users who have already revolutionized their meal
            planning with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {user ? "Create Your First Plan" : "Start Free Today"}
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg rounded-xl"
                asChild
              >
                <Link href="/login">Already have an account? Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-4 bg-slate-900/50">
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
                Transform your meal planning with AI-powered personalization.
                Create perfect meal plans tailored to your lifestyle and dietary
                needs.
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <span>Made with</span>
                <span className="text-red-400">❤️</span>
                <span>for healthier eating</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white p-0 h-auto"
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
                    className="text-slate-400 hover:text-white p-0 h-auto"
                    onClick={() =>
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Pricing
                  </Button>
                </div>
                {user ? (
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white p-0 h-auto"
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
                        className="text-slate-400 hover:text-white p-0 h-auto"
                        asChild
                      >
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white p-0 h-auto"
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
                    className="text-slate-400 hover:text-white p-0 h-auto"
                    asChild
                  >
                    <Link href="/subscriptions">Subscriptions</Link>
                  </Button>
                </div>
                <div>
                  <span className="text-slate-400">Help Center</span>
                </div>
                <div>
                  <span className="text-slate-400">Contact Us</span>
                </div>
                <div>
                  <span className="text-slate-400">Privacy Policy</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} plAIte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
