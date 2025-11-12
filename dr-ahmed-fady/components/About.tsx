'use client';

import { useLanguage } from '@/lib/LanguageContext';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export default function About() {
  const { t, dir } = useLanguage();

  const qualifications = [
    t.about.qual1,
    t.about.qual2,
    t.about.qual3,
    t.about.qual4,
    t.about.qual5,
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`text-center mb-16 ${dir === 'rtl' ? 'text-right' : 'text-left'} md:text-center`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            {t.about.title}
          </h2>
          <p className="text-xl text-gray-600">{t.about.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=700&fit=crop"
                alt="Dr. Ahmed Fady at work"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm">{t.hero.experience}</div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={dir === 'rtl' ? 'text-right' : 'text-left'}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {t.about.description}
            </p>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {t.about.qualifications}
            </h3>

            <div className="space-y-4">
              {qualifications.map((qual, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <FaCheckCircle className="text-primary-500 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{qual}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
