const forgotPasswordCodeContent = (code: string) => {
    return `
<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;background:#f9f9f9">
    <div style="background:#dc2626;color:white;padding:15px;text-align:center;border-radius:8px 8px 0 0">
        <h2 style="margin:0">Password Reset Code</h2>
    </div>
    
    <div style="background:white;padding:25px;border-radius:0 0 8px 8px">
        <p>Use this code to reset your password:</p>
        
        <div style="text-align:center;margin:25px 0;padding:20px;background:#fef2f2;border:1px solid #fecaca">
            <div style="font-family:monospace;font-size:32px;font-weight:bold;letter-spacing:8px;color:#dc2626">
                ${code}
            </div>
            <p style="color:#991b1b;font-size:14px;margin-top:10px">
                ⏰ Expires in 10 minutes
            </p>
        </div>
        
        <p style="color:#666;font-size:14px;border-top:1px solid #eee;padding-top:20px;margin-top:20px">
            Didn't request this? Ignore this email.
        </p>
    </div>
</div>
`;
};

export default forgotPasswordCodeContent;