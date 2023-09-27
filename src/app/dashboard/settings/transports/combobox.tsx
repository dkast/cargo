import { type ReactNode } from "react"
import { PopoverContent } from "@radix-ui/react-popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { Popover, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function ComboBox({ children }: { children: ReactNode }) {
  return <Popover>{children}</Popover>
}
function ComboBoxContent({ children }: { children: ReactNode }) {
  return (
    <PopoverContent
      className={cn(
        "z-50 w-72 rounded-md border border-gray-200 bg-white p-2 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
      )}
    >
      <Command>{children}</Command>
    </PopoverContent>
  )
}

const ComboBoxTrigger = PopoverTrigger
const ComboBoxInput = CommandInput
const ComboBoxList = CommandList
const ComboBoxEmpty = CommandEmpty
const ComboBoxItem = CommandItem
const ComboBoxGroup = CommandGroup

export {
  ComboBox,
  ComboBoxTrigger,
  ComboBoxContent,
  ComboBoxInput,
  ComboBoxList,
  ComboBoxEmpty,
  ComboBoxItem,
  ComboBoxGroup
}
