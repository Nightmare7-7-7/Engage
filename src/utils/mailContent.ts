const forgotPasswordCodeContent = (code: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
">
    <div style="
        background-color: #dc2626;
        color: white;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        text-align: center;
    ">
        <h1 style="margin: 0; font-size: 24px;">Password Reset Verification</h1>
    </div>
    
    <div style="
        background-color: white;
        padding: 30px;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    ">
        <p style="
            font-size: 16px;
            line-height: 1.6;
            color: #333;
            margin-bottom: 15px;
        ">
            We received a request to reset the password for your account. To proceed, please use the verification code below:
        </p>
        
        <div style="
            text-align: center; 
            margin: 30px 0;
            background-color: #fef2f2;
            padding: 25px;
            border-radius: 8px;
            border: 1px solid #fecaca;
        ">
            <p style="
                font-size: 14px;
                color: #7f1d1d;
                margin: 0 0 10px 0;
                font-weight: bold;
            ">
                🔐 Your Password Reset Code
            </p>
            
            <div style="
                font-family: 'Courier New', monospace;
                font-size: 36px;
                font-weight: bold;
                letter-spacing: 10px;
                color: #dc2626;
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                border: 2px solid #fecaca;
                display: inline-block;
                margin: 15px 0;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            ">
                ${code}
            </div>
            
            <p style="
                font-size: 14px;
                color: #991b1b;
                margin-top: 15px;
                font-weight: bold;
            ">
                ⏰ Expires in: <span style="color: #dc2626;">10 minutes</span>
            </p>
        </div>
        
        <div style="
            background-color: #fef3c7;
            padding: 16px;
            border-radius: 6px;
            border-left: 4px solid #d97706;
            margin: 25px 0;
        ">
            <h3 style="
                color: #92400e;
                margin: 0 0 10px 0;
                font-size: 16px;
            ">
                ⚠️ Important Security Information
            </h3>
            <ul style="
                font-size: 14px;
                color: #92400e;
                margin: 0;
                padding-left: 20px;
                line-height: 1.6;
            ">
                <li>This code is required to reset your password</li>
                <li>Never share this code with anyone</li>
                <li>Our support team will never ask for this code</li>
                <li>If you didn't request this, your account may be compromised</li>
            </ul>
        </div>
        
        <div style="
            background-color: #f0f9ff;
            padding: 16px;
            border-radius: 6px;
            border-left: 4px solid #0ea5e9;
            margin: 20px 0;
        ">
            <h3 style="
                color: #0369a1;
                margin: 0 0 10px 0;
                font-size: 16px;
            ">
                📝 What happens next?
            </h3>
            <ol style="
                font-size: 14px;
                color: #0369a1;
                margin: 0;
                padding-left: 20px;
                line-height: 1.6;
            ">
                <li>Enter this code on the password reset page</li>
                <li>Create a new strong password</li>
                <li>You'll be logged out of all other devices</li>
                <li>You can then log in with your new password</li>
            </ol>
        </div>
        
        <div style="
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
        ">
            <p style="
                font-size: 13px;
                color: #6b7280;
                margin: 5px 0;
            ">
                Didn't request a password reset? 
                <a href="${process.env.DOMAIN}/security" 
                   style="color: #dc2626; font-weight: bold; text-decoration: none;">
                    Secure your account now →
                </a>
            </p>
            <p style="
                font-size: 12px;
                color: #9ca3af;
                margin: 5px 0;
            ">
                Having trouble? 
                <a href="${process.env.DOMAIN}/contact" style="color: #6b7280;">Contact Support</a>
                or reply to this email
            </p>
        </div>
        
        <div style="
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #9ca3af;
            text-align: center;
        ">
            <p style="margin: 3px 0;">
                For your security, this request was made from IP: [Client IP will be logged]
            </p>
            <p style="margin: 3px 0;">
                If this wasn't you, please change your password immediately.
            </p>
        </div>
    </div>
</div>
</body>
</html>
`;
};

export default forgotPasswordCodeContent;