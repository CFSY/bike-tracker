import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import QRForm from "../components/qrform";
import Tracker from "../components/tracker";

function Setup() {
  const steps = [
    {
      component: QRForm,
      validate: (data) => data.id !== "",
    },
    {
      component: Tracker,
      validate: () => true,
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isStepValid, setStepValid] = useState(false);
  const [data, setData] = useState({ id: "" });

  useEffect(() => {
    setStepValid(steps[currentStep].validate(data));
  }, [data]);

  return (
    <div className="flex flex-col items-center">
      <CSSTransition
        in={true}
        timeout={300}
        classNames="transition-opacity duration-500"
      >
        <div>
          {React.createElement(steps[currentStep].component, { data, setData })}
        </div>
      </CSSTransition>
      {currentStep < steps.length - 1 ? (
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={`mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
            isStepValid ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isStepValid}
        >
          Next
        </button>
      ) : null}
    </div>
  );
}

export default Setup;
