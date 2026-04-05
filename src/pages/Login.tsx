import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { t } = useLanguage();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const users = JSON.parse(window.localStorage.getItem("nn_users") || "[]");

      if (isRegister) {
        if (users.find((u: any) => u.email === email)) {
          toast.error(t.login.errorExists);
          return;
        }
        const newUser = { email, password, name, favorites: [] };
        window.localStorage.setItem("nn_users", JSON.stringify([...users, newUser]));
        login(email, name);
        toast.success(t.login.successRegister);
        setLocation("/");
      } else {
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          login(user.email, user.name);
          toast.success(`${t.login.successLogin} ${user.name}!`);
          setLocation("/");
        } else {
          toast.error(t.login.errorInvalid);
        }
      }
    } catch {
      toast.error(t.login.errorGeneral);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 bg-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl border border-border"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-primary mb-2">
            {isRegister ? t.login.titleRegister : t.login.titleLogin}
          </h1>
          <p className="text-muted-foreground">
            {isRegister ? t.login.subtitleRegister : t.login.subtitleLogin}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">{t.login.name}</Label>
              <Input
                id="name"
                placeholder="Mario Rossi"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t.login.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="mario@esempio.it"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t.login.password}</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full h-12 text-lg">
            {isRegister ? t.login.submitRegister : t.login.submitLogin}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">
            {isRegister ? t.login.alreadyHave : t.login.dontHave}
          </span>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary font-medium hover:underline"
          >
            {isRegister ? t.login.switchToLogin : t.login.switchToRegister}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
