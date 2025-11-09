import { Dialog, Transition } from '@headlessui/react';
import { Fragment, type PropsWithChildren, type ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
  description?: ReactNode;
}

const Drawer = ({ open, onClose, title, description, children }: DrawerProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md bg-white shadow-xl">
                  <div className="flex h-full flex-col overflow-y-auto">
                    <div className="flex items-start justify-between border-b border-border-subtle px-6 py-4">
                      <div>
                        <Dialog.Title className="text-lg font-semibold text-text-primary">
                          {title}
                        </Dialog.Title>
                        {description ? (
                          <Dialog.Description className="mt-1 text-sm text-text-secondary">
                            {description}
                          </Dialog.Description>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-transparent p-1 text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                        aria-label="Close drawer"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex-1 space-y-6 px-6 py-6">{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Drawer;
