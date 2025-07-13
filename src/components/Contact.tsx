import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ExternalLink, CheckCircle, AlertCircle, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { contactService } from '../services/supabaseService';

// WhatsApp Icon Component
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63z"/>
  </svg>
);

// Enhanced Success Popup Component
const SuccessPopup: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden animate-slideUp">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 opacity-50"></div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/80 hover:bg-red-500 text-gray-600 hover:text-white rounded-full transition-all duration-200 z-10 flex items-center justify-center shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Success Content */}
        <div className="p-8 text-center relative z-10">
          {/* Animated Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-10 w-10 text-green-600 animate-pulse" />
          </div>

          {/* Success Message */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4 animate-fadeIn">
            🎉 Message Sent Successfully!
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Thank you for contacting <strong>Maths Point Educational Centre</strong>! 
            We have received your message and will get back to you within <strong>24 hours</strong>.
          </p>

          {/* Contact Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <p className="text-sm text-gray-700 mb-2 font-semibold">
              📞 For urgent inquiries, contact us directly:
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium">+91 98308 44440 | +91 94330 44440</p>
              <p className="font-medium">📧 maths.point95@gmail.com</p>
            </div>
          </div>

          {/* Confirmation Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center space-x-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Message saved to database & email sent</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Sent at {new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short'
              })}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '0.8s' }}
          >
            ✨ Got it, Thanks!
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-green-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    class: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = 'service_ct4qv5t';
  const EMAILJS_TEMPLATE_ID = 'template_maths_point';
  const EMAILJS_PUBLIC_KEY = 'GK9FdCeb1F2DhRp_o';

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+91 9830844440', '+91 9433044440'],
      color: 'blue'
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['maths.point95@gmail.com', 'arnab09@gmail.com'],
      color: 'indigo'
    },
    {
      icon: MapPin,
      title: 'Main Branch',
      details: ['Room Number 72 1st Floor, EC Block, Salt Lake, Sector 1, Bidhannagar, Kolkata, West Bengal 700064'],
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Operating Hours',
      details: ['Mon-Sat: 7:00 PM - 9:00 PM'],
      color: 'pink'
    }
  ];

  const branches = [
    {
      name: 'Main Branch',
      address: 'Room Number 72 1st Floor, EC Block, Salt Lake, Sector 1, Bidhannagar, Kolkata, West Bengal 700064',
      phone: ['+91 98308 44440', ' | +91 94330 44440'],
      timings: 'Mon-Sat: 7PM - 9PM'
    }    
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-gradient-to-br from-blue-100 to-indigo-200 text-blue-600 border-blue-200',
      indigo: 'bg-gradient-to-br from-indigo-100 to-purple-200 text-indigo-600 border-indigo-200',
      purple: 'bg-gradient-to-br from-purple-100 to-pink-200 text-purple-600 border-purple-200',
      pink: 'bg-gradient-to-br from-pink-100 to-rose-200 text-pink-600 border-pink-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // First, save to Supabase
      console.log('Saving contact message to Supabase...');
      const messageId = await contactService.addMessage({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        class: formData.class,
        message: formData.message
      });
      console.log('Message saved to Supabase with ID:', messageId);

      // Then, send email via EmailJS
      console.log('Sending email via EmailJS...');
      emailjs.init(EMAILJS_PUBLIC_KEY);
      
      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        student_class: formData.class || 'Not specified',
        message: formData.message,
        to_name: 'Maths Point Educational Centre',
        reply_to: formData.email,
        timestamp: new Date().toLocaleString('en-IN', { 
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        message_id: messageId // Include Supabase message ID for reference
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      console.log('Email sent successfully:', response);

      // Success handling
      setSubmitStatus('success');
      setShowSuccessPopup(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        class: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error in form submission:', error);
      setSubmitStatus('error');
      
      let errorMessage = 'Sorry, there was an error processing your message. ';
      
      if (error?.code?.includes('supabase')) {
        errorMessage += 'Database error occurred. ';
      } else if (error?.text) {
        console.log('EmailJS Error:', error.text);
        
        if (error.text.includes('412')) {
          errorMessage += 'Email service authentication issue. ';
        } else if (error.text.includes('template')) {
          errorMessage += 'Email template issue. ';
        } else if (error.text.includes('service')) {
          errorMessage += 'Email service issue. ';
        } else {
          errorMessage += 'Email sending failed. ';
        }
      } else {
        errorMessage += 'Please try again. ';
      }
      
      errorMessage += 'You can also contact us directly:\n\n📞 +91 98308 44440 | +91 94330 44440\n📧 maths.point95@gmail.com';
      
      setStatusMessage(errorMessage);
      
      // Clear error message after 10 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
        setStatusMessage('');
      }, 10000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle map click and open Google Maps
  const handleMapClick = () => {
    const googleMapsUrl = 'https://maps.app.goo.gl/vtbTMJpA9CvdVmxM6?g_st=iw';
    window.open(googleMapsUrl, '_blank');
  };

  // Function to handle WhatsApp
  const handleWhatsAppClick = () => {
    const phoneNumber = '+919830844440';
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    const defaultMessage = "Hello! I'm interested in learning more about Maths Point Educational Centre programs. Could you please provide more information?";
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      const appUrl = `whatsapp://send?phone=${cleanNumber}&text=${encodedMessage}`;
      const link = document.createElement('a');
      link.href = appUrl;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <>
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ready to start your mathematics journey? Contact us today for admissions and inquiries. We're here to help you excel in mathematics.
            </p>
          </div>

          {/* Quick Contact Info */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getColorClasses(info.color)} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-sm text-gray-700 leading-relaxed">{detail}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid - Two Equal Columns */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Send us a Message</h3>
              
              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-lg flex items-start space-x-3 bg-red-50 border border-red-200 text-red-800">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-medium leading-relaxed whitespace-pre-line">{statusMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your first name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your last name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your phone number"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <select 
                    name="class"
                    value={formData.class}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Class</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                    <option value="competitive">Competitive Exams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Tell us about your requirements or ask any questions"
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Branch Info, WhatsApp, and Map */}
            <div className="space-y-8">
              {/* Branch Information */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">Our Branch</h3>
                <div className="space-y-4">
                  {branches.map((branch, index) => (
                    <div key={index} className="border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{branch.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-700 leading-relaxed">{branch.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-700">{branch.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-700">{branch.timings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp Button */}
                <div className="mt-6">
                  <button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 hover:shadow-md"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    <span>WhatsApp Us</span>
                  </button>
                </div>
              </div>

              {/* Interactive Google Maps Section */}
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                    Find Us on Map
                  </h3>
                  <p className="text-gray-600">Click on the map to open in Google Maps</p>
                </div>
                
                <div 
                  onClick={handleMapClick}
                  className="relative rounded-xl h-64 flex items-center justify-center cursor-pointer group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-4 border-white shadow-lg"
                  style={{
                    backgroundImage: 'url(/image.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/40 transition-all duration-300"></div>

                  {/* Interactive Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-600/0 group-hover:from-blue-600/20 group-hover:to-indigo-600/20 transition-all duration-300"></div>

                  {/* Content */}
                  <div className="text-center relative z-10 group-hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl group-hover:shadow-3xl group-hover:scale-110 transition-all duration-300 border-4 border-white">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">
                      Maths Point Educational Centre
                    </h3>
                    <p className="text-white/90 mb-4 max-w-md mx-auto leading-relaxed text-sm drop-shadow-md">
                      Room Number 72, 1st Floor, EC Block, Salt Lake, Sector 1, Bidhannagar, Kolkata
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-white group-hover:text-blue-200 transition-colors duration-300">
                      <ExternalLink className="h-4 w-4 drop-shadow-md" />
                      <span className="font-medium drop-shadow-md text-sm">Open in Google Maps</span>
                    </div>
                  </div>

                  {/* Corner Decorations */}
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/70 opacity-70 group-hover:opacity-100 group-hover:border-white transition-all duration-300"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/70 opacity-70 group-hover:opacity-100 group-hover:border-white transition-all duration-300"></div>

                  {/* Animated Pulse Effect */}
                  <div className="absolute inset-0 rounded-xl border-2 border-white/50 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

                  {/* Click Indicator */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to open
                  </div>
                </div>

                {/* Additional Map Info */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-6 py-3 border border-blue-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Salt Lake, Sector 1, Kolkata</span>
                    </div>
                    <div className="w-px h-4 bg-gray-300"></div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">Mon-Sat: 7PM - 9PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Success Popup */}
      <SuccessPopup 
        isOpen={showSuccessPopup} 
        onClose={() => setShowSuccessPopup(false)} 
      />
    </>
  );
};

export default Contact;