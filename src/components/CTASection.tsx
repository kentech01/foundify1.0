import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-premium-purple via-deep-blue to-premium-purple p-1">
          {/* Animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-premium-purple via-deep-blue to-premium-purple opacity-75 blur-xl"></div>
          
          <div className="relative bg-white rounded-3xl p-12 sm:p-16 lg:p-20">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-premium-purple/10 to-deep-blue/10 px-4 py-2 border border-premium-purple/20">
                <Sparkles className="h-4 w-4 text-premium-purple" />
                <span className="text-sm font-medium text-premium-purple-900">
                  Join 5,000+ founders
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
                Ready to Build Your Startup
                <br />
                <span className="bg-gradient-to-r from-premium-purple via-deep-blue to-premium-purple bg-clip-text text-transparent">
                  Like a Pro?
                </span>
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Start with our free pitch dashboard. Upgrade anytime to unlock all essential founder tools.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white px-10 py-7 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-7 rounded-2xl transition-all duration-300"
                >
                  Schedule a Demo
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600 pt-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}