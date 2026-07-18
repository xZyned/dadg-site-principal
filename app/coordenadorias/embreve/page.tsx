import Typewriter from "@/app/components/TypeWriter"
import WaveAnimation from "@/app/components/WaveComponent"

export default function Page() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#09427d] mb-4 tracking-wide">
                <Typewriter text="EM BREVE" speed={100} />
            </h1>
            <WaveAnimation />
        </div>
    )
}