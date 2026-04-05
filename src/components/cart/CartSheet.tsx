import { useState } from "react";
import { useCartContext } from "@/contexts/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Minus, MessageCircle, ShoppingBag, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { cart, note, setNote, updateQuantity, removeFromCart, clearCart, cartTotal } = useCartContext();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [showWaiterModal, setShowWaiterModal] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartDescription =
    cart.length === 0
      ? t.cart.empty
      : cart.length === 1
      ? t.cart.count_one
      : t.cart.count_other(cart.length);

  const handleShowWaiter = () => {
    if (cart.length === 0) return;
    setShowWaiterModal(true);
  };

  const handleConfirmWaiter = () => {
    setShowWaiterModal(false);
    clearCart();
    onOpenChange(false);
    toast({
      title: t.cart.toastTitle,
      description: t.cart.toastDesc,
    });
  };

  const buildOrderText = () => {
    // Merr përkthimet shqip për produktet
    const sqProducts = require("@/lib/translations").translations.sq.products;
    let text = `Porosia Jote - Napoletana Nostra\n\n`;
    cart.forEach(item => {
      const prod = sqProducts[item.key] || {};
      const title = prod.name || item.name;
      const desc = prod.description ? ` (${prod.description})` : "";
      text += `${item.quantity}x ${title}${desc} - €${(item.price * item.quantity).toFixed(2)}\n`;
    });
    if (note) {
      text += `\nShënime speciale:\n${note}\n`;
    }
    text += `\nTotali: €${cartTotal.toFixed(2)}`;
    text += `\n\nJu lutem, dorëzojani këtë porosi kamarierit. Faleminderit!`;
    return encodeURIComponent(text);
  };

  const handleWhatsApp = () => {
    if (cart.length === 0) return;
    window.open(`https://wa.me/38349976100?text=${buildOrderText()}`, "_blank");
    clearCart();
    onOpenChange(false);
  };

  const handleSMS = () => {
    if (cart.length === 0) return;
    window.open(`sms:+38349976100?body=${buildOrderText()}`, "_self");
    clearCart();
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-6 pb-2 border-b">
            <SheetTitle className="font-serif text-2xl text-primary">{t.cart.title}</SheetTitle>
            <SheetDescription>{cartDescription}</SheetDescription>
          </SheetHeader>

          {cart.length > 0 ? (
            <>
              <ScrollArea className="flex-1 px-6">
                <div className="flex flex-col gap-6 py-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img src={`${import.meta.env.BASE_URL}${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-primary font-medium text-sm mt-1">€{item.price.toFixed(2)}</p>
                        <div className="flex items-center justify-between mt-auto pt-2">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="p-1 hover:bg-muted transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              className="p-1 hover:bg-muted transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-bold text-sm">€{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 space-y-2">
                    <label htmlFor="notes" className="text-sm font-medium">
                      {t.cart.notesLabel}
                    </label>
                    <Textarea
                      id="notes"
                      placeholder={t.cart.notesPlaceholder}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              </ScrollArea>

              <div className="p-6 bg-muted/30 border-t space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>{t.cart.total}</span>
                  <span className="text-primary text-2xl font-serif">€{cartTotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    onClick={handleShowWaiter}
                    className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    {t.cart.orderWaiter}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={handleWhatsApp}
                      className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={handleSMS}
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4" />
                      SMS
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground max-w-[200px]">{t.cart.empty}</p>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                {t.cart.continueShop}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Waiter Order Modal */}
      <Dialog open={showWaiterModal} onOpenChange={setShowWaiterModal}>
        <DialogContent className="max-w-sm rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-primary/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="font-serif text-xl text-primary">
                {t.cart.waiterModalTitle}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              {t.cart.waiterModalDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 py-4 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm gap-2">
                <span className="font-medium text-foreground">
                  <span className="text-primary font-bold mr-1">{item.quantity}x</span>
                  {item.name}
                </span>
                <span className="text-muted-foreground whitespace-nowrap font-medium">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            {note && (
              <div className="mt-3 pt-3 border-t text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  {t.cart.specialNotes}
                </p>
                <p className="text-foreground italic">{note}</p>
              </div>
            )}

            <div className="pt-3 border-t flex justify-between items-center">
              <span className="font-bold text-sm">{t.cart.total}</span>
              <span className="font-serif text-xl font-bold text-primary">
                €{cartTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
            <Button
              onClick={handleConfirmWaiter}
              className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <CheckCircle2 className="w-4 h-4" />
              {t.cart.confirmOrder}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowWaiterModal(false)}
              className="w-full text-muted-foreground text-sm"
            >
              {t.cart.backToCart}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
