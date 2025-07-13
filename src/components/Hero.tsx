import React from 'react';
import { ArrowRight, Award, Users, BookOpen } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  return (
    <section id="home" className="pt-16 bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Empowering Students in 
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Mathematics</span>
                <br />with Conceptual Clarity and Confidence
              </h1>
              <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
                Unlock your mathematical potential with our comprehensive programs designed for students from Classes 9 to 12. 
                Our experienced faculty ensures every student achieves excellence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-lg mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">30+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex">
              <button
                onClick={() => onNavigate('programs')}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-1 hover:shadow-xl"
              >
                <span>Explore Programs</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.pexels.com/photos/8500701/pexels-photo-8500701.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students learning mathematics"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 max-w-xs transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Top Results</div>
                  <div className="text-sm text-gray-600">Board Exams 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;