import Lenis from "lenis";

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    autoRaf: true,

    // Important for things like href="#features"
    anchors: true,

    // Stops old scroll momentum when navigating
    stopInertiaOnNavigate: true,

    // Smoothness
    lerp: 0.1,
  });

  return {
    provide: {
      lenis,
    },
  };
});
