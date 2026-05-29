import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Brain, Users, CheckCircle2, FileText, Sofa, PawPrint, CigaretteOff, ShoppingCart, Bus, Accessibility, Home, Flower2, Phone, Tv, Wifi, CarTaxiFront } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const FACILITIES = [
  { icon: Sofa,         label: "Own furniture if required" },
  { icon: PawPrint,     label: "Pet friendly (or by arrangement)" },
  { icon: CigaretteOff, label: "Smoking not permitted" },
  { icon: ShoppingCart, label: "Close to local shops" },
  { icon: Bus,          label: "Near public transport" },
  { icon: CarTaxiFront, label: "Minibus or other transport" },
  { icon: Accessibility,label: "Wheelchair access" },
  { icon: Home,         label: "Ground floor accommodation only" },
  { icon: Flower2,      label: "Gardens" },
  { icon: Phone,        label: "Phone point in own room" },
  { icon: Tv,           label: "Television point in own room" },
  { icon: Wifi,         label: "Residents internet access" },
];

export default function OurServices() {
  const services = [
    {
      id: "elderly-care",
      title: "Elderly Care",
      icon: Heart,
      description: "Our elderly care is rooted in preserving dignity and promoting independence. We provide 24/7 personal care, assistance with daily routines, and medication management in a comfortable, home-like environment.",
      benefits: ["Personalised care plans", "24-hour trained staff on duty", "Medication management", "Nutritious, home-cooked meals"]
    },
    {
      id: "dementia-care",
      title: "Dementia Care",
      icon: Brain,
      description: "We understand the unique challenges of memory loss. Our specialist approach focuses on creating familiar routines within a safe, secure, and easily navigable environment to reduce anxiety and enhance well-being.",
      benefits: ["Dementia-friendly environment", "Reminiscence therapy", "Consistent staff for familiar faces", "Secure outdoor garden access"]
    },
    {
      id: "disability-support",
      title: "Disability Support",
      icon: Users,
      description: "We offer tailored assistance for adults with physical disabilities, ensuring they have the support needed to live full, active, and meaningful lives within our community.",
      benefits: ["Accessible facilities throughout", "Mobility support", "Coordinated care with district nurses", "Focus on ability and independence"]
    }
  ];

  return (
    <>
      <SEO 
        title="Our Care Services" 
        description="Explore our Elderly Care, Dementia Care, and Disability Support services at Glens Residential Home. Regulated by RQIA." 
      />

      <div className="bg-muted/30 pt-16 pb-12 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6"
          >
            Care Tailored to You
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            With just 16 single rooms, we provide a level of intimate, personalised care that larger institutions simply cannot match. Every resident is treated as part of our extended family.
          </motion.p>
        </div>
      </div>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-[1fr_2fr] gap-8 items-start"
              >
                <div className="bg-secondary/10 rounded-3xl p-8 text-center flex flex-col items-center justify-center aspect-square md:aspect-auto h-full">
                  <div className="bg-white dark:bg-card p-4 rounded-full shadow-sm mb-4">
                    <service.icon size={40} className="text-secondary" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold">{service.title}</h2>
                </div>
                <div className="flex flex-col justify-center h-full">
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="text-primary mt-1 shrink-0" size={20} />
                        <span className="text-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-7 bg-primary rounded-full" />
              <h2 className="text-2xl font-serif font-bold text-foreground">Facilities</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
            {FACILITIES.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 text-foreground"
              >
                <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-border bg-muted">
                  <Icon size={20} className="text-primary" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-card py-20 border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <FileText size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-6">Our Commitment to Quality</h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            We operate under strict regulatory guidelines to ensure the highest standards of care. Glens Residential Home is fully registered with and inspected by the <strong>Regulation and Quality Improvement Authority (RQIA)</strong>. We consistently maintain a "Good" rating across all inspection areas.
          </p>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <a href="https://www.rqia.org.uk" target="_blank" rel="noopener noreferrer">
              Read our latest RQIA Report
            </a>
          </Button>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-6">Discuss Your Care Needs</h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Choosing the right care home is a significant decision. We're here to talk through your specific requirements without any obligation.
          </p>
          <Button asChild size="xl" variant="secondary" className="rounded-full px-8 text-secondary-foreground">
            <Link href="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
