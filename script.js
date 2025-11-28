// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// ⚙️ Firebase config (تأكد إنه نفس الموجود بالكونسول عندك)
const firebaseConfig = {
  apiKey: "AIzaSyBFTTYrRyIKSt6xAmYtn7omwwKxa_Pd4Ww",
  authDomain: "customer-invoice-registration.firebaseapp.com",
  projectId: "customer-invoice-registration",
  storageBucket: "customer-invoice-registration.appspot.com",
  messagingSenderId: "340077803058",
  appId: "1:340077803058:web:5deaf000d8a4898b8f6e2b"
};

// 🔥 init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const form = document.getElementById("invoiceForm");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

// 🧾 submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.textContent = "";
  statusEl.className = "";

  const fullName = document.getElementById("fullName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const invoiceId = document.getElementById("invoiceId").value.trim();
  const fileInput = document.getElementById("invoiceImage");
  const file = fileInput.files[0];

  if (!fullName || !phone || !invoiceId || !file) {
    statusEl.textContent = "Please fill in all required fields and attach the invoice image.";
    statusEl.className = "error";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    // ✅ check if invoice already exists
    const docRef = doc(db, "invoices", invoiceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      statusEl.textContent = "This invoice has already been submitted.";
      statusEl.className = "error";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Invoice ✔";
      return;
    }

    // 📤 upload image to Storage
    const fileName = `${invoiceId}_${Date.now()}`;
    const storageRef = ref(storage, `invoices/${fileName}`);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    // 💾 save in Firestore
    await setDoc(docRef, {
      fullName,
      phone,
      invoiceId,
      imageUrl: downloadURL,
      createdAt: serverTimestamp()
    });

    statusEl.textContent = "Invoice has been submitted successfully. Thank you!";
    statusEl.className = "success";
    form.reset();
  } catch (err) {
    console.error("Submit error:", err);
    statusEl.textContent = "Unexpected error, please try again.";
    statusEl.className = "error";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit Invoice ✔";
});
