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
  Menu,
  X,
  CircleArrowDown,
} from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { Footer } from "./footer";

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
        "Advanced AI creates personalised meal plans tailored to your dietary needs and preferences",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Planning",
      description:
        "Generate meal plans from 1-14 days with customisable meals per day",
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
        "Automatically generated, categorised shopping lists for every meal plan",
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
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                <ChefHat className="w-6 h-6 text-blue-400" />
                <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                plAIte
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/account">Account</Link>
                  </Button>
                  <Button
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                  >
                    Go to App
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-3">
                    <Button
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl transition-all duration-300"
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
                      className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl transition-all duration-300"
                      onClick={() =>
                        document
                          .getElementById("pricing")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    >
                      Pricing
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/5 rounded-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
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
                className="text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-6 shadow-2xl shadow-black/20">
            <div className="space-y-3">
              {!user && (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
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
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
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
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg transition-all duration-300 text-white"
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
                    className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300"
                    asChild
                  >
                    <Link href="/account">Account</Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg transition-all duration-300 text-white"
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
              Stop wasting time deciding what to eat. Generate personalised meal
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
                {user ? "Create Your Plan" : "See how it works"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {!user && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-800 hover:bg-slate-800 hover:text-slate-50 px-8 py-4 text-lg rounded-xl"
                  onClick={() => {
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <CircleArrowDown className="w-5 h-5 mr-2 " />
                  Find out more about our features
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
            <Card className="relative transition-all duration-300 backdrop-blur-xl flex flex-col bg-slate-900/60 border-slate-200/20 hover:border-slate-200/40 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Star className="w-6 h-6 text-blue-400" />
                </div>

                <CardTitle className="text-2xl font-bold text-slate-50 mb-2">
                  Free
                </CardTitle>

                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-slate-50">£0</span>
                </div>

                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  Perfect for trying out plAIte
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex-grow flex flex-col">
                {/* Features List */}
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Up to 5-day meal plans
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      GPT powered AI model
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Shopping list generation
                    </span>
                  </div>
                </div>

                {/* CTA Button and guarantee - keep at bottom */}
                <div className="space-y-3 mt-auto">
                  <Button
                    onClick={onGetStarted}
                    className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 hover:shadow-lg"
                  >
                    Get Started Free
                  </Button>

                  <p className="text-center text-slate-400 text-xs">
                    No credit card required
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative group transition-all duration-300 flex flex-col hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-slate-900/60 border-purple-400/40 ring-2 ring-purple-400/20 backdrop-blur-xl">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                  Most Popular
                </Badge>
              </div>

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>

                <CardTitle className="text-2xl font-bold text-slate-50 mb-2">
                  Pro
                </CardTitle>

                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-slate-50">£5</span>
                  <span className="text-slate-400 ml-1 text-lg">/month</span>
                </div>

                <div className="text-sm text-slate-400 mb-4">
                  or £50/year (save 17%)
                </div>

                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  Unlock the full potential of plAIte
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex-grow flex flex-col">
                {/* Features List */}
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Up to 14-day meal plans
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Advanced AI models (GPT-4.1)
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Higher daily meal plan limits
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Advanced plan customisation options
                    </span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm leading-relaxed">
                      Detailed nutrition tracking
                    </span>
                  </div>
                </div>

                {/* CTA Button and guarantee - keep at bottom */}
                <div className="space-y-3 mt-auto">
                  <Button
                    className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <Link href="/subscriptions">Upgrade to Pro</Link>
                  </Button>

                  <p className="text-center text-slate-400 text-xs">
                    30-day money-back guarantee
                  </p>
                </div>
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
            Join thousands of users who have already revolutionised their meal
            planning with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {user ? "Create Your First Plan" : "See how it works"}
            </Button>
            {!user && (
              <Button
                variant="outline"
                size="lg"
                className="border-slate-600 text-slate-800 hover:bg-slate-800 hover:text-slate-50 px-8 py-4 text-lg rounded-xl"
                asChild
              >
                <Link href="/login">Already have an account? Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
      {/* Update Footer to pass user prop */}
      <Footer user={user} />
    </div>
  );
}
