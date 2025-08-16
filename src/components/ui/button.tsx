import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 apple-button active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover apple-shadow hover:apple-shadow-lg",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 apple-shadow hover:apple-shadow-lg",
        outline:
          "border border-input bg-background/80 backdrop-blur-sm hover:bg-secondary hover:text-secondary-foreground apple-shadow hover:apple-shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 apple-shadow hover:apple-shadow-lg",
        ghost: "hover:bg-secondary hover:text-secondary-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-accent text-accent-foreground hover:bg-accent/90 apple-shadow hover:apple-shadow-lg",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 apple-shadow hover:apple-shadow-lg",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
