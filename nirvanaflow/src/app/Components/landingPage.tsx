"use client"
import { motion } from "framer-motion"
import { Brain, Calendar, Mail, ArrowRight, CheckCircle2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Background light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-radial from-cyan-400/8 via-blue-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-gradient-radial from-purple-500/8 via-pink-500/4 to-transparent rounded-full blur-3xl" />
      </div>
      {/* Hero Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto relative">
        {/* Hero light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-light mb-8 leading-tight">
            Focus on what matters.
            <br />
            <span className="font-normal">Let AI handle the rest.</span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform overwhelming projects into organized workflows. AI breaks down your events, prioritizes tasks, and
            keeps you focused.
          </p>

          <Button
            onClick={onGetStarted}
            className="bg-white hover:bg-zinc-100 text-zinc-900 px-8 py-3 text-lg rounded-2xl transition-colors duration-200"
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section className="px-6 py-16 relative">
        {/* Section light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-blue-400/30 via-blue-400/10 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light mb-6">The Problem</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Most productivity tools create more complexity instead of clarity. You end up managing the system instead
              of your work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Task Overload",
                description: "Large projects feel impossible when you don't know where to start.",
              },
              {
                title: "Missed Deadlines",
                description: "Important tasks slip through without proper prioritization.",
              },
              {
                title: "Context Switching",
                description: "Jumping between email, calendar, and task apps wastes mental energy.",
              },
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl p-6 h-full relative overflow-hidden group hover:bg-zinc-900/70 transition-colors duration-300">
                  {/* Card light effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-0 text-center relative z-10">
                    <h3 className="text-lg font-medium mb-3 text-white">{problem.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{problem.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="px-6 py-20 relative">
        {/* Vertical light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-purple-400/40 via-purple-400/10 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light mb-6">Our Solution</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              One intelligent system that understands your work and organizes it automatically.
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: "AI Task Breakdown",
                description:
                  "Add an event like 'Launch Product' and watch AI create a prioritized list of actionable subtasks.",
                example: "Event: Product Launch → 12 organized tasks with deadlines",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Calendar Integration",
                description: "Your Google Calendar events automatically become tasks in your workflow.",
                example: "Meeting at 3PM → Added to 'Today' with prep tasks",
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: "Smart Email Filtering",
                description: "AI identifies your most important emails and surfaces them when you need to act.",
                example: "Client deadline email → High priority notification",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Intelligent Notifications",
                description: "Get contextual suggestions and deadline alerts that help you stay focused.",
                example: "Deadline in 2 hours → 'Focus on this task first' alert",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/30 border-zinc-800 rounded-2xl p-8 relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
                  {/* Animated light sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  {/* Corner light accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyan-400/10 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardContent className="p-0 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-zinc-300 bg-zinc-800 p-3 rounded-xl relative overflow-hidden group-hover:bg-zinc-700 transition-colors duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10">{feature.icon}</div>
                      </div>
                      <h3 className="text-2xl font-light text-white">{feature.title}</h3>
                    </div>
                    <p className="text-zinc-400 mb-6 leading-relaxed text-lg">{feature.description}</p>
                    <div className="text-sm text-zinc-500 bg-zinc-800/50 px-4 py-3 rounded-xl border border-zinc-700">
                      {feature.example}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 relative">
        {/* Section divider light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-cyan-400/30 via-cyan-400/10 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light mb-6">How It Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Add Your Event",
                description: "Simply input your project or deadline. Our AI analyzes what needs to be done.",
              },
              {
                step: "2",
                title: "AI Creates Tasks",
                description: "Watch as your event becomes a prioritized list of manageable subtasks.",
              },
              {
                step: "3",
                title: "Stay Focused",
                description: "Get smart notifications and track progress without the mental overhead.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 rounded-2xl p-8 h-full relative overflow-hidden group hover:bg-zinc-900/70 transition-all duration-300">
                  {/* Pulsing light effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-0 text-center relative z-10">
                    <div className="w-16 h-16 bg-white text-zinc-900 rounded-2xl flex items-center justify-center text-xl font-medium mx-auto mb-6 relative overflow-hidden group-hover:shadow-lg group-hover:shadow-white/10 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-100 opacity-90" />
                      <span className="relative z-10">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-medium mb-4 text-white">{step.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 relative">
        {/* Prominent CTA light beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-zinc-900/30 border-zinc-800 rounded-3xl p-12 relative overflow-hidden group hover:border-zinc-700 transition-all duration-500">
              {/* Multiple light layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl" />
              <CardContent className="p-0 text-center relative z-10">
                <h2 className="text-3xl font-light mb-8 text-white">Ready to focus on what matters?</h2>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10 text-sm text-zinc-400">
                  {["No setup required", "Works immediately", "Free to try"].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-zinc-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-white hover:bg-zinc-100 text-zinc-900 px-12 py-4 text-lg rounded-2xl transition-colors duration-200"
                >
                  Start Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center text-sm text-zinc-500">
          <p>Built for people who value clarity over complexity.</p>
        </div>
      </footer>
    </div>
  )
}
