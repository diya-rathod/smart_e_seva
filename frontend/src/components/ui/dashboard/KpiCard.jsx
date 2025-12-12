import React from "react";
import { motion } from "framer-motion";
import { cardTitleClass, cardNumberClass, cardMetaClass } from "../../../styles/dashboardTypography";

const KpiCard = ({ title, value, icon, meta }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-black/5 bg-white/70 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex justify-end">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white">
          {icon}
        </span>
      </div>
      <p className={`mt-4 ${cardTitleClass}`}>{title}</p>
      <p className={`${cardNumberClass}`}>{value}</p>
      {meta && <p className={`mt-1 ${cardMetaClass}`}>{meta}</p>}
    </motion.div>
  );
};

export default KpiCard;

