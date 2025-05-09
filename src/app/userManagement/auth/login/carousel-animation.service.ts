import { Injectable,  Renderer2,  RendererFactory2 } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CarouselAnimationService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  animateSlideTransition(
    currentElement: HTMLElement,
    nextElement: HTMLElement,
    direction: "next" | "prev",
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      // Set initial states
      this.renderer.setStyle(nextElement, "opacity", "0");
      this.renderer.setStyle(nextElement, "visibility", "visible");
      this.renderer.setStyle(
        nextElement,
        "transform",
        direction === "next" ? "translateX(50px)" : "translateX(-50px)"
      );

      // Animate current slide out
      this.renderer.setStyle(currentElement, "opacity", "0");
      this.renderer.setStyle(
        currentElement,
        "transform",
        direction === "next" ? "translateX(-50px)" : "translateX(50px)",
      );

      setTimeout(() => {
        this.renderer.setStyle(currentElement, "visibility", "hidden");
      }, 300);

      // Animate next slide in
      setTimeout(() => {
        this.renderer.setStyle(nextElement, "opacity", "1");
        this.renderer.setStyle(nextElement, "transform", "translateX(0)");

        // Resolve after animation completes
        setTimeout(() => {
          resolve();
        }, 500);
      }, 50);
    });
  }

  animateContentIn(element: HTMLElement): void {
    const title = element.querySelector(".slide-title") as HTMLElement;
    const description = element.querySelector(".slide-description") as HTMLElement;
    const features = element.querySelectorAll(".feature-item") as NodeListOf<HTMLElement>;

    if (title) {
      this.renderer.setStyle(title, "opacity", "0");
      this.renderer.setStyle(title, "transform", "translateX(-30px)");

      setTimeout(() => {
        this.renderer.setStyle(title, "opacity", "1");
        this.renderer.setStyle(title, "transform", "translateX(0)");
      }, 300);
    }

    if (description) {
      this.renderer.setStyle(description, "opacity", "0");
      this.renderer.setStyle(description, "transform", "translateX(-30px)");

      setTimeout(() => {
        this.renderer.setStyle(description, "opacity", "1");
        this.renderer.setStyle(description, "transform", "translateX(0)");
      }, 400);
    }

    features.forEach((feature, index) => {
      this.renderer.setStyle(feature, "opacity", "0");
      this.renderer.setStyle(feature, "transform", "translateX(30px)");

      setTimeout(
        () => {
          this.renderer.setStyle(feature, "opacity", "1");
          this.renderer.setStyle(feature, "transform", "translateX(0)");
        },
        500 + index * 100,
      );
    });
  }

  animateImageZoom(element: HTMLElement): void {
    const image = element.querySelector(".slide-image") as HTMLElement;
    if (image) {
      this.renderer.setStyle(image, "transform", "scale(1)");

      setTimeout(() => {
        this.renderer.setStyle(image, "transform", "scale(1.1)");
      }, 300);
    }
  }
}
