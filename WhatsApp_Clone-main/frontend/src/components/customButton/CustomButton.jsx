import React, { forwardRef } from "react";
import './style.scss'
const CustomButton = forwardRef(({ type, children, form},ref) => {
  return (
    <>
      <button form={form} type={type} ref={ref}>
        {children}
      </button>
    </>
  );
});

export default CustomButton;
