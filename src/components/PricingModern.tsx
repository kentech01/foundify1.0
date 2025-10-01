import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Check, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';

export function PricingModern() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
  
  const priceMonthly = 10;
  const priceAnnually = 10;
  
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900">
            Simple,{' '}
            <span className="bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
              Honest Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-premium-purple focus:ring-offset-2"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform ${
                  billingCycle === 'annually' ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${billingCycle === 'annually' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annually
            </span>
            {billingCycle === 'annually' && (
              <span className="ml-2 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold animate-in slide-in-from-right">
                <Sparkles className="h-3 w-3" />
                Save 17%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <Card className="relative border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-6 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <Zap className="h-3 w-3" />
                  Forever
                </div>
              </div>
              <div className="mb-2">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/ month</span>
              </div>
              <p className="text-gray-600">Perfect for experimenting</p>
            </CardHeader>
            
            <CardContent className="p-8 pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Pitch landing page generator</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">One-click PDF downloads</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Professional templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Create and export a basic landing page</span>
                </li>
              </ul>
              
              <Button 
                variant="outline"
                className="w-full py-6 rounded-xl border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative border-2 border-premium-purple shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl overflow-hidden transform lg:scale-105">
            {/* Popular badge */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-premium-purple to-deep-blue text-white text-center py-3 px-4">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">MOST POPULAR</span>
              </div>
            </div>

            <CardHeader className="p-8 pb-6 pt-16 bg-gradient-to-br from-premium-purple-50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Premium</h3>
              </div>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-premium-purple to-deep-blue bg-clip-text text-transparent">
                  ${billingCycle === 'monthly' ? priceMonthly : priceAnnually}
                </span>
                <span className="text-gray-600">/ month</span>
              </div>
              {billingCycle === 'annually' && (
                <p className="text-sm text-gray-600">Billed as ${priceAnnually * 12}/year</p>
              )}
              <p className="text-gray-600 mt-2">Everything you need to scale</p>
            </CardHeader>
            
            <CardContent className="p-8 pt-6">
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Professional hosted landing page</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Built-in analytics (page views, clicks)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Multiple premium templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">AI-assisted pitch building</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Invoice Generator</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Contract Templates (NDAs, agreements)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">360° Team Feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Investor Email Generator</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Remove "Made with Foundify" badge</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-premium-purple mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              
              <Button 
                className="w-full py-6 rounded-xl bg-gradient-to-r from-premium-purple to-deep-blue hover:from-premium-purple-dark hover:to-deep-blue-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start 14-Day Free Trial
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                No credit card required
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust badges */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-gray-600">Trusted by 5,000+ founders worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}