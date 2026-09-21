const fs = require('fs');

async function test() {
  try {
    const formData = new FormData();
    formData.append('companyName', 'Test Company');
    formData.append('state', 'Test State');
    formData.append('district', 'Test District');
    formData.append('pincode', '123456');
    formData.append('contactNumber', '1234567890');
    formData.append('regNumber', 'REG123');
    formData.append('gstNumber', '22AAAAA0000A1Z5');
    formData.append('email', 'testcompany3@example.com');
    formData.append('password', 'Password123!');
    
    // Create a 1x1 transparent PNG blob for a valid image
    const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const binaryStr = atob(pngBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: "image/png" });
    formData.append("image", blob, "test.png");

    const response = await fetch('http://localhost:8080/auth/companysignup', {
      method: 'POST',
      body: formData
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    console.log("Body:", text);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();
