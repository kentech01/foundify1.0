import React from "react";
import { Card } from "./ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder",
    company: "TechFlow AI",
    content:
      "Foundify saved me weeks. The pitch deck tool alone is worth 10x the price. Everything just works.",
    rating: 5,
    avatar: "SC",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Co-founder",
    company: "GrowthLabs",
    content:
      "The feedback coach changed how I communicate with my team. Best investment for early-stage founders.",
    rating: 5,
    avatar: "MJ",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Founder",
    company: "DesignCo",
    content:
      "From idea to investor pitch in 3 days. The professional results gave me the confidence I needed.",
    rating: 5,
    avatar: "ER",
  },
];

export function SocialProofModern() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="text-center space-y-2">
            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              10,000+
            </div>
            <div className="text-gray-600">Pitches Created</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              5,000+
            </div>
            <div className="text-gray-600">Happy Founders</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              4.9/5
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Loved by{" "}
            <span className="bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              Founders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of founders building better, faster
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="p-8 border-2 border-gray-100 hover:border-premium-purple/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-premium-purple to-deep-blue flex items-center justify-center text-white font-semibold shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
