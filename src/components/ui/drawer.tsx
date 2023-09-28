"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "@/lib/utils"

const Drawer = DrawerPrimitive.Root

const DrawerTrigger = DrawerPrimitive.Trigger

const DrawerPortal = DrawerPrimitive.Portal

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-gray-950/80",
      className
    )}
    {...props}
    ref={ref}
  />
))

DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[96%] flex-col rounded-t-[10px] bg-white",
        className
      )}
      {...props}
      ref={ref}
    />
  </DrawerPortal>
))

DrawerContent.displayName = DrawerPrimitive.Content.displayName

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    className={cn(
      "text-xl font-semibold text-gray-950 dark:text-gray-50",
      className
    )}
    {...props}
    ref={ref}
  />
))

DrawerTitle.displayName = DrawerPrimitive.Title.displayName

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
    ref={ref}
  />
))

DrawerDescription.displayName = DrawerPrimitive.Description.displayName

export { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription }
