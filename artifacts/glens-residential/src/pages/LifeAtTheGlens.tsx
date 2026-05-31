import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Coffee, Utensils, Sun, TreePine } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useSectionPhoto } from "@/hooks/useSectionPhoto";

export default function LifeAtTheGlens() {
  const diningSrc = useSectionPhoto("life-dining", "/images/dining.png");
  const activitiesSrc = useSectionPhoto("life-activities", "/images/hero.png");

  return (
    <>
      <SEO 
        title="Life at the Glens" 
        description="Experience the daily routine, traditional dining, and community spirit at Glens Residential Home in Cushendall." 
      />

      <section className="relative bg-foreground text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={diningSrc} alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-foreground to-foreground/80" />
        
        <div className="container mx-auto px-4 py-24 relative z-10 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-serif font-bold mb-6"
          >
            A Vibrant, Meaningful Life
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-primary-foreground/80"
          >
            At Glens Residential Home, we believe that moving into care should be the start of a new, supported chapter of life — not a step back from it.
          </motion.p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* Dining */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-6">
                <Utensils size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Taste of Home</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Food is at the heart of our home. Our dedicated Head Cook prepares fresh, nutritious meals daily, focusing on traditional Northern Irish favourites that our residents know and love.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From hearty stews to freshly baked scones for afternoon tea, dining is a social occasion. We cater to all dietary requirements and involve residents in menu planning.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-lg aspect-square"
            >
              <img src={diningSrc} alt="Dining together" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Activities */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-lg aspect-[4/3] bg-muted relative"
            >
              <img src={activitiesSrc} alt="Our gardens and activities" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-6">
                <Sun size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Daily Routines & Activities</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                While we have a structured programme of activities, we operate on a relaxed, flexible routine that respects each resident's wishes. If someone prefers a quiet morning in their room with the paper, that's perfectly fine.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Activities range from arts and crafts, gentle armchair exercises, music therapy, and movie afternoons.
              </p>
            </motion.div>
          </div>

          {/* Community */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-6">
                <TreePine size={24} />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Rooted in the Community</h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                We are proud to be part of Cushendall. We maintain strong links with the local community, ensuring our residents remain connected to village life.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Highlights include weekly visits from local nursery children, bringing immense joy across generations, and regular supported trips to the village shops or coastal paths when weather permits.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-lg aspect-square bg-muted flex items-center justify-center p-8 text-center"
            >
               <h3 className="text-2xl font-serif italic text-muted-foreground">"It feels like a proper home, not an institution."</h3>
            </motion.div>
          </div>

        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl font-serif font-bold mb-6">Come and See for Yourself</h2>
          <p className="text-lg text-muted-foreground mb-8">
            The atmosphere of our home is best experienced in person. Join us for a cup of tea and a chat.
          </p>
          <Button asChild size="lg" className="rounded-full">
            <Link href="/contact">Book a Visit</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
