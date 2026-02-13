"use client";

import { useAppStore } from "@/lib/store";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plane, Sparkles, BookOpen, Lock } from "lucide-react";
import { useState } from "react";

export default function AuthModal() {
    const showAuthModal = useAppStore((s) => s.showAuthModal);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);
    const [mode, setMode] = useState<"signup" | "login">("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-isang-teal via-primary to-isang-mint p-8 text-white">
                    <div className="absolute top-4 right-4 opacity-30">
                        <Plane className="h-12 w-12" />
                    </div>
                    <DialogHeader>
                        <DialogTitle
                            className="text-2xl font-bold text-white"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {mode === "signup" ? "Join Isang" : "Welcome back"}
                        </DialogTitle>
                        <DialogDescription className="text-white/80 mt-1">
                            {mode === "signup"
                                ? "Create a free account and unlock everything"
                                : "Sign in to access your trips"}
                        </DialogDescription>
                    </DialogHeader>

                    {mode === "signup" && (
                        <div className="flex flex-col gap-2 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-white/80" />
                                <span>Unlimited conversations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-white/80" />
                                <span>Full itineraries & editing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-white/80" />
                                <span>Save & share your trips</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    {mode === "signup" && (
                        <Input
                            placeholder="Your name"
                            className="rounded-xl"
                        />
                    )}
                    <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl"
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-xl"
                    />

                    <Button className="w-full rounded-xl bg-gradient-to-r from-isang-teal to-primary hover:opacity-90 h-11 font-medium">
                        {mode === "signup" ? "Create account" : "Sign in"}
                    </Button>

                    <Separator />

                    <p className="text-center text-sm text-muted-foreground">
                        {mode === "signup"
                            ? "Already have an account? "
                            : "Don't have an account? "}
                        <button
                            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                            className="text-primary font-medium hover:underline"
                        >
                            {mode === "signup" ? "Sign in" : "Sign up"}
                        </button>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
