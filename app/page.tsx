import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-b from-background to-background/90">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">SoulSpeak</h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Your voice-based AI companion for mental well-being
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          <p className="text-muted-foreground">
            SoulSpeak uses the power of voice interaction to provide a therapeutic experience based on cognitive
            behavioral therapy principles. No typing, just talking.
          </p>

          <div className="flex justify-center">
            <Link href="/therapy">
              <Button size="lg" className="group">
                Start Talking
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <p className="text-sm text-muted-foreground">Powered by advanced AI for natural conversations</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Your privacy matters. Voice data is never stored without consent.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

