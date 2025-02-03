import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "../utils"  
import { Button } from "./button" 

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel doit être utilisé dans un CarouselProvider")
  }
  return context
}

function Carousel({ orientation = "horizontal", ...props }) {
  const [carouselRef, setCarouselRef] = React.useState(null)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [itemCount, setItemCount] = React.useState(0)

  const canScrollPrev = currentIndex > 0
  const canScrollNext = currentIndex < itemCount - 1

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const scrollNext = () => {
    if (currentIndex < itemCount - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const value = {
    carouselRef,
    setCarouselRef,
    orientation,
    currentIndex,
    setCurrentIndex,
    itemCount,
    setItemCount,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  }

  return (
    <CarouselContext.Provider value={value}>
      <div
        ref={setCarouselRef}
        className="relative"
        role="region"
        aria-roledescription="carousel"
        {...props}
      />
    </CarouselContext.Provider>
  )
}

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden",
        orientation === "horizontal" ? "-mx-4" : "-my-4",
        className
      )}
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  const { orientation, currentIndex, setItemCount } = useCarousel()

  React.useEffect(() => {
    setItemCount((count) => count + 1)
    return () => setItemCount((count) => count - 1)
  }, [setItemCount])

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      style={{
        display: props["data-index"] === currentIndex ? "block" : "none"
      }}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 top-1/2 -translate-y-1/2"
            : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
          "hover:bg-orange-100 hover:text-orange-600",
          className
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Précédent</span>
      </Button>
    )
  }
)
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(
  ({ className, variant = "outline", size = "icon", ...props }, ref) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel()

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 top-1/2 -translate-y-1/2"
            : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
          "hover:bg-orange-100 hover:text-orange-600",
          className
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Suivant</span>
      </Button>
    )
  }
)
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
