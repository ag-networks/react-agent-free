import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Home, DollarSign, Shield, Zap, Search, MapPin, ArrowRight } from 'lucide-react';
import '../App.css';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Agent Free</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="#how-it-works" className="text-muted-foreground hover:text-primary">How It Works</Link>
              <Link to="#pricing" className="text-muted-foreground hover:text-primary">Pricing</Link>
              <Link to="#about" className="text-muted-foreground hover:text-primary">About</Link>
              <Link to="#contact" className="text-muted-foreground hover:text-primary">Contact</Link>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Save <span className="text-primary">$15,000+</span> on Real Estate Commissions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get licensed attorney support for your real estate transactions at a fraction of traditional agent costs. 
            AI-powered contracts with legal expertise you can trust.
          </p>
          
          {/* Property Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-3 p-2 bg-white rounded-lg shadow-lg border">
              <div className="flex-1 flex items-center space-x-2 px-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter city, state, or ZIP code" 
                  className="border-0 focus-visible:ring-0 text-lg"
                />
              </div>
              <Button size="lg" className="md:w-auto w-full">
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8">
                Start Saving Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8">
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Agent Free?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Revolutionary approach to real estate transactions combining technology with legal expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Save Money</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Pay just $2,500 flat fee instead of 6% commission. Save $15,000+ on a $300k home purchase.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Legal Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Licensed attorneys review every contract and guide you through the entire transaction process.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Streamlined process with AI-generated contracts and automated document management.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare the Savings</h2>
            <p className="text-muted-foreground text-lg">
              See how much you can save with Agent Free
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Traditional Agent</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">$18,000</div>
                <p className="text-muted-foreground mb-4">6% commission on $300k home</p>
                <ul className="text-left space-y-2 text-sm">
                  <li>• High commission fees</li>
                  <li>• Limited attorney oversight</li>
                  <li>• Lengthy process</li>
                  <li>• Hidden costs</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-center text-primary">Agent Free</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">$2,500</div>
                <p className="text-muted-foreground mb-4">Flat fee + $500 refundable retainer</p>
                <ul className="text-left space-y-2 text-sm">
                  <li>• Transparent flat fee pricing</li>
                  <li>• Licensed attorney support</li>
                  <li>• AI-powered efficiency</li>
                  <li>• No hidden costs</li>
                </ul>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">Save $15,500!</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Save Thousands?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join the revolution in real estate transactions. Get started today.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Agent Free</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Agent Free. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

