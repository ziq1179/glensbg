import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Phone, MapPin, ExternalLink, Star, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.83L.057 23.268a.75.75 0 00.906.918l5.687-1.49A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.964-1.362l-.355-.212-3.681.965.981-3.584-.232-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
    </svg>
  );
}

function toWhatsAppUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "44")}`;
}

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please provide a brief message"),
});

export default function Contact() {
  const { toast } = useToast();
  const { settings } = useSettings();
  const phoneDigits = settings.phone.replace(/\s+/g, "");
  const addressLines = settings.address.split("\n");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would send an email or save to a DB
    console.log(values);
    toast({
      title: "Message Sent",
      description: "Thank you for getting in touch. We will respond shortly.",
    });
    form.reset();
  }

  return (
    <>
      <SEO 
        title="Contact & FAQ" 
        description="Get in touch with Glens Residential Home to book a visit or ask questions. Located in Cushendall, Ballymena." 
      />

      <div className="bg-muted/30 pt-16 pb-12 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            We operate an open-door policy. Whether you want to arrange a formal visit or just have a quick chat about your options, we're here to help.
          </p>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Info & Map */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Address</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Glens Residential Home<br/>
                        {addressLines.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < addressLines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-secondary/10 p-3 rounded-full text-secondary shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Phone</h3>
                      <a href={`tel:${phoneDigits}`} className="text-muted-foreground hover:text-primary transition-colors text-lg">
                        {settings.phone}
                      </a>
                      <div className="mt-2">
                        <a
                          href={toWhatsAppUrl(settings.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:text-[#1ebe5d] transition-colors"
                        >
                          <WhatsAppIcon size={16} />
                          Message us on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe
                  title="Glens Residential Home on Google Maps"
                  src="https://maps.google.com/maps?q=55.0733172,-6.0599845&z=17&output=embed"
                  width="100%"
                  height="320"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://www.google.com/maps/place/63+Middlepark+Rd,+Cushendall,+Ballymena+BT44+0SQ,+UK/@55.0733172,-6.0599845,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink size={14} />
                View on Google Maps
              </a>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-lg border-0 bg-card">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-serif font-bold mb-6">Book a Visit or Enquire</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-background" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="07..." {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="john@example.com" {...field} className="bg-background" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message / Enquiry</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[120px] bg-background" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full rounded-full" size="lg">
                        Submit Enquiry
                      </Button>
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        All data is handled in accordance with GDPR regulations.
                      </p>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
            
          </div>
        </div>
      </section>

      {settings.review_url && (
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                  Share Your Experience
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Your feedback means the world to us and helps other families make informed decisions. If your loved one is a resident, we'd be grateful if you could take a moment to leave an honest review.
                </p>
                <a
                  href={settings.review_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  <Star size={16} fill="currentColor" />
                  Leave a Review
                  <ExternalLink size={14} />
                </a>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-md border border-border inline-block">
                  <QRCodeSVG
                    value={settings.review_url}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#1a1a1a"
                    level="M"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground text-center">
                  <QrCode size={14} />
                  Scan to leave a review on your phone
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-serif font-bold text-center mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-card rounded-2xl p-4 shadow-sm border border-border">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-medium text-lg">Can residents bring their own furniture?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes, absolutely. We actively encourage residents to personalise their single rooms with small items of furniture, photographs, and cherished belongings to make it truly feel like their own space.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-medium text-lg">What are the visiting hours?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                We operate an open-door policy. There are no strict visiting hours — family and friends are always welcome to drop in, just as they would if their loved one was living in their own house.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-medium text-lg">How is medical care handled?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                We coordinate closely with local GPs and district nurses who visit the home regularly. Our staff manage medication distribution and monitor residents' health, ensuring professional medical intervention is accessed immediately when needed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left font-medium text-lg">Is there community involvement?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Very much so. We host weekly visits from local nursery children and organise regular supported trips into Cushendall village. Remaining an active part of the local community is central to our ethos.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left font-medium text-lg">Is a GDPR Privacy Policy in place?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                Yes, all contact form data and resident information is securely handled in strict accordance with GDPR regulations to protect your family's privacy.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
