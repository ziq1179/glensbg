import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useSectionPhoto } from "@/hooks/useSectionPhoto";

export default function Home() {
  const heroSrc = useSectionPhoto("home-hero", "/images/hero.png");
  const diningSrc = useSectionPhoto("life-dining", "/images/dining.png");

  return (
    <>
      <SEO 
        title="A Place to Call Home" 
        description="Glens Residential Home is a family-run residential care home nestled in the scenic Glens of Antrim. We provide Elderly Care, Dementia Care, and Disability Support." 
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-12 pb-20 lg:pt-24 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium text-sm mb-6">
                <ShieldCheck size={16} />
                <span>RQIA "Good" Rating</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif font-bold text-foreground leading-tight mb-6">
                A Place to Call Home in the <span className="text-primary">Heart of the Glens.</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
                Nestled in the scenic beauty of Middlepark Road, our 16-bed, purpose-built home offers a safe and tranquil environment. We pride ourselves on being a community where life is defined by dignity and a true sense of belonging.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="xl" className="rounded-full text-lg px-8 py-6 shadow-md">
                  <Link href="/contact">Book a Visit</Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="rounded-full text-lg px-8 py-6">
                  <Link href="/our-services">Explore Services</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative border-8 border-white dark:border-card">
                <img 
                  src={heroSrc} 
                  alt="Glens Residential Home exterior and garden" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Trust Badge Floating */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[280px] border border-border">
                <div className="bg-primary/10 p-3 rounded-full text-primary">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">Regulated by RQIA</p>
                  <a href="https://www.rqia.org.uk" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary underline">Verify our status</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-4">Our Care Services</h2>
            <p className="text-muted-foreground text-lg">
              We provide tailored support designed to maintain independence and improve quality of life for every resident.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Elderly Care",
                description: "Personalised, dignified support for older adults in a homely, comfortable setting.",
                icon: Heart,
              },
              {
                title: "Dementia Care",
                description: "A specialist approach focusing on familiar routines and safe environments.",
                icon: Brain,
              },
              {
                title: "Disability Support",
                description: "Tailored assistance allowing residents to live full and active lives.",
                icon: Users,
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-none shadow-sm hover:-translate-y-1">
                  <CardContent className="p-8 flex flex-col items-start text-left">
                    <div className="bg-secondary/10 text-secondary p-4 rounded-2xl mb-6">
                      <service.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold font-serif mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 flex-1">{service.description}</p>
                    <Link href="/our-services" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all mt-auto">
                      Learn more <ArrowRight size={18} />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="bg-card max-w-5xl mx-auto rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-10 lg:p-16 flex flex-col justify-center">
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-4">Experience the difference</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  The best way to understand the warmth of our home is to see it for yourself. We'd love to show you around and answer any questions you might have.
                </p>
                <Button asChild size="xl" className="rounded-full w-fit px-8">
                  <Link href="/contact">Book a Visit</Link>
                </Button>
              </div>
              <div className="bg-muted min-h-[300px] relative">
                <img 
                  src={diningSrc} 
                  alt="Warm care home environment" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
