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

export default function AuthModal() {
    const showAuthModal = useAppStore((s) => s.showAuthModal);
    const setShowAuthModal = useAppStore((s) => s.setShowAuthModal);

    return (
        <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
            <DialogContent
                className="sm:max-w-[400px] p-8 border-none shadow-2xl rounded-[32px] bg-white gap-6"
                overlayClassName="backdrop-blur-md bg-white/40"
                showCloseButton={false}
            >
                <DialogHeader className="space-y-3 flex flex-col items-center text-center">
                    <DialogTitle className="text-[28px] font-bold text-black tracking-tight leading-tight">
                        Welcome to Isang
                    </DialogTitle>
                    <DialogDescription className="text-[15px] text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                        Create an account or sign in to continue planning your journey.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-2">
                    {/* Google Button */}
                    <Button
                        variant="outline"
                        className="w-full h-[52px] rounded-[40px] border border-neutral-100 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-[15px] shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </div>
                    </Button>

                    {/* Email Button */}
                    <Button
                        className="w-full h-[52px] rounded-[40px] bg-[#FF4405] hover:bg-[#E53D04] text-white font-semibold text-[15px] shadow-sm"
                    >
                        Continue with email
                    </Button>
                </div>

                <div className="text-center mt-2 px-2">
                    <p className="text-[13px] leading-relaxed text-[#166534] underline decoration-[#166534]/30 underline-offset-4 cursor-pointer hover:text-[#14532d] transition-colors text-center">
                        Access personalized itineraries, smart recommendations, and trip details built for you
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
