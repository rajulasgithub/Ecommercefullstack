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
    formData.append('email', 'testcompany@example.com');
    formData.append('password', 'Password123!');
    
    // Create a dummy text file to act as the image
    const blob = new Blob(["test image content"], { type: "image/jpeg" });
    formData.append("image", blob, "test.jpg");

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
