import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, Shield, Sparkles } from "lucide-react";

const onboardingSteps = [
  {
    icon: Eye,
    title: "Watch it Live",
    description: "See your food being prepared in real-time by verified vendors",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Trust it More",
    description: "Verified hygiene ratings and transparent cooking processes",
    color: "text-secondary",
  },
  {
    icon: Sparkles,
    title: "Order with Confidence",
    description: "Request live cooking sessions and track your order live",
    color: "text-accent",
  },
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/user/signin");
    }
  };

  const handleSkip = () => {
    navigate("/user/signin");
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-orange-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={handleSkip} 
            className="text-gray-600 hover:text-gray-900 rounded-xl"
          >
            Skip
          </Button>
        </div>

        <div className="space-y-8 text-center animate-fade-in">
          <div className={`mx-auto w-28 h-28 rounded-3xl bg-gradient-to-br from-primary/10 to-orange-100 flex items-center justify-center shadow-lg ${step.color}`}>
            <Icon className="w-14 h-14" strokeWidth={1.5} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{step.title}</h1>
            <p className="text-lg text-gray-600 leading-relaxed px-4">
              {step.description}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-4">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-10 bg-primary"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          size="lg"
          className="w-full text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl py-6 shadow-lg"
        >
          {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          <ChevronRight className="ml-2 w-5 h-5" />
        </Button>

        <p className="text-center text-xs text-gray-500 font-medium">
          Watch it Live. Trust it More.
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
