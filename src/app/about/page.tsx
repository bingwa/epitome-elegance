'use client'

import { motion } from 'framer-motion'

// Corrected Animation variants - Framer Motion expects this structure
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] } }
}

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.3
    }
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Elegant Hero Section */}
      <motion.section 
        className="relative bg-black text-white py-32 lg:py-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/80"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
          >
            <h1 className="text-5xl lg:text-6xl font-serif font-light mb-8 leading-tight tracking-wide">
              About <span className="text-gold-500 font-normal">Epitome</span>
              <br />
              <span className="text-gold-500 font-normal">Elegance</span>
            </h1>
            <motion.div
              className="w-24 h-1 bg-gold-500 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto font-light">
              Where sophistication meets individuality, and every piece tells a story of elegance
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content with Elegant Spacing */}
      <motion.div 
        className="max-w-5xl mx-auto px-6 py-24"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Vision Section */}
        <motion.section 
          variants={fadeInLeft}
          className="mb-24"
        >
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <motion.h2 
                className="text-3xl lg:text-4xl font-serif font-light text-black mb-6 leading-tight tracking-wide"
                whileHover={{ color: '#D4AF37' }}
                transition={{ duration: 0.3 }}
              >
                Our Vision
              </motion.h2>
              <motion.div
                className="w-16 h-1 bg-gold-500 mb-8"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <div className="lg:col-span-8">
              <motion.p 
                className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                To be the <span className="font-medium text-black">ultimate symbol of elegance and style</span>, 
                redefining fashion as a powerful expression of confidence, class, and individuality across the globe.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <motion.section 
          variants={fadeInRight}
          className="mb-24"
        >
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-8 lg:order-1">
              <motion.p 
                className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                At Epitome Elegance, our mission is to <span className="font-medium text-black">go beyond clothing and accessories</span> by 
                curating timeless fashion that elevate personal image and inspire confidence. We are driven by a passion for style and a 
                commitment to making every client not just look smart, but feel 
                <span className="font-medium text-black"> unstoppable, empowered, and truly elegant</span>.
              </motion.p>
            </div>
            <div className="lg:col-span-4 lg:order-2">
              <motion.h2 
                className="text-3xl lg:text-4xl font-serif font-light text-black mb-6 leading-tight text-right tracking-wide"
                whileHover={{ color: '#D4AF37' }}
                transition={{ duration: 0.3 }}
              >
                Our Mission
              </motion.h2>
              <motion.div
                className="w-16 h-1 bg-gold-500 mb-8 ml-auto"
                initial={{ width: 0 }}
                whileInView={{ width: 64 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section 
          variants={fadeInUp}
          className="mb-16"
        >
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl lg:text-5xl font-serif font-light text-black mb-6 tracking-wide"
              whileHover={{ color: '#D4AF37' }}
              transition={{ duration: 0.3 }}
            >
              Our Values
            </motion.h2>
            <motion.div
              className="w-24 h-1 bg-gold-500 mx-auto mb-8"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              The principles that define who we are and guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Elegance */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 h-full transition-all duration-500 group-hover:shadow-medium group-hover:border-gold-200">
                <h3 className="text-xl font-serif font-normal text-black mb-4 tracking-wide">Elegance</h3>
                <p className="text-gray-600 leading-relaxed">
                  We embody sophistication, class, and the fine things in life.
                </p>
              </div>
            </motion.div>

            {/* Confidence */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 h-full transition-all duration-500 group-hover:shadow-medium group-hover:border-gold-200">
                <h3 className="text-xl font-serif font-normal text-black mb-4 tracking-wide">Confidence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every piece we offer is meant to uplift and empower.
                </p>
              </div>
            </motion.div>

            {/* Excellence */}
            <motion.div
              className="text-center group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white p-8 rounded-2xl shadow-soft border border-gray-100 h-full transition-all duration-500 group-hover:shadow-medium group-hover:border-gold-200">
                <h3 className="text-xl font-serif font-normal text-black mb-4 tracking-wide">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">
                  From products to service, we deliver nothing but the best.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="text-center bg-gradient-to-br from-black to-gray-900 text-white rounded-3xl p-12 lg:p-16 mt-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-3xl lg:text-4xl font-serif font-light mb-6 tracking-wide"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience True Elegance
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Discover pieces that don't just make you look exceptional—they make you feel unstoppable
          </motion.p>
          <motion.div
            className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.a
              href="/women"
              className="inline-block bg-gold-500 text-black px-8 py-4 font-bold rounded-xl hover:bg-gold-400 transition-colors duration-300 shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Women's Collection
            </motion.a>
            <motion.a
              href="/men"
              className="inline-block border-2 border-gold-500 text-gold-500 px-8 py-4 font-bold rounded-xl hover:bg-gold-500 hover:text-black transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Discover Men's Collection
            </motion.a>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  )
}
