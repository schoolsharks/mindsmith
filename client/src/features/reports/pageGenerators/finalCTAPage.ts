import finalCTAQR from "../../../assets/images/cta-qr.webp";

export const generateFinalCTAPage = () => {
  return `
    <div style="display:flex;height:100%;flex-direction:column;justify-content:space-between;">
        <div style="display:flex;gap:20px;">
            <div>
                <img src="${finalCTAQR}" style="width:"100px;" />
            </div>
            <div style="padding:22px;background-color:#A4B56E2B;border-radius:10px;">
                <h2 style="font-size:24px;font-weight:700;">Book a Therapy Consultation</h2>
                <p style="font-size:18px;font-weight:500;">Scan the QR to connect with a qualified mental health expert who can guide you through next steps.</p>
            </div>
        </div>
        <div style="padding:22px;background-color:#F6DC6B40;border-radius:10px;">
            <h2 style="font-size:24px;font-weight:700;">Disclaimer</h2>
            <p style="font-size:18px;font-weight:500;">This self-assessment tool is intended for screening purposes and assisted diagnosis only and does not constitute medical advice, or treatment roadmap. It is not a substitute for consultation with a qualified healthcare professional, kindly book a formal appointment for further investigation.</p>
        </div>
    </div>
    `;
};
