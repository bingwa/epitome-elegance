'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { 
    name: 'Women', 
    href: '/women',
    children: [
      { name: 'Clothing', href: '/women/clothing' },
      { name: 'Bags', href: '/women/bags' },
      { name: 'Shoes', href: '/women/shoes' },
      { name: 'Jewelry', href: '/women/jewelry' },
    ]
  },
  { 
    name: 'Men', 
    href: '/men',
    children: [
      { name: 'Clothing', href: '/men/clothing' },
      { name: 'Bags', href: '/men/bags' },
      { name: 'Shoes', href: '/men/shoes' },
      { name: 'Jewelry', href: '/men/jewelry' },
    ]
  },
  { name: 'New Arrivals', href: '/new-arrivals' },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex px-4 pb-2 pt-5">
                <button
                  type="button"
                  className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation */}
              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="text-base font-medium text-gray-900 hover:text-gold-600"
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="mt-2 ml-4 space-y-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={onClose}
                            className="block text-sm text-gray-600 hover:text-gold-600"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Additional Links */}
              <div className="border-t border-gray-200 px-4 py-6">
                <div className="space-y-4">
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="block text-base font-medium text-gray-900 hover:text-gold-600"
                  >
                    Contact Us
                  </Link>
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="block text-base font-medium text-gray-900 hover:text-gold-600"
                  >
                    About Us
                  </Link>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-200 px-4 py-6">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Need help?</p>
                  <p>📧 support@epitomeelegance.co.ke</p>
                  <p>📱 +254 700 000 000</p>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
