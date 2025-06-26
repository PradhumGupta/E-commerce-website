import { motion } from 'framer-motion';

function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 flex items-center justify-center bg-base-100/70 backdrop-blur-sm z-[9999]" // Increased z-index
    >
      <div className="flex flex-col items-center gap-4">
        {/* DaisyUI Loading Spinner */}
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    </motion.div>
  );
}

export default LoadingSpinner;