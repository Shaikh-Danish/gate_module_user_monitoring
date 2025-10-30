"use client"

import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface HintProps {
    children: React.ReactNode
    text: string
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
}

function Hint({ children, text, side = "top", align = "center" }: HintProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold capitalize">{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export { Hint }