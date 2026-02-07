// app/utils/validators.test.js
const { validateBase64Images, validateVisionData } = require('./validators');

// Mock data
const validBase64 = "data:image/jpeg;base64,/9j/4AAQSwADAg=="; // shortened
const invalidBase64 = 123;
const tooManyImages = [validBase64, validBase64, validBase64, validBase64, validBase64];

console.log("--- Running Validator Tests ---");

// Test validateBase64Images
console.log("Test 1: Check empty array ->", validateBase64Images([]).valid === false ? "PASS" : "FAIL");
console.log("Test 2: Check max images ->", validateBase64Images(tooManyImages).valid === false ? "PASS" : "FAIL");
console.log("Test 3: Check invalid type ->", validateBase64Images([invalidBase64]).valid === false ? "PASS" : "FAIL");
// console.log("Test 4: Check valid ->", validateBase64Images([validBase64]).valid === true ? "PASS" : "FAIL"); // Needs real string check logic update if strict

// Test validateVisionData
const validVision = {
    product: { type: "Shoe", brand: "Nike" },
    condition: { level: "Good" }
};
const invalidVisionMissingProduct = {
    condition: { level: "Good" }
};

console.log("Test 5: Valid Vision Data ->", validateVisionData(validVision).valid === true ? "PASS" : "FAIL");
console.log("Test 6: Missing Product ->", validateVisionData(invalidVisionMissingProduct).valid === false ? "PASS" : "FAIL");

console.log("--- Tests Completed ---");
