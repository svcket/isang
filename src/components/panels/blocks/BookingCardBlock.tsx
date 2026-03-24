import { Calendar, ChevronDown } from "lucide-react";

interface BookingCardBlockProps {
    date?: string;
    travellers?: string;
    button_label: string;
}

export default function BookingCardBlock({ date = "18 May", travellers = "2 - adults", button_label }: BookingCardBlockProps) {
    return (
        <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white sticky top-24 transition-all duration-300">
            <div className="space-y-4">
                {/* Date Input */}
                <div className="space-y-1.5">
                    <label className="text-[15px] font-medium text-slate-500 ml-0.5">Date</label>
                    <div className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 hover:border-slate-300 transition-colors cursor-pointer group">
                        <span className="text-[15px] text-slate-900">{date}</span>
                        <Calendar className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-500 transition-colors" />
                    </div>
                </div>

                {/* Travellers Input */}
                <div className="space-y-1.5">
                    <label className="text-[15px] font-medium text-slate-500 ml-0.5">Travellers</label>
                    <div className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 hover:border-slate-300 transition-colors cursor-pointer group">
                        <span className="text-[15px] text-slate-900">{travellers}</span>
                        <ChevronDown className="w-[18px] h-[18px] text-slate-400 group-hover:text-slate-500 transition-colors" />
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    className="w-full bg-black text-white rounded-full py-3.5 px-6 font-semibold text-[16px] hover:bg-neutral-800 transition-all active:scale-[0.98] mt-2"
                >
                    {button_label}
                </button>
            </div>
        </div>
    );
}
