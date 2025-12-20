import { motion } from "motion/react";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Send,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com/abhishekdhakal1",
    color: "hover:text-purple-400",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/in/abhishekdhakal1",
    color: "hover:text-blue-400",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:abhishekdhakal1826@gmail.com",
    color: "hover:text-green-400",
  },
];

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! I'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="min-h-screen py-20 px-6 bg-slate-950 relative"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950"></div>

      <div className="max-w-6xl mx-auto relative z-10">
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
          <p className="text-slate-300 max-w-3xl mx-auto text-lg">
            Let's collaborate on building the next generation of cyber-physical
            systems. Feel free to reach out for projects, opportunities, or just
            to chat about technology!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Contact Information
            </h3>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Email</div>
                  <a
                    href="mailto:abhishek@example.com"
                    className="text-white hover:text-cyan-400 transition-colors"
                  >
                    abhishekdhakal1826@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-400" />
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Location</div>
                  <div className="text-white">Nepal</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 p-0.5">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-green-400" />
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Phone</div>
                  <div className="text-white">+977 9824230483</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Connect with me
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-400 ${social.color} transition-all hover:border-current`}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-slate-900/50 border-slate-800 text-white focus:border-cyan-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="bg-slate-900/50 border-slate-800 text-white focus:border-cyan-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={6}
                  className="bg-slate-900/50 border-slate-800 text-white focus:border-cyan-500 resize-none"
                  placeholder="Tell me about your project or just say hi!"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
