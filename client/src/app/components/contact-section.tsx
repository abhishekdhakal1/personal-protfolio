import { motion } from "framer-motion";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Send,
  MapPin,
  Phone,
  MessageCircle,
  Sparkles,
} from "react-icons/md";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { apiClient, endpoints } from "@/utils/api";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/abhishekdhakal1",
    color: "hover:text-purple-400",
    bgColor: "from-purple-500 to-pink-500",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/abhishekdhakal1",
    color: "hover:text-blue-400",
    bgColor: "from-blue-500 to-cyan-500",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:abhishekdhakal1826@gmail.com",
    color: "hover:text-green-400",
    bgColor: "from-green-500 to-emerald-500",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/abhishekdhakal1",
    color: "hover:text-sky-400",
    bgColor: "from-sky-500 to-blue-500",
  },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "abhishekdhakal1826@gmail.com",
    href: "mailto:abhishekdhakal1826@gmail.com",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Kathmandu, Nepal",
    href: "#",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+977 9824230483",
    href: "tel:+9779824230483",
    color: "from-green-500 to-emerald-500",
  },
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiClient.post(
        endpoints.messages.create,
        formData,
      );

      if (response.status === 201) {
        alert(
          response.data.message ||
            "Thank you for your message! I'll get back to you soon.",
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contact"
      className="py-20 px-6 bg-gradient-to-b from-muted/20 to-background"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mb-8"></div>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Let's collaborate on building the next generation of cyber-physical
            systems. Feel free to reach out for projects, opportunities, or just
            to chat about technology!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-cyan-400" />
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
                      <div className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} p-0.5 flex-shrink-0`}
                        >
                          <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                            <Icon className="h-6 w-6 text-cyan-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">
                            {info.label}
                          </div>
                          <a
                            href={info.href}
                            className="text-foreground hover:text-cyan-400 transition-colors font-medium"
                          >
                            {info.value}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-bold text-foreground mb-4">
                Connect with me
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-cyan-500/50 transition-all duration-300">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${social.bgColor} p-0.5`}
                        >
                          <div className="w-full h-full bg-background rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-cyan-400" />
                          </div>
                        </div>
                        <span className="font-medium text-foreground group-hover:text-cyan-400 transition-colors">
                          {social.name}
                        </span>
                      </div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-xl"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border border-border rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-cyan-400" />
                Send Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="bg-background border-border text-foreground focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="bg-background border-border text-foreground focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Subject (Optional)
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      handleInputChange("subject", e.target.value)
                    }
                    className="bg-background border-border text-foreground focus:border-cyan-500 focus:ring-cyan-500/20"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    required
                    rows={6}
                    className="bg-background border-border text-foreground focus:border-cyan-500 focus:ring-cyan-500/20 resize-none"
                    placeholder="Tell me about your project or just say hi!"
                  />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">
              I'm always excited to work on new projects and ideas!
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
