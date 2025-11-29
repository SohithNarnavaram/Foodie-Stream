import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle2, Upload, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { HygieneBadge } from "@/components/HygieneBadge";
import { toast } from "sonner";

const VendorVerification = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState({
    businessLicense: "verified",
    identityProof: "verified",
    addressProof: "pending",
    bankAccount: "verified",
    hygieneCertificate: "verified",
  });

  const verificationSteps = [
    { id: "businessLicense", label: "Business License", icon: FileText, status: verificationStatus.businessLicense },
    { id: "identityProof", label: "Identity Proof", icon: Camera, status: verificationStatus.identityProof },
    { id: "addressProof", label: "Address Proof", icon: FileText, status: verificationStatus.addressProof },
    { id: "bankAccount", label: "Bank Account", icon: FileText, status: verificationStatus.bankAccount },
    { id: "hygieneCertificate", label: "Hygiene Certificate", icon: Shield, status: verificationStatus.hygieneCertificate },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 text-white">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const verifiedCount = Object.values(verificationStatus).filter((s) => s === "verified").length;
  const progress = (verifiedCount / verificationSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/profile")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Verification</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Verification Status */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Verification Status</h2>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overall Progress</span>
              <span className="text-sm font-semibold text-gray-900">{verifiedCount}/{verificationSteps.length}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="flex items-center gap-2">
            <VerifiedBadge />
            <HygieneBadge rating={4.5} />
          </div>
        </Card>

        {/* Verification Steps */}
        <div className="space-y-3">
          {verificationSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} className="p-4 border-0 shadow-food-card rounded-xl bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-50">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{step.label}</p>
                      <p className="text-xs text-gray-500">
                        {step.status === "verified" && "Verified on Jan 15, 2024"}
                        {step.status === "pending" && "Under review"}
                        {step.status === "rejected" && "Please resubmit"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(step.status)}
                    {step.status !== "verified" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info(`Upload ${step.label}`)}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Verification Benefits */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Verification Benefits</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Increased customer trust
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Priority in search results
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Access to premium features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Faster payout processing
            </li>
          </ul>
        </Card>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorVerification;


