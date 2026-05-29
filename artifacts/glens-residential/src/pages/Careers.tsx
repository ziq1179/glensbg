import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState, useRef, useCallback } from "react";
import {
  Users,
  Heart,
  Home,
  Wrench,
  Briefcase,
  Upload,
  FileText,
  CheckCircle,
  X,
  Star,
  Clock,
  Shield,
} from "lucide-react";

const ROLES = [
  {
    id: "junior-care-assistant",
    label: "Junior Care Assistant",
    icon: Heart,
    type: "Care",
    description: "Support residents with daily living activities in a warm, person-centred environment. Full training provided — ideal for those new to care.",
    requirements: ["Compassionate and patient", "Willingness to learn", "Good communication skills"],
    hours: "Full-time & Part-time",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "senior-care-assistant",
    label: "Senior Care Assistant",
    icon: Star,
    type: "Care",
    description: "Lead by example, mentor junior staff, and deliver high-quality personal care. Ideal for experienced care workers ready to take the next step.",
    requirements: ["NVQ Level 2/3 in Health & Social Care (or equivalent)", "Minimum 2 years care experience", "Strong leadership skills"],
    hours: "Full-time",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "domestic-staff",
    label: "Domestic Staff",
    icon: Home,
    type: "Support",
    description: "Help maintain a clean, safe, and welcoming home for our residents. A vital role in the comfort and dignity of everyone who lives here.",
    requirements: ["Attention to detail", "Physical stamina", "Friendly and discreet approach"],
    hours: "Part-time & Flexible",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "maintenance",
    label: "Maintenance (Handyman)",
    icon: Wrench,
    type: "Support",
    description: "Keep our purpose-built facility safe, functional, and well-maintained. A hands-on role with a real impact on residents' quality of life.",
    requirements: ["General maintenance skills", "Knowledge of health & safety regulations", "Reliable and proactive"],
    hours: "Part-time",
    color: "bg-secondary/10 text-secondary",
  },
  {
    id: "management",
    label: "Management",
    icon: Briefcase,
    type: "Management",
    description: "Drive quality, support the team, and help shape life at the Glens. We welcome applications from experienced care managers looking for a meaningful role.",
    requirements: ["NISCC registration or equivalent", "Proven care management experience", "Strong regulatory knowledge (RQIA)"],
    hours: "Full-time",
    color: "bg-primary/10 text-primary",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const formSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("A valid email address is required"),
  phone: z.string().min(8, "A valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  role: z.string().min(1, "Please select a role"),
  coverLetter: z.string().min(20, "Please tell us a little about yourself (min 20 characters)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Careers() {
  const { toast } = useToast();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      role: "",
      coverLetter: "",
    },
  });

  const validateAndSetFile = (file: File) => {
    setCvError(null);
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setCvError("Please upload a PDF or Word document (.pdf, .doc, .docx).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setCvError("File size must be under 5MB.");
      return;
    }
    setCvFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  function onSubmit(values: FormValues) {
    if (!cvFile) {
      setCvError("Please upload your CV before submitting.");
      return;
    }
    console.log({ ...values, cv: cvFile.name });
    toast({
      title: "Application Received",
      description: `Thank you, ${values.fullName}. We will be in touch shortly regarding your application.`,
    });
    form.reset();
    setCvFile(null);
    setCvError(null);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <SEO
        title="Career Portal — Join Our Team"
        description="Join the team at Glens Residential Home in Cushendall, Ballymena. We are hiring Junior and Senior Care Assistants, Domestic Staff, Maintenance and Management roles."
      />

      {/* Hero */}
      <div className="bg-muted/30 pt-16 pb-12 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Users size={16} />
            We Are Hiring
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            Build a Career with Heart
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            At Glens Residential Home, our people are everything. We are a family-run home with a strong culture of care, respect, and belonging — for our residents and our staff alike.
          </p>
        </div>
      </div>

      {/* Why Work Here */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Why Join Us?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We invest in our team because familiar faces matter — to our residents and to us.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Heart,
                title: "Family-Run Culture",
                desc: "We are a close-knit team. You will be valued, heard, and supported — not a number on a rota.",
              },
              {
                icon: Shield,
                title: "Staff Retention & Stability",
                desc: "We pride ourselves on high staff retention. When you join the Glens, you join for the long term.",
              },
              {
                icon: Clock,
                title: "Flexible Hours",
                desc: "We offer a mix of full-time, part-time, and flexible shifts to suit your life as well as your career.",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={itemVariants}>
                <Card className="h-full border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8 flex flex-col gap-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                      <item.icon size={24} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Current Vacancies */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Current Vacancies</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select a role below to apply. Don't see the right fit? Send us an open application — we are always keen to hear from great people.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ROLES.map((role) => (
              <motion.div key={role.id} variants={itemVariants} data-testid={`role-card-${role.id}`}>
                <Card className="h-full border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <CardContent className="p-7 flex flex-col gap-4 h-full">
                    <div className="flex items-start justify-between gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${role.color}`}>
                        <role.icon size={24} />
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0 mt-1">
                        {role.hours}
                      </Badge>
                    </div>
                    <div>
                      <Badge className={`mb-2 text-xs ${role.color} border-0`}>{role.type}</Badge>
                      <h3 className="font-serif font-bold text-xl text-foreground">{role.label}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{role.description}</p>
                    <ul className="space-y-1.5 mt-auto pt-2 border-t border-border">
                      {role.requirements.map((req) => (
                        <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Apply Now</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Fill in your details, tell us about yourself, and upload your CV. We review every application personally.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-lg border border-border">
              <CardContent className="p-8 lg:p-10">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                    data-testid="careers-form"
                  >
                    {/* Personal Details */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">
                        Personal Details
                      </h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Mary O'Neill"
                                  {...field}
                                  className="bg-background"
                                  data-testid="input-full-name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...field}
                                    className="bg-background"
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="07..."
                                    {...field}
                                    className="bg-background"
                                    data-testid="input-phone"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Home Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Street, Town, Postcode"
                                  {...field}
                                  className="bg-background"
                                  data-testid="input-address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">
                        Role of Interest
                      </h3>
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position Applying For</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background" data-testid="select-role">
                                  <SelectValue placeholder="Select a role..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {ROLES.map((role) => (
                                  <SelectItem key={role.id} value={role.id} data-testid={`option-role-${role.id}`}>
                                    {role.label}
                                  </SelectItem>
                                ))}
                                <SelectItem value="open-application">Open Application</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">
                        About You
                      </h3>
                      <FormField
                        control={form.control}
                        name="coverLetter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Letter / Supporting Statement</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us why you would like to work at Glens Residential Home and what makes you a great fit for this role..."
                                className="min-h-[140px] bg-background resize-none"
                                {...field}
                                data-testid="textarea-cover-letter"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* CV Upload */}
                    <div>
                      <h3 className="font-serif font-bold text-lg text-foreground mb-4 pb-2 border-b border-border">
                        Upload Your CV
                      </h3>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={onFileInputChange}
                        data-testid="input-cv-file"
                      />

                      {cvFile ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-4 p-5 rounded-xl border border-primary bg-primary/5"
                          data-testid="cv-file-preview"
                        >
                          <div className="bg-primary/15 p-3 rounded-full text-primary shrink-0">
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{cvFile.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(cvFile.size / 1024).toFixed(0)} KB — ready to submit
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setCvFile(null); setCvError(null); }}
                            className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            data-testid="button-remove-cv"
                            aria-label="Remove CV"
                          >
                            <X size={20} />
                          </button>
                        </motion.div>
                      ) : (
                        <div
                          onDrop={onDrop}
                          onDragOver={onDragOver}
                          onDragLeave={onDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                          data-testid="cv-drop-zone"
                          className={`
                            relative flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed cursor-pointer
                            transition-all duration-200 select-none
                            ${isDragging
                              ? "border-primary bg-primary/10 scale-[1.01]"
                              : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"
                            }
                          `}
                        >
                          <div className={`p-4 rounded-full transition-colors ${isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                            <Upload size={28} />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-foreground text-base">
                              {isDragging ? "Drop your CV here" : "Drag & drop your CV here"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              or <span className="text-primary font-medium underline underline-offset-2">click to browse</span>
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX — max 5MB</p>
                        </div>
                      )}
                      {cvError && (
                        <p className="text-destructive text-sm mt-2 flex items-center gap-1.5">
                          <X size={14} /> {cvError}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full rounded-full"
                      data-testid="button-submit-application"
                    >
                      Submit Application
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Your details are handled in strict accordance with GDPR. We will only use your information to consider your application.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </>
  );
}
