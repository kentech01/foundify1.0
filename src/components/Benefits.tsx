import { Clock, Award, Rocket, Layout } from 'lucide-react';

const benefits = [
  {
    id: 1,
    title: 'Save Time',
    description: 'Ready-to-use templates and tools mean you can focus on building your business, not recreating the wheel',
    icon: Clock,
  },
  {
    id: 2,
    title: 'Professional Results',
    description: 'Look polished and credible without hiring expensive consultants or designers',
    icon: Award,
  },
  {
    id: 3,
    title: 'Everything You Need',
    description: 'From pitching investors to managing contracts, all essential founder tools in one place',
    icon: Rocket,
  },
  {
    id: 4,
    title: 'Seamless Dashboard',
    description: 'Beautiful, intuitive interface designed specifically for founders who move fast',
    icon: Layout,
  },
];

export function Benefits() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for Founders, By Founders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand the challenges of building a startup. That's why we created a platform that handles the essentials, so you can focus on what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.id} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-deep-blue to-premium-purple text-white mb-4 shadow-lg">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}