import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "@/utils/api";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg("Please fill in all required fields.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await apiClient.post("/messages", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition";

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-heading">
            <span className="section-number text-sm">05.</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Let's Work Together
            </h2>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 max-w-5xl mx-auto">
          {/* Contact info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {[
              { icon: Mail, label: "Email", value: "abhishekdhakal1826@gmail.com", href: "mailto:abhishekdhakal1826@gmail.com" },
              { icon: Phone, label: "Phone", value: "+977 9824230483", href: "tel:+9779824230483" },
              { icon: MapPin, label: "Location", value: "Kathmandu, Nepal", href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-accent-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-success" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Message sent!</h3>
                <p className="text-muted-foreground mb-6">I&apos;ll get back to you within 24 hours.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Name <span className="text-destructive">*</span></label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email <span className="text-destructive">*</span></label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                  <input name="subject" value={form.subject} onChange={handleChange} placeholder="Project inquiry" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message <span className="text-destructive">*</span></label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project…"
                    rows={5}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
