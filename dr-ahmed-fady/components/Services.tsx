'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FaTooth, FaSeedling, FaBrush, FaTeeth, FaHeart, FaCrown } from 'react-icons/fa';

export default function Services() {
  const { t, dir } = useLanguage();

  const services = [
    {
      icon: FaTooth,
      title: t.services.service1.title,
      description: t.services.service1.description,
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: FaSeedling,
      title: t.services.service2.title,
      description: t.services.service2.description,
      color: 'from-green-400 to-green-600',
    },
    {
      icon: FaTeeth,
      title: t.services.service3.title,
      description: t.services.service3.description,
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: FaBrush,
      title: t.services.service4.title,
      description: t.services.service4.description,
      color: 'from-pink-400 to-pink-600',
    },
    {
      icon: FaHeart,
      title: t.services.service5.title,
      description: t.services.service5.description,
      color: 'from-red-400 to-red-600',
    },
    {
      icon: FaCrown,
      title: t.services.service6.title,
      description: t.services.service6.description,
      color: 'from-yellow-400 to-yellow-600',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${dir === 'rtl' ? 'text-right' : 'text-left'} md:text-center`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.services.title}
          </h2>
          <p className="text-xl text-gray-600">{t.services.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
              <div className="p-8">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <service.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
