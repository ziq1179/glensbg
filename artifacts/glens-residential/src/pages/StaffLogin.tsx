import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export default function StaffLogin() {
  const [, setLocation] = useLocation();
  const { login } = useStaffAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await login(values.username, values.password);
      setLocation("/staff/dashboard");
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : "Login failed");
    }
  };

  return (
    <>
      <SEO title="Staff Login" description="Secure staff login for Glens Residential Home." />

      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-muted/30 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full text-primary mb-4">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Staff Portal</h1>
            <p className="text-muted-foreground mt-2">Sign in to manage site photos and content.</p>
          </div>

          <Card className="border border-border shadow-lg">
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="staff-login-form">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="username"
                            placeholder="admin"
                            {...field}
                            className="bg-background"
                            data-testid="input-username"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              placeholder="••••••••"
                              {...field}
                              className="bg-background pr-11"
                              data-testid="input-password"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              data-testid="button-toggle-password"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {serverError && (
                    <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-4 py-3 rounded-lg">
                      <Lock size={14} className="shrink-0" />
                      {serverError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full"
                    disabled={form.formState.isSubmitting}
                    data-testid="button-login"
                  >
                    {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Staff access only. If you need access, contact the manager.
          </p>
        </motion.div>
      </div>
    </>
  );
}
