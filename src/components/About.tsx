import React from 'react';
import { Award, BookOpen, Users, Star, GraduationCap, Trophy, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const achievements = [
    {
      icon: Award,
      title: 'FIETE Fellow',
      description: 'Fellow of the Institute of Electronics and Telecommunication Engineers',
      color: 'blue'
    },
    {
      icon: GraduationCap,
      title: 'Multiple Degrees',
      description: 'MCA, MBA, BCA, GNIIT - Comprehensive educational background',
      color: 'indigo'
    },
    {
      icon: BookOpen,
      title: '30+ Years Experience',
      description: 'Teaching Mathematics and Computer Science since 1995',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Multi-Board Expertise',
      description: 'Teaches for ICSE, CBSE, and other major educational boards',
      color: 'teal'
    }
  ];

  const highlights = [
    {
      icon: Trophy,
      title: 'Director & Founder',
      description: 'Leading Maths Point Educational Centre with vision and dedication'
    },
    {
      icon: Target,
      title: 'Visiting Lecturer',
      description: 'Techno India Engineering College - Sharing expertise at higher education level'
    },
    {
      icon: Heart,
      title: 'Prime Location',
      description: 'Conveniently located at Salt Lake near City Center 1 for easy accessibility'
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

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-indigo-400/8 to-purple-400/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About Our Director
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Meet the visionary educator who has been shaping mathematical minds for over three decades
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <img
                src="/image copy.png"
                alt="Arnab Mukherjee - Director of Maths Point Educational Centre"
                className="w-full h-[600px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating Achievement Card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-lg p-6 max-w-xs transform hover:scale-105 transition-transform duration-200">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Since 1995</div>
                  <div className="text-sm text-gray-600">Excellence in Education</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                ARNAB MUKHERJEE
              </h3>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <span className="font-semibold text-indigo-600">Fellow of the Institute of Electronics and Telecommunication Engineers</span>, 
                  MCA, MBA, FIETE, BCA, GNIIT, Director of Maths Point.
                </p>
                <p>
                  An experienced Mathematics teacher since <span className="font-semibold">1995</span>, 
                  Mr. Mukherjee brings over <span className="font-semibold text-indigo-600">30 years of dedicated teaching experience</span> 
                  to the field of mathematics education.
                </p>
                <p>
                  He teaches Mathematics and Computer Science from <span className="font-semibold">Class IX to XII</span> 
                  for all major educational boards, ensuring comprehensive coverage and excellent results.
                </p>
                <p>
                  Currently serving as a <span className="font-semibold text-purple-600">Visiting Lecturer at Techno India Engineering College</span>, 
                  he continues to share his expertise at the higher education level.
                </p>
                <p>
                  Our center is strategically located at <span className="font-semibold text-teal-600">Salt Lake near City Center 1</span>, 
                  providing easy accessibility for students across Kolkata.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">30+</div>
                <div className="text-sm text-gray-600">Years Teaching</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">500+</div>
                <div className="text-sm text-gray-600">Students Guided</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Professional Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-2"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(achievement.color)} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlights Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Key Highlights</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;