import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Users, Award, Shield } from "lucide-react";
import { useSectionPhoto } from "@/hooks/useSectionPhoto";

export default function MeetTheTeam() {
  const teamSrc = useSectionPhoto("team", "/images/team.png");

  return (
    <>
      <SEO 
        title="Meet the Team" 
        description="Learn about the dedicated, long-standing team at Glens Residential Home led by Registered Manager Siobhan McHugh." 
      />

      <section className="pt-16 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl lg:text-5xl font-serif font-bold mb-6">Our Family Caring for Yours</h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                As a family-run home (Glens Properties LLP / The McKillop Family), our ethos is built on personal connection. We don't employ agency staff; instead, we rely on our dedicated, long-standing team of familiar faces.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                High staff retention means residents aren't constantly adjusting to new carers. Our staff know the residents, their preferences, their stories, and exactly how they like their tea.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl overflow-hidden shadow-xl"
            >
              <img src={teamSrc} alt="Our caring team" className="w-full h-auto object-cover aspect-[4/3]" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-background rounded-3xl p-8 lg:p-12 shadow-sm border border-border flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary text-4xl font-serif">
              SM
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold mb-2">Siobhan McHugh</h2>
              <p className="text-primary font-medium mb-4">Registered Manager</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Siobhan brings decades of experience in social care to The Glens. As a hands-on manager, she isn't just confined to an office — she is on the floor daily, interacting with residents and supporting the care team.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                "My philosophy is simple: we provide the standard of care we would demand for our own parents. Every decision we make revolves around what is best for our residents' happiness and dignity."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">The Pillars of Our Care</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Care Assistants</h3>
              <p className="text-muted-foreground">Highly trained, compassionate individuals who provide 24/7 support, always with a smile and a listening ear.</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Utensils size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">The Kitchen Team</h3>
              <p className="text-muted-foreground">Led by our Head Cook, delivering traditional, home-cooked Northern Irish meals that bring comfort and joy.</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Domestic & Maintenance</h3>
              <p className="text-muted-foreground">Ensuring our purpose-built 16-bed home remains spotless, safe, and beautifully maintained year-round.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-serif font-bold mb-6">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Speak with Siobhan and the team to see if Glens Residential Home is the right fit for your loved one.
          </p>
          <Button asChild size="xl" className="rounded-full">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

// Just adding a quick Utensils import missing above
import { Utensils } from "lucide-react";