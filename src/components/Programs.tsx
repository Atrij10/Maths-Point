import React from 'react';
import { BookOpen, Calculator, Trophy, Users, Clock, Star, MessageCircle } from 'lucide-react';

interface ProgramsProps {
  onNavigate?: (section: string) => void;
}

const Programs: React.FC<ProgramsProps> = ({ onNavigate }) => {
  const programs = [
    {
      title: 'Classes 9-10',
      description: 'Advanced algebra, trigonometry, and preparation for board examinations.',
      features: ['Board Exam Preperation (ICSE & CBSE)', 'Advanced Algebra', 'Trigonometry', 'Mock Tests'],
      icon: Trophy,
      color: 'blue',
    },
    {
      title: 'Classes 11-12',
      description: 'Calculus, advanced mathematics, and competitive exam preparation.',
      features: ['Board Exam Preperation (ISC & CBSE)', 'Calculus', 'JEE Preperation', 'Advanced Topics', 'Regular Assessments',],
      icon: Star,
      color: 'indigo',
    },
    {
      title: 'Competitive Exams',
      description: 'Specialized coaching for JEE, NEET, and other competitive examinations.',
      features: ['JEE Mains & Advanced', 'KVPY Exam', 'Mock Tests', 'Doubt Clearing'],
      icon: Trophy,
      color: 'purple',
    },
    {
      title: 'Group Classes',
      description: 'Interactive group sessions with peer learning and collaborative problem solving.',
      features: ['Small Batches', 'Peer Learning', 'Group Activities', 'Cost Effective'],
      icon: Users,
      color: 'teal',
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-600 border-blue-200',
      indigo: 'bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-600 border-indigo-200',
      purple: 'bg-gradient-to-br from-purple-100 to-pink-200 text-purple-600 border-purple-200',
      teal: 'bg-gradient-to-br from-teal-100 to-blue-200 text-teal-600 border-teal-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleLearnMore = () => {
    if (onNavigate) {
      onNavigate('contact');
    }
  };

  return (
    <section id="programs" className="py-20 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Our Mathematics Programs
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Comprehensive mathematics education tailored for every grade level, from foundational concepts 
            to advanced competitive exam preparation.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm border border-blue-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
              >
                {/* Icon and Title */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(program.color)} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                      {program.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {program.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button 
                  onClick={handleLearnMore}
                  className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 text-gray-700 py-2 px-4 rounded-lg font-medium hover:from-blue-100 hover:to-indigo-100 hover:text-indigo-600 transition-all duration-200 transform hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">One-to-One Interaction</h3>
            <p className="text-gray-700 leading-relaxed">Get individual attention to master every maths concept with confidence.</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Small Batch Size</h3>
            <p className="text-gray-700 leading-relaxed">Maximum 8-10 students per batch for personalized attention and better learning.</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
              <Trophy className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Results</h3>
            <p className="text-gray-700 leading-relaxed">95% of our students show significant improvement within 3 months.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;