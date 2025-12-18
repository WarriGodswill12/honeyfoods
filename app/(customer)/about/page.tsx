import { brand } from "@/config/brand";
import { FadeIn, StaggerChildren } from "@/components/shared/animated";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 lg:py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <FadeIn className="mb-10 sm:mb-12 lg:mb-16 text-center">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-black">
          About <span className="text-honey-gold">{brand.name}</span>
        </h1>
        <p className="mx-auto mt-4 sm:mt-5 lg:mt-6 max-w-2xl text-base sm:text-lg text-gray-600 px-4">
          {brand.tagline}
        </p>
      </FadeIn>

      {/* Story Section */}
      <FadeIn className="mb-10 sm:mb-12 lg:mb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading mb-4 sm:mb-5 lg:mb-6 text-2xl sm:text-3xl font-bold text-charcoal-black">
            Our Story
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Welcome to {brand.name}, where passion meets flavor. We believe
              that taste is everything, and that's why we pour our hearts into
              every pastry and food item we create.
            </p>
            <p>
              Founded with a simple mission: to bring premium, freshly-made
              pastries and food to your doorstep. We use only the finest
              ingredients, bake fresh daily, and ensure that every bite is an
              experience worth remembering.
            </p>
            <p>
              Our commitment to quality, taste, and customer satisfaction has
              made us a trusted name in Lagos, Nigeria. Whether it's a special
              occasion or just a craving for something sweet, we're here to make
              your day more delicious.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Values Section */}
      <div className="mb-16">
        <FadeIn className="mb-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-charcoal-black">
            Our Values
          </h2>
        </FadeIn>
        <StaggerChildren
          delay={0.15}
          className="flex flex-col md:flex-row gap-10 max-w-5xl mx-auto"
        >
          <div className="flex-1 bg-white p-8 rounded-3xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-honey-gold mb-5">
              <span className="text-3xl">✨</span>
            </div>
            <h3 className="font-heading mb-4 text-2xl font-bold text-charcoal-black">
              Quality First
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We never compromise on ingredients or taste. Every product meets
              our high standards before it reaches you.
            </p>
          </div>

          <div className="flex-1 bg-white p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-honey-gold mb-4 sm:mb-5">
              <span className="text-2xl sm:text-3xl">🍰</span>
            </div>
            <h3 className="font-heading mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-charcoal-black">
              Fresh Daily
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Everything is baked fresh every single day. No preservatives, no
              shortcuts, just pure goodness.
            </p>
          </div>

          <div className="flex-1 bg-white p-6 sm:p-7 lg:p-8 rounded-2xl sm:rounded-3xl shadow-sm">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-honey-gold mb-4 sm:mb-5">
              <span className="text-2xl sm:text-3xl">❤️</span>
            </div>
            <h3 className="font-heading mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-charcoal-black">
              Customer Love
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Your satisfaction is our priority. We go the extra mile to ensure
              you're happy with every order.
            </p>
          </div>
        </StaggerChildren>
      </div>

      {/* CTA Section */}
      <FadeIn className="bg-honey-gold py-16 px-8 text-center text-white rounded-[2.5rem] max-w-4xl mx-auto">
        <h2 className="font-heading mb-5 text-4xl font-bold tracking-tight">
          Ready to Order?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed opacity-95">
          Experience the difference that quality and passion make. Order now and
          taste why our customers keep coming back for more.
        </p>
        <a
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-charcoal-black px-10 py-4 text-lg font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Browse Products
        </a>
      </FadeIn>
    </div>
  );
}
