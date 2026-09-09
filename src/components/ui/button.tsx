import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/35 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-accent/90",
        ink: "bg-ink text-paper hover:bg-ink-2",
        secondary: "bg-paper-3 text-ink hover:bg-rule",
        outline:
          "bg-transparent text-ink shadow-[var(--shadow-border)] hover:bg-paper-2",
        ghost: "bg-transparent text-ink hover:bg-paper-3",
        danger: "bg-danger text-paper hover:bg-danger/90",
        paper: "bg-paper-2 text-ink shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-[8px] [&_svg]:size-3.5",
        md: "h-10 px-4 text-sm rounded-[10px] [&_svg]:size-4",
        lg: "h-12 px-5 text-base rounded-[12px] [&_svg]:size-4",
        icon: "size-10 rounded-[10px] [&_svg]:size-4",
        "icon-sm": "size-8 rounded-[8px] [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  staticScale?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, staticScale, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          !staticScale && "active:not-disabled:scale-[0.96]",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
